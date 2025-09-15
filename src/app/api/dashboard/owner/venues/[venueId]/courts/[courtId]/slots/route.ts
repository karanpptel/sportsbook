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

        // Validate date format and ensure it's not in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(selectedDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        if (selectedDate < today) {
            return NextResponse.json({ error: "Cannot create slots for past dates" }, { status: 400 });
        }

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return NextResponse.json({ error: "Invalid time format. Use HH:mm" }, { status: 400 });
        }

        // Validate price and duration
        if (price < 0) {
            return NextResponse.json({ error: "Price cannot be negative" }, { status: 400 });
        }

        if (duration <= 0 || duration > 480) { // max 8 hours
            return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
        }
        
        // --- CHANGE 2: Use the provided date string to create the slots ---
        // Instead of using `new Date()`, we construct date strings from the input
        // This ensures slots are created for the selected date, not just today
        const startDateTimeString = `${date}T${startTime}:00Z`; // e.g., "2024-09-12T09:00:00Z"
        const endDateTimeString = `${date}T${endTime}:00Z`;     // e.g., "2024-09-12T22:00:00Z"

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
        
        // Only delete slots for the specific date that don't have any bookings
        const result = await prisma.$transaction(async (tx) => {
            // Convert date string to start and end of day for comparison
            const dateStart = new Date(date);
            dateStart.setUTCHours(0, 0, 0, 0);
            
            const dateEnd = new Date(date);
            dateEnd.setUTCHours(23, 59, 59, 999);

            // Find any existing bookings for this date range
            const existingBookings = await tx.booking.findMany({
                where: {
                    courtId: courtIdNum,
                    startTime: {
                        gte: dateStart,
                        lte: dateEnd
                    },
                    status: {
                        in: ['CONFIRMED', 'PENDING']
                    }
                },
                select: {
                    startTime: true,
                    endTime: true
                }
            });

            // Delete only unbookedslots for this specific date
            await tx.slot.deleteMany({
                where: {
                    courtId: courtIdNum,
                    startTime: {
                        gte: dateStart,
                        lte: dateEnd
                    },
                    isBooked: false
                },
            });

            // Filter out slots that would overlap with existing bookings
            const nonOverlappingSlots = slotsToCreate.filter(slot => {
                return !existingBookings.some(booking => {
                    return (slot.startTime >= booking.startTime && slot.startTime < booking.endTime) ||
                           (slot.endTime > booking.startTime && slot.endTime <= booking.endTime);
                });
            });

            if (nonOverlappingSlots.length === 0) {
                return { count: 0, message: "No new slots could be created due to existing bookings" };
            }

            const createdSlots = await tx.slot.createMany({
                data: nonOverlappingSlots,
            });

            return {
                count: createdSlots.count,
                message: nonOverlappingSlots.length < slotsToCreate.length 
                    ? "Some slots were skipped due to existing bookings"
                    : "All slots created successfully"
            };
        });

        return NextResponse.json({
            message: result.message,
            count: result.count,
        });
    } catch (error) {
        console.error("Error generating slots:", error);
        
        // Handle specific error cases
        if (error instanceof Error) {
            if (error.message.includes("Unique constraint")) {
                return NextResponse.json({ 
                    error: "Duplicate slots detected for this time period" 
                }, { status: 400 });
            }
            
            if (error.message.includes("Court not found")) {
                return NextResponse.json({ 
                    error: "Court not found or no permission to create slots" 
                }, { status: 404 });
            }

            return NextResponse.json({ 
                error: error.message 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to generate slots",
            details: "An unexpected error occurred while creating slots"
        }, { status: 500 });
    }
}
