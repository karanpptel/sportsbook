// src/app/api/dashboard/venues/[venueId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateUniqueSlug } from "@/lib/slugify";


type paramsType = {
  params: Promise<{ venueId: string }>;
};

// // Helper to generate slug
// function slugify(text: string) {
//   return text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// }

// Update Venue
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: paramsType) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = parseInt((await params).venueId, 10);
    const body = await request.json();

    const { name, address, city, state, description, amenities, photos } = body;

    const updateData: any = { address, city, state, description };

    if (name) {
      updateData.name = name;
      updateData.slug = await generateUniqueSlug(name);
    }

    if (Array.isArray(amenities)) {
      updateData.amenities = amenities.filter((a) => typeof a === "string");
    }

    if (Array.isArray(photos)) {
      updateData.photos = photos.filter((p) => typeof p === "string");
    }

    const updatedVenue = await prisma.venue.update({
      where: { id: venueId },
      data: updateData,
    });

    return NextResponse.json({ venue: updatedVenue });
  } catch (error) {
    console.error("Update Venue Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}






// Delete venue
export async function DELETE(request: NextRequest, { params }: paramsType) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = parseInt((await params).venueId, 10);
    if (isNaN(venueId)) {
      return NextResponse.json({ error: "Invalid venue ID" }, { status: 400 });
    }

    // Get venue
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { id: true, ownerId: true },
    });

  // Get current owner's profile
  const ownerProfile = await prisma.facilityOwner.findUnique({
    where: { userId: Number(session.user.id) },
  });

  if (!venue || !ownerProfile || venue.ownerId !== ownerProfile.id) {
    return NextResponse.json({ error: "You are not allowed to delete this venue" }, { status: 403 });
  }


   // Delete venue
  await prisma.venue.delete({ where: { id: venueId } });


    return NextResponse.json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("Delete Venue Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
