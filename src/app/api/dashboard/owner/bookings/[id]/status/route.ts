// app/api/dashboard/owner/bookings/[id]/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find owner profile
    const owner = await prisma.facilityOwner.findUnique({
      where: { userId: Number(session.user.id) },
    });

    if (!owner) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }

    const bookingId = Number(params.id);
    const body = await request.json();
    const { status } = body; // should be one of your enum values: PENDING, APPROVED, REJECTED, CANCELLED


     if (!["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get booking first
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, court: { include: { venue: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

     // Ensure booking belongs to owner’s venue
    if (booking.court.venue.ownerId !== owner.id) {
      return NextResponse.json({ error: "Not authorized for this booking" }, { status: 403 });
    }

    // Validation: prevent invalid transitions
    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: `Cannot update booking once it's ${booking.status}` },
        { status: 400 }
      );
    }

    if (booking.status === "CONFIRMED" && status === "PENDING") {
      return NextResponse.json(
        { error: "Cannot revert a confirmed booking back to pending" },
        { status: 400 }
      );
    }



    //not required but good to have  <=> if needed than continue with this otherwise ignore---------->
    // Refund logic only if status → CANCELLED and payment exists
    if (status === "CANCELLED" && booking.payment && booking.payment.status === "SUCCEEDED") {
      if (!booking.payment.stripePaymentIntentId) {
        return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
      }

      // Refund with Stripe
      const refund = await stripe.refunds.create({
        payment_intent: booking.payment.stripePaymentIntentId,
      });

      // // Update Payment record
      // await prisma.payment.update({
      //   where: { id: booking.payment.id },
      //   data: { status: "REFUNDED", refundId: refund.id },
      // });
    }
    //------------------------------------------------------------------------------------------->

    // Update booking only if it belongs to this owner’s venue
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        court: { select: { id: true, name: true, sport: true, venueId: true } },
        payment: true,
      },
    });

  

    // ✅ Create notification for the player
    let notifType: "BOOKING_CONFIRMED" | "BOOKING_CANCELLED" | "BOOKING_FAILED" | "BOOKING_REFUNDED" | null =
      null;
    let message = "";

    if (status === "CONFIRMED") {
      notifType = "BOOKING_CONFIRMED";
      message = `Your booking for ${booking.court.name} (${booking.court.sport}) has been confirmed.`;
    } else if (status === "CANCELLED") {
      notifType = "BOOKING_CANCELLED";
      message = `Your booking for ${booking.court.name} (${booking.court.sport}) was cancelled by the venue.`;
    } else if (status === "COMPLETED") {
      // Optional: notify player booking is marked completed
      notifType = "BOOKING_CONFIRMED";
      message = `Your booking for ${booking.court.name} has been marked as completed.`;
    }

    if (notifType) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          type: notifType,
          message,
        },
      });
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (err) {
    console.error("Error updating booking status:", err);
    return NextResponse.json(
      { error: "Something went wrong while updating booking status" },
      { status: 500 }
    );
  }
}
