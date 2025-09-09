//  src/app/api/dashboard/owner/venues/[venueId]/courts/[courtId]/slots/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import moment from "moment";


type Params = { params: Promise<{ venueId: string, courtId: string }> };

// GET slots for a court
export async function GET(req: Request, { params }: Params) {
  try {
      const { venueId, courtId } = await params;
      const venueIdNum = parseInt(venueId, 10);
      const courtIdNum = parseInt(courtId, 10);

    // First verify if the court exists
    const court = await prisma.court.findUnique({
      where: {
        id: courtIdNum,
        venueId: venueIdNum,
      },
    });

    if (!court) {
      return NextResponse.json({ error: "Court not found" }, { status: 404 });
    }

    const slots = await prisma.slot.findMany({
      where: {
        courtId: courtIdNum,
      },
      orderBy: { startTime: "asc" },
    });

    // Return empty array if no slots found - this is a valid state
    return NextResponse.json(slots);
   
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}

//Genrate slots for a court
export async function POST(req: Request, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
       const { venueId, courtId } = await params;
      const venueIdNum = parseInt(venueId, 10);
      const courtIdNum = parseInt(courtId, 10);
        
        //const userId = parseInt(session.user.id, 10);
        const body = await req.json();
        const {startTime, endTime, duration, price} = body;

        // Create dates for today with the specified times
        const today = moment().format('YYYY-MM-DD');
        const start = moment(`${today} ${startTime}`).toDate();
        const end = moment(`${today} ${endTime}`).toDate();

        // console.log("Start:", start);
        // console.log("End:", end);
        // console.log("Duration:", duration);

        let current = new Date(start);
        const slotsToCreate = [];

        while (current < end) {
        const slotEnd = new Date(current.getTime() + duration * 60000);
        if (slotEnd > end) break;

        slotsToCreate.push({
            courtId : courtIdNum,
            startTime: new Date(current),
            endTime: slotEnd,
            price,
        });

        current = slotEnd;
        }

        //console.log("Slots to create:", slotsToCreate);

        if (slotsToCreate.length === 0) {
        return NextResponse.json({ error: "No slots to create" }, { status: 400 });
        }
        
        const createdSlots = await prisma.slot.createMany({
        data: slotsToCreate,
        });

        return NextResponse.json({
        message: "Slots generated successfully",
        count: createdSlots.count,
        });
    } catch (error) {
    console.error("Error generating slots:", error);
    return NextResponse.json({ error: "Failed to generate slots" }, { status: 500 });
  }
}


