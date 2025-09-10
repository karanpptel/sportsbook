// src/app/api/dashboard/owner/venues/[venueId]/courts/[courtId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { recalcVenuePriceRange } from "@/lib/prismaHelper";

import { NextRequest } from "next/server";

// ✅ PATCH: Update a court
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ venueId: string; courtId: string }> }
) {
    const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = Number(params.venueId);
    const courtId = Number(params.courtId);
    const body = await request.json();
    const userId = Number(session.user.id);

    // Verify ownership
    const owner = await prisma.facilityOwner.findUnique({ where: { userId } });
    const courtToUpdate = await prisma.court.findUnique({
      where: { id: courtId },
      include: { venue: true },
    });

    if (!owner || !courtToUpdate || courtToUpdate.venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not allowed to update this court" }, { status: 403 });
    }

    const court = await prisma.court.update({
      where: { id: courtId },
      data: {
        name: body.name,
        sport: body.sport,
        pricePerHour: body.pricePerHour,
        currency: body.currency,
        openTime: body.openTime,
        closeTime: body.closeTime,
      },
    });

    // 🔄 Update min/max prices
    await recalcVenuePriceRange(venueId);

    return NextResponse.json({ court });
  } catch (err) {
    console.error("PATCH Court Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ✅ DELETE: Remove a court
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ venueId: string; courtId: string }> }
) {
    const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const venueId = Number(params.venueId);
    const courtId = Number(params.courtId);
    const userId = Number(session.user.id);

    const owner = await prisma.facilityOwner.findUnique({ where: { userId } });
    const courtToDelete = await prisma.court.findUnique({
      where: { id: courtId },
      include: { venue: true },
    });

    if (!owner || !courtToDelete || courtToDelete.venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not allowed to delete this court" }, { status: 403 });
    }

    await prisma.court.delete({ where: { id: courtId } });

    // 🔄 Update min/max prices
    await recalcVenuePriceRange(venueId);

    return NextResponse.json({ message: "Court deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Court Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}