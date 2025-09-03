// src/app/api/dashboard/owner/venues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Ensure logged-in owner
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    // Get FacilityOwner profile
    let ownerProfile = await prisma.facilityOwner.findUnique({
      where: { userId },
    });

    // Optional: create on-demand if not exists
    if (!ownerProfile) {
      ownerProfile = await prisma.facilityOwner.create({
        data: { userId },
      });
    }

    const ownerId = ownerProfile.id;

    // Fetch all venues for this owner
    const venues = await prisma.venue.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        approved: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ venues });
  } catch (error) {
    console.error("Owner Venues API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// Helper to create a slug from venue name
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // Replace spaces with -
    .replace(/[^\w\-]+/g, "")   // Remove all non-word chars
    .replace(/\-\-+/g, "-");    // Replace multiple - with single -
}



// Add venues
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    let ownerProfile = await prisma.facilityOwner.findUnique({ where: { userId } });
    if (!ownerProfile) {
      ownerProfile = await prisma.facilityOwner.create({ data: { userId } });
    }

    const ownerId = ownerProfile.id;

    const body = await req.json();
    const { name, address, city, state, description } = body;

    const slug = slugify(name);

    const venue = await prisma.venue.create({
      data: {
        ownerId,
        name,
        slug,           // ✅ must include
        address,
        city,
        state,
        description,
      },
    });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error("Add Venue Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}