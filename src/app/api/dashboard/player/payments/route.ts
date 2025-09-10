import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";


import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { bookingId, paymentMethod } = body;

        if(!bookingId || !paymentMethod) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //Fetch the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {court: true, payment: true}
        });

        if(!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if(booking.payment) {
            return NextResponse.json({ error: "Payment already exists for this booking" }, { status: 400 });
        }

        //calculate amount(court price per hour * duration of booking hours)
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const amount = booking.court.pricePerHour * durationHours;
        const amountInCents = Math.round(amount * 100);


        //create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, // smallest currency unit (e.g , paisa)
            currency: booking.court.currency.toLowerCase(),
            payment_method: paymentMethod,
            confirm: true,
            metadata: {bookingId: booking.id.toString() },
            expand: ["charges"],
        });

         // Map Stripe status to database status
        const getPaymentStatus = (stripeStatus: string) => {
            switch (stripeStatus) {
                case 'succeeded': return 'SUCCEEDED';
                case 'requires_payment_method': return 'FAILED';
                case 'requires_confirmation': return 'PENDING';
                case 'processing': return 'PENDING';
                default: return 'FAILED';
            }
        };


        // Save payment intent to database
        const payment = await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: amountInCents, // smallest currency unit (e.g , paisa)
                currency: booking.court.currency.toLowerCase(),
                status:  getPaymentStatus(paymentIntent.status),
                gateway: "stripe",
                stripePaymentIntentId: paymentIntent.id,
                paymentMethod,
                receiptUrl: (paymentIntent as any).charges?.data[0]?.receipt_url || null,  
            }
        })

        return NextResponse.json({ payment });
    } catch (error : any) {
        console.error("Payment creation failed:", error);
        return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
        
    }
}