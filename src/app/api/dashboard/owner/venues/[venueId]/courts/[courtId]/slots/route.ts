//  src/app/api/dashboard/owner/venues/[venueId]/courts/[courtId]/slots/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
//import { zonedTimeToUtc } from 'date-fns-tz/esm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ venueId: string; courtId: string }> }
) {
    const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user?.role !== "OWNER" && session.user?.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = parseInt(params.venueId, 10);
    const courtId = parseInt(params.courtId, 10);

    if (isNaN(venueId) || isNaN(courtId)) {
      return NextResponse.json({ error: "Invalid venue or court ID" }, { status: 400 });
    }

    // First verify if the court exists and belongs to the venue
    const court = await prisma.court.findUnique({
      where: {
        id: courtId,
        venueId: venueId,
      },
    });

    if (!court) {
      return NextResponse.json({ error: "Court not found" }, { status: 404 });
    }

    // Get slots for the court
    const slots = await prisma.slot.findMany({
      where: {
        courtId: courtId,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest, { params }: Params) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session || (session.user?.role !== "OWNER" && session.user?.role !== "ADMIN")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const venueId = parseInt(params.venueId, 10);
//     const courtId = parseInt(params.courtId, 10);

//     if (isNaN(venueId) || isNaN(courtId)) {
//       return NextResponse.json({ error: "Invalid venue or court ID" }, { status: 400 });
//     }

//     // First verify if the court exists and belongs to the venue
//     const court = await prisma.court.findUnique({
//       where: {
//         id: courtId,
//         venueId: venueId,
//       },
//     });

//     if (!court) {
//       return NextResponse.json({ error: "Court not found" }, { status: 404 });
//     }

//     const body = await req.json();
//     const { date, startTime, endTime, duration, price } = body;

//     if (!date || !startTime || !endTime || !duration || price === undefined) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Create time slots between start and end time
//     const slotDate = new Date(date);
//     const [startHour, startMinute] = startTime.split(":").map(Number);
//     const [endHour, endMinute] = endTime.split(":").map(Number);

//     const slots = [];
//     const durationInMs = duration * 60 * 1000; // Convert duration to milliseconds

//     let currentSlotStart = new Date(slotDate);
//     currentSlotStart.setHours(startHour, startMinute, 0, 0);

//     const endDateTime = new Date(slotDate);
//     endDateTime.setHours(endHour, endMinute, 0, 0);

//     while (currentSlotStart < endDateTime) {
//       const slotEnd = new Date(currentSlotStart.getTime() + durationInMs);
      
//       // Don't create slots that extend beyond the end time
//       if (slotEnd > endDateTime) break;

//       slots.push({
//         courtId,
//         startTime: currentSlotStart,
//         endTime: slotEnd,
//         price,
//         isBooked: false,
//       });

//       currentSlotStart = slotEnd;
//     }

//     // Create all slots in a transaction
//     const createdSlots = await prisma.$transaction(
//       slots.map((slot) =>
//         prisma.slot.create({
//           data: slot,
//         })
//       )
//     );

//     return NextResponse.json(createdSlots);
//   } catch (error) {
//     console.error("Error creating slots:", error);
//     return NextResponse.json(
//       { error: "Failed to create slots" },
//       { status: 500 }
//     );
//   }
// }


  // --- In your BACKEND API route file, e.g., /api/.../slots/route.ts ---

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ venueId: string; courtId: string }> }
) {
    const params = await context.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "OWNER") {
        }
        
        const { courtId } = await context.params;
        const courtIdNum = parseInt(courtId, 10);
        
        // --- CHANGE 1: Receive the new 'date' field from the body ---
        const body = await request.json();
        const { date, startTime, endTime, duration, price } = body;

        // Add validation for the new date field
        if (!date || !startTime || !endTime || !duration || price === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // --- END CHANGE 1 ---
        
        // --- CHANGE 2: Use the provided date string to create the slots ---
        // Instead of using `new Date()`, we construct date strings from the input
        // This ensures slots are created for the selected date, not just today
        const startDateTimeString = `${date}T${startTime}:00`; // e.g., "2024-09-12T09:00:00"
        const endDateTimeString = `${date}T${endTime}:00`;     // e.g., "2024-09-12T22:00:00"

        //  const start = zonedTimeToUtc(startDateTimeString, timeZone);
        // const end =  zonedTimeToUtc(endDateTimeString, timeZone);
        const start = new Date(startDateTimeString);
        const end = new Date(endDateTimeString);
        //--- END CHANGE 2 ---
        
        let current = new Date(start);
        const slotsToCreate: { courtId: number; startTime: Date; endTime: Date; price: number }[] = [];

        while (current < end) {
            const slotEnd = new Date(current.getTime() + duration * 60000);
            if (slotEnd > end) break;

            slotsToCreate.push({
                courtId: courtIdNum,
                startTime: new Date(current),
                endTime: slotEnd,
                price,
            });

            current = slotEnd;
        }
       


        if (slotsToCreate.length === 0) {
            return NextResponse.json({ error: "No slots could be generated with the given times." }, { status: 400 });
        }
        
        // This transaction correctly deletes old slots and creates new ones
        const result = await prisma.$transaction(async (tx) => {
            await tx.slot.deleteMany({
                where: {
                    courtId: courtIdNum,
                },
            });

            const createdSlots = await tx.slot.createMany({
                data: slotsToCreate,
            });

            return createdSlots;
        });

        return NextResponse.json({
            message: "Slots generated successfully",
            count: result.count,
        });
    } catch (error) {
        console.error("Error generating slots:", error);
        return NextResponse.json({ error: "Failed to generate slots" }, { status: 500 });
    }
}
