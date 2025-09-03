// src/app/api/venues/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


type paramsType = {
  params: {  id: string };
};

// Helper to generate slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function PATCH(req: Request, { params }: paramsType) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = parseInt(params.id, 10);

    const body = await req.json();
    const { name, address, city, state, description } = body;

    const updateData: any = { address, city, state, description };

    // Only update slug if name changed
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
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
export async function DELETE(req: Request, { params }: paramsType) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = parseInt(params.id, 10);

    // Optional: Check if this venue belongs to the logged-in owner
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { ownerId: true },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    if (venue.ownerId !== Number(session.user.id)) {
      return NextResponse.json({ error: "You are not allowed to delete this venue" }, { status: 403 });
    }

    // Delete the venue
    await prisma.venue.delete({
      where: { id: venueId },
    });

    return NextResponse.json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("Delete Venue Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
