import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Params = { params: { venueId: string, courtId: string } };

// GET slots for a court
export async function GET(
  req: Request,
  { params }: Params
) {
  try {
    const venueId = Number(params.venueId);
    const courtId = Number(params.courtId);
    const slots = await prisma.slot.findMany({
      where: { courtId },
      orderBy: { startTime: "asc" },
    });

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
        
        const courtId = parseInt(params.courtId, 10);
        
        const userId = parseInt(session.user.id, 10);
        const body = await req.json();
        const {startTime, endTime, duration, price} = body;

        const start = new Date(startTime);
        const end = new Date(endTime);

        let current = new Date(start);
        const slotsToCreate = [];

        while (current < end) {
        const slotEnd = new Date(current.getTime() + duration * 60000);
        if (slotEnd > end) break;

        slotsToCreate.push({
            courtId,
            startTime: new Date(current),
            endTime: slotEnd,
            price,
        });

        current = slotEnd;
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


