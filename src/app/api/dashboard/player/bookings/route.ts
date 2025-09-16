// src/app/api/dashboard/player/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



// GET - Fetch player's bookings
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const userId = parseInt(session.user.id, 10);
    
        const booking = await prisma.booking.findMany({
            where: {
                userId,
            },
            orderBy: { startTime: "desc" },
            include: {
                user: { select: { id: true, fullName: true, email: true } },
                court: { select: { id: true, name: true, sport: true, venueId: true } },
            },
        });
    
        return NextResponse.json({ booking });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
        
    }

}





//UPDATED CODE THAT create a new booking for a selected court and time slot, with idempotency key support (to prevent double bookings) and slot availability check.

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { courtId, userId, startTime, endTime, notes, idempotencyKey } = body;

        console.log('Booking Request:', {
            courtId,
            userId,
            startTime,
            endTime,
            idempotencyKey
        });

        // Validate required fields
        if (!courtId || !userId || !startTime || !endTime) {
            return NextResponse.json({ 
                error: "Missing required fields: courtId, userId, startTime, endTime" 
            }, { status: 400 });
        }

        // Validate that userId matches session user
        if (parseInt(session.user.id, 10) !== userId) {
            return NextResponse.json({ 
                error: "User ID mismatch" 
            }, { status: 403 });
        }

        // Check if booking with the same idempotency exists
        if (idempotencyKey) {
            const existing = await prisma.booking.findUnique({
                where: { idempotencyKey },
                include: {
                    court: true,
                    user: {
                        select: {
                            fullName: true,
                            email: true
                        }
                    }
                }
            });

            if (existing) {
                console.log('Found existing booking:', existing);
                return NextResponse.json({ 
                    booking: existing,
                    message: "Existing booking found" 
                }, { status: 200 });
            }
        }

        // Create Date objects for booking times
        const start = new Date(startTime);
        const end = new Date(endTime);

        console.log('Booking Debug:', {
            receivedStartTime: startTime,
            receivedEndTime: endTime,
            parsedStart: start.toISOString(),
            parsedEnd: end.toISOString(),
        });

        // Validate that the booking is not in the past
        const now = new Date();
        if (start < now) {
            return NextResponse.json({ error: "Cannot book slots in the past" }, { status: 400 });
        }

        // Use a transaction with increased timeout to handle concurrent bookings
        const booking = await prisma.$transaction(
          async (tx) => {
            console.log('Transaction started:', new Date().toISOString());
            // First check if the slot exists and is available with exact time match
            const slot = await tx.slot.findFirst({
                where: {
                    courtId,
                    AND: [
                        { startTime: start },
                        { isBooked: false }
                    ]
                }
            });

            if (!slot) {
                throw new Error("This slot is not available for booking");
            }

            // Check if the court exists (within transaction)
            const court = await tx.court.findUnique({
                where: { id: courtId }
            });

            if (!court) {
                throw new Error("Court not found");
            }

            // Check for overlapping bookings (within transaction)
            const overlappingBooking = await tx.booking.findFirst({
                where: {
                    courtId,
                    startTime: { lte: end },
                    endTime: { gte: start },
                    status: { in: ["PENDING", "CONFIRMED"] }
                }
            });

            if (overlappingBooking) {
                throw new Error("This time slot is already booked");
            }

            // Mark the slot as booked
            await tx.slot.update({
                where: { id: slot.id },
                data: { isBooked: true }
            });

            // If we get here, the slot is available, create the booking
            const booking = await tx.booking.create({
                data: {
                    courtId,
                    userId,
                    startTime: start,
                    endTime: end,
                    notes,
                    idempotencyKey,
                    status: "PENDING",
                    payment: {
                        create: {
                            amount: court.pricePerHour,
                            currency: court.currency,
                            status: "PENDING"
                        }
                    }
                },
                include: {
                    court: true,
                    user: {
                        select: {
                            fullName: true,
                            email: true
                        }
                    },
                    payment: true
                }
            });

            return booking;
          },
          {
            maxWait: 10000, // maximum time to wait for transaction to start
            timeout: 15000  // maximum time for the transaction to complete
          }
        );

        //console.log('Successfully created booking:', booking);
        return NextResponse.json({ 
            booking,
            message: "Booking created successfully" 
        }, { status: 201 });
    } catch (error) {
        console.error('Booking error:', error);
        
        if (error instanceof Error) {
            if (error.message === "Court not found") {
                return NextResponse.json({ error: "Court not found" }, { status: 404 });
            }
            if (error.message === "This slot is not available for booking") {
                return NextResponse.json({ error: "Selected time slot is not available" }, { status: 400 });
            }
            if (error.message === "This time slot is already booked") {
                return NextResponse.json({ error: "This time slot has already been booked" }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}