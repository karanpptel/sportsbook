// src/app/api/dashboard/owner/venues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get Owner Venues
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    let ownerProfile = await prisma.facilityOwner.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      ownerProfile = await prisma.facilityOwner.create({ data: { userId } });
    }

    const ownerId = ownerProfile.id;

    const venues = await prisma.venue.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        city: true,
        state: true,
        description: true,
        approved: true,
        amenities: true,
        photos: true,
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
import {generateUniqueSlug} from "@/lib/slugify";


// src/app/api/dashboard/owner/venues/route.ts
// Add Venue
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
    const { name, address, city, state, description, amenities = [], photos = [] } = body;

    // Validation: must be arrays of strings
    if (!Array.isArray(amenities) || !amenities.every((a) => typeof a === "string")) {
      return NextResponse.json({ error: "Invalid amenities format" }, { status: 400 });
    }
    if (!Array.isArray(photos) || !photos.every((p) => typeof p === "string")) {
      return NextResponse.json({ error: "Invalid photos format" }, { status: 400 });
    }

    const slug = await generateUniqueSlug(name);

    const venue = await prisma.venue.create({
      data: {
        ownerId,
        name: name,
        slug,
        address,
        city,
        state,
        description,
        amenities,
        photos,
        approved: false
      },
    });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error("Add Venue Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
