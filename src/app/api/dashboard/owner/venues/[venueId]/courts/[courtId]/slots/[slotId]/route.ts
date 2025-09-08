import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type paramsType = {
    params: {slotId: string, courtId: string}
}

// ✅ PATCH: Update a slot
export async function PATCH(req: Request, { params }: paramsType) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courtId = Number(params.courtId);
    const slotId = Number(params.slotId);
    const body = await req.json();
    const userId = Number(session.user.id);

    // Verify ownership
    const owner = await prisma.facilityOwner.findUnique({ where: { userId } });
    const slotToUpdate = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { court: { include: { venue: true } } },
    });

    if (!owner || !slotToUpdate || slotToUpdate.court.venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not allowed to update this slot" }, { status: 403 });
    }

    const slot = await prisma.slot.update({
      where: { id: slotId },
      data: {
        startTime: body.startTime ? new Date(body.startTime) : slotToUpdate.startTime,
        endTime: body.endTime ? new Date(body.endTime) : slotToUpdate.endTime,
        price: body.price ?? slotToUpdate.price,
        isBooked: body.isBooked ?? slotToUpdate.isBooked,
      },
    });

    return NextResponse.json({ slot });
  } catch (err) {
    console.error("PATCH Slot Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, {params}: paramsType ) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);
        const slotId = parseInt(params.slotId);

        await prisma.slot.delete({
            where: {id: slotId}
        })
        return NextResponse.json({ message: "Slot deleted successfully" });
    } catch (error) {
    console.error("Error deleting slot:", error);
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
  }
}