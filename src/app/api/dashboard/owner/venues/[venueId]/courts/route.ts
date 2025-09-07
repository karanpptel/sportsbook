// src/app/api/dashboard/owner/venues/[id]/courts/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Params = { params: { venueId: string } };

// ✅ GET: List courts for a venue
export async function GET(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = Number(params.venueId);
    const courts = await prisma.court.findMany({
      where: { venueId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courts });
  } catch (err) {
    console.error("GET Venue Courts Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ✅ POST: Add a new court to a venue
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const venueId = Number(params.venueId);
    const body = await req.json();

    const owner = await prisma.facilityOwner.findUnique({ where: { userId } });
    if (!owner) return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });

    const venue = await prisma.venue.findUnique({ where: { id: venueId } });
    if (!venue || venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not allowed to add courts for this venue" }, { status: 403 });
    }

    const { name, sport, pricePerHour, openTime, closeTime } = body;

    const court = await prisma.court.create({
      data: { venueId, name, sport, pricePerHour, openTime, closeTime },
    });

    return NextResponse.json({ court });
  } catch (err) {
    console.error("POST Venue Court Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
