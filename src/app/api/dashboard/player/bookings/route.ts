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



// POST - Create a new booking
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const userId = parseInt(session.user.id, 10);
    
        const body = await req.json();
        const { courtId, startTime, endTime, notes } = body;

        if (!courtId || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if the court is already booked for the same time
            const conflict = await prisma.booking.findFirst({
            where: { courtId, startTime: new Date(startTime) },
            });

        if (conflict) {
            return NextResponse.json({ error: "This time slot is already booked" }, { status: 400 });
        }
    
        const booking = await prisma.booking.create({
            data: {
                userId,
                courtId,
                startTime : new Date(startTime),
                endTime : new Date(endTime),
                notes,
            },
        });
    
        return NextResponse.json({ booking }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}


// PATCH: update a booking (cancel)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //only allow cancel
        if (status !== "CANCELLED") {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
    
        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
    
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status },
        });
    
        if (!updatedBooking) {
            return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
        }
    
        return NextResponse.json({ booking });
    
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
        
    }
}