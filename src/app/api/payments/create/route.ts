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

    if (!bookingId) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

   const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        court: { include: { venue: true } },
        payment: true // Include the related payment record
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // --- REFACTORED LOGIC ---


     // 1. If a payment record exists and already has a Stripe Session ID, reuse it.
    if (booking.payment?.stripePaymentIntentId) {
      // You could add logic here to check if the session is still valid, but for now, we just return it.
      return NextResponse.json({ sessionId: booking.payment.stripePaymentIntentId });
    }

         // 2. If we are here, we need to create a new Stripe Checkout Session.
        const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: session.user.email!,
        line_items: [
            {
            price_data: {
                currency: booking.court.currency.toLowerCase(),
                unit_amount: booking.court.pricePerHour * 100,
                product_data: {
                name: `${booking.court.name} - ${booking.court.sport}`,
                description: `Venue: ${booking.court.venue.name}`,
                images: booking.court.venue.photos.length > 0 ? [booking.court.venue.photos[0]] : [],
                },
            },
            quantity: 1,
            },
        ],
        metadata: {
            bookingId: booking.id.toString(),
             userId: session.user.id, 
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/player/bookings?status=SUCCEEDED&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/player/bookings?status=CANCELLED`,
        });


          if (!checkoutSession.id) {
              throw new Error("Failed to create Stripe checkout session.");
          }


          // --- FIX: Use `upsert` to create or update the payment record robustly ---
        await prisma.payment.upsert({
        where: { bookingId: booking.id },
        // Update the existing record if it was found
        update: {
            stripePaymentIntentId: checkoutSession.id,
            status: "PENDING",
        },
        // Create a new record if one didn't exist
        create: {
            bookingId: booking.id,
            stripePaymentIntentId: checkoutSession.id,
            status: "PENDING",
            amount: booking.court.pricePerHour,
            currency: booking.court.currency,
        },
    });
        console.log("response bheja");
        
        return NextResponse.json({ sessionId: checkoutSession.id });
    } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
