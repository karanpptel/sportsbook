// src/app/api/dashboard/owner/courts/[courtId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Params = { params: { courtId: string } };


// ✅ PATCH: Update a court
export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courtId = Number(params.courtId);
    const body = await req.json();
    const userId = Number(session.user.id);

    // Verify ownership
    const owner = await prisma.facilityOwner.findUnique({ where: { userId } });
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { venue: true },
    });

    if (!owner || !court || court.venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not allowed to update this court" }, { status: 403 });
    }

    const updatedCourt = await prisma.court.update({
      where: { id: courtId },
      data: {
        name: body.name ?? undefined,
        sport: body.sport ?? undefined,
        pricePerHour: body.pricePerHour ?? undefined,
        // openTime: body.openTime ?? undefined,
        // closeTime: body.closeTime ?? undefined
      },
    });

    return NextResponse.json({ court: updatedCourt });
  } catch (err) {
    console.error("PATCH Court Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ✅ DELETE: Remove a court
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courtId = Number(params.courtId);
    const userId = Number(session.user.id);

    const owner = await prisma.facilityOwner.findUnique({ where: { userId } });
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { venue: true },
    });

    if (!owner || !court || court.venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not allowed to delete this court" }, { status: 403 });
    }

    await prisma.court.delete({ where: { id: courtId } });

    return NextResponse.json({ message: "Court deleted successfully" });
  } catch (err) {
    console.error("DELETE Court Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}