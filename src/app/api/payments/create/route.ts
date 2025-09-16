// src/app/api/payments/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {

    try {
        const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { court: { include: { venue: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: session.user.email!,
        line_items: [
            {
            price_data: {
                currency: booking.court.currency,
                unit_amount: booking.court.pricePerHour * 100,
                product_data: {
                name: `${booking.court.name} - ${booking.court.sport}`,
                description: `Venue: ${booking.court.venue.name}`,
                },
            },
            quantity: 1,
            },
        ],
        metadata: {
            bookingId: booking.id.toString(),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/player/bookings?status=SUCCEEDED`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/player/bookings?status=CANCELLED`,
        });

            // Save payment
        await prisma.payment.create({
        data: {
            bookingId: booking.id,
            stripePaymentIntentId: checkoutSession.id,
            status: "PENDING",
            amount: booking.court.pricePerHour * 100, 
            currency: "usd", // or booking.court.currency if dynamic
            
        },
        });

        return NextResponse.json({ sessionId: checkoutSession.id });
    } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
