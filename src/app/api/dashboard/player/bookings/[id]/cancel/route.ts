// src/app/api/dashboard/player/bookings/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = Number(params.id);
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { court: { include: { venue: true } }, user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== Number(session.user.id)) {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }

    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
      return NextResponse.json({ error: "Booking already closed" }, { status: 400 });
    }

    // ✅ Cancel booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // ✅ Notify Owner about cancellation
    await prisma.notification.create({
      data: {
        userId: booking.court.venue.ownerId, // owner of this venue
        type: "BOOKING_CANCELLED",
        message: `Booking for ${booking.court.name} (${booking.court.sport}) was cancelled by ${booking.user.fullName}.`,
      },
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return NextResponse.json(
      { error: "Something went wrong while cancelling booking" },
      { status: 500 }
    );
  }
}