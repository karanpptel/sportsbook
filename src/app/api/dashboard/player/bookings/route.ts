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
// export async function POST(req: NextRequest) {
//     try {
//         const session = await getServerSession(authOptions);
    
//         if (!session || session.user?.role !== "USER") {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }
    
//         const userId = parseInt(session.user.id, 10);
    
//         const body = await req.json();
//         const { courtId, startTime, endTime, notes } = body;

//         if (!courtId || !startTime || !endTime) {
//             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//         }

//         // Check if the court is already booked for the same time
//             const conflict = await prisma.booking.findFirst({
//             where: { courtId, startTime: new Date(startTime) },
//             });

//         if (conflict) {
//             return NextResponse.json({ error: "This time slot is already booked" }, { status: 400 });
//         }
    
//         const booking = await prisma.booking.create({
//             data: {
//                 userId,
//                 courtId,
//                 startTime : new Date(startTime),
//                 endTime : new Date(endTime),
//                 notes,
//             },
//         });
    
//         return NextResponse.json({ booking }, { status: 201 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
//     }
// }

//UPDATED CODE THAT create a new booking for a selected court and time slot, with idempotency key support (to prevent double bookings) and slot availability check.

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { courtId, userId, startTime, endTime, notes, idempotencyKey } = body;


        //Check if booking with the same idempotency exists
        if(idempotencyKey) {
            const existing = await prisma.booking.findUnique({
                where: { idempotencyKey },
            });

            if (existing) {
                return NextResponse.json({ error: "Booking already exists with the same idempotency key" }, { status: 400 });
            }
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        //Check if the court is  exists 
        const court =   await prisma.court.findUnique({
            where: { id: courtId },
        });

        if (!court) {
            return NextResponse.json({ error: "Court not found" }, { status: 404 });
        }
        

        // Check if slot is available
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                courtId,
                startTime: { lte: end },
                endTime: { gte: start },
            }
        });


        if (overlappingBooking) {
            return NextResponse.json({ error: "Slot is already booked" }, { status: 400 });
        }


        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                courtId,
                startTime: start,
                endTime: end,
                status: "PENDING",
                notes,
                idempotencyKey,
            },
        })

        return NextResponse.json({ booking }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
        
    }
}

