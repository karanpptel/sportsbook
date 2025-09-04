// app/api/dashboard/owner/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the owner profile
    const owner = await prisma.facilityOwner.findUnique({
      where: { userId:  Number(session.user.id) },
    });

    if (!owner) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }

    // Fetch bookings for all courts of the owner's venues
    const bookings = await prisma.booking.findMany({
      where: {
        court: {
          venue: {
            ownerId: owner.id,
          },
        },
      },
      orderBy: { startTime: "desc" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        court: { select: { id: true, name: true, sport: true, venueId: true } },
        payment: true,
      },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    return NextResponse.json(
      { error: "Something went wrong while fetching bookings" },
      { status: 500 }
    );
  }
}
