import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  



  try {
    switch (event.type) {
        
        case "payment_intent.succeeded": {

            const intent = event.data.object as Stripe.PaymentIntent;

            //Update payment record
            const payment = await prisma.payment.update({
                where: { stripePaymentIntentId: intent.id },
                data: {
                    status: "SUCCEEDED",
                    receiptUrl: (intent as any).charges.data[0]?.receipt_url || null,
                },
            })

           
            if(payment.bookingId) {
                // Fetch booking and related info
                const booking = await prisma.booking.findUnique({
                    where: {id : payment.bookingId},
                    include: {
                        user: true, // Player
                        court: {
                            include:{
                                venue: {
                                    include:{
                                        owner: { include: { user: true } } //Venue owner
                                    }
                                }
                            }
                        }
                    }
                });

                if(booking) {
                    // Also update the booking status <-> CONFIRMED
                    await prisma.booking.update({
                        where: {id : payment.bookingId},
                        data: { status: "CONFIRMED"  }
                        });

                        //Notify player
                        await prisma.notification.create({
                            data: {
                                userId: booking.userId,
                                type: "BOOKING_CONFIRMED",
                                message: `Your booking for court "${booking.court.name}" at venue "${booking.court.venue.name}" on ${booking.startTime.toLocaleString()} has been confirmed.`,
                            }
                        });

                    //Notify owner
                            await prisma.notification.create({
                            data: {
                            userId: booking.court.venue.owner.userId,
                            type: "BOOKING_CONFIRMED",
                            message: `A booking for court "${booking.court.name}" at venue "${booking.court.venue.name}" on ${booking.startTime.toLocaleString()} has been confirmed.`,
                        }
                            });
                }
               
            }
            
            break;
        }



        case "payment_intent.payment_failed": {
            const intent = event.data.object as Stripe.PaymentIntent;

            //Update payment record
            const payment = await prisma.payment.update({
                where: {stripePaymentIntentId: intent.id},
                data: { status: "FAILED"},
            });

            // Also update the booking status <-> CANCELLED
            if(payment.bookingId) {
                await prisma.booking.update({
                    where: {id : payment.bookingId},
                    data: { status: "CANCELLED"  }
                });
            }
            break;
        }

        
        case "charge.refunded": {
            const charge = event.data.object as Stripe.Charge;

            //Update payment record
            const updatePayments = await prisma.payment.updateMany({
                where: { stripeChargeId: charge.id},
                data: { status: "REFUNDED" },
            });


            // If refund is tied to booking, mark it as CANCELLED
            if(updatePayments.count > 0) {
                const refundedPayment = await prisma.payment.findFirst({
                    where : { stripeChargeId: charge.id},
                });

                if(refundedPayment?.bookingId) {
                    await prisma.booking.update({
                        where: {id : refundedPayment.bookingId},
                        data: { status: "CANCELLED"  }
                    });
                }
            }
            break;
        }
           
        default: {
            console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
            

    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    
  }
}


 