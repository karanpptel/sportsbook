// src/components/player/venue-detail/SlotBookingModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify"// optional toast utility
import { cn } from "@/lib/utils"; // shadcn helper for conditional classes
import { loadStripe } from "@stripe/stripe-js";
import { Badge } from "@/components/ui/badge";

// testign commit ..
//testing commit 2

interface Court {
  id: number;
  name: string;
  sport: string;
  pricePerHour: number;
  currency: string;
  openTime: number;
  closeTime: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'NOT_CREATED';
}

export default function SlotBookingModal({ court, venueId }: { court: Court; venueId: number }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Fetch available slots when date changes
  useEffect(() => {
      fetchAvailableSlots();
  }, [date, court.id]);

   async function fetchAvailableSlots() {
      if (!date || !court.id) return;
      
      setCheckingAvailability(true);
      try {
        const response = await fetch(`/api/dashboard/player/court/${court.id}?date=${date}`);
        if (!response.ok) throw new Error('Failed to fetch slots');
        
        const data = await response.json();
        console.log('Fetched Slot Data:', data);
        if (!data.slots || !Array.isArray(data.slots)) {
          throw new Error('Invalid slot data received');
        }

        // Reset time selection when date changes
        setTime("");
        setSlots(data.slots);

        console.log('Debug - Fetched Slots:', {
          date,
          courtId: court.id,
          slotsCount: data.slots.length,
          firstSlot: data.slots[0],
          lastSlot: data.slots[data.slots.length - 1]
        });

      } catch (error) {
        console.error('Error fetching slots:', error);
        toast.error('Failed to fetch available slots');
        setSlots([]); // Reset slots on error
      } finally {
        setCheckingAvailability(false);
      }
    }

  async function handleConfirm() {
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }

    if (!session) {
      toast.error("Please login to book a court");
      return;
    }

    setLoading(true);

  console.log("court in handleConfirm", court.id)

    try {
      // Create the booking time using the date and selected time slot in UTC
      //  const [hours] = time.split(':').map(Number);
      const startDateTime = `${date}T${time}:00Z`; // Add Z to make it UTC
      const startTime = new Date(startDateTime);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
      
      // console.log('Debug - Booking Times:', {
      //   startDateTime,
      //   startTimeISO: startTime.toISOString(),
      //   endTimeISO: endTime.toISOString(),
      //   startTimeLocal: startTime.toString(),
      //   endTimeLocal: endTime.toString()
      // });
      
      // Step 1: Create booking
      const bookingRes = await fetch("/api/dashboard/player/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courtId: court.id,
          userId: parseInt(session.user.id, 10),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: "", //   optional
          idempotencyKey: `${court.id}-${startTime.toISOString()}-${session.user.id}`,
        }),
      });

      const bookingData = await bookingRes.json();
      
      if (!bookingRes.ok) {
        // Show specific error message from the API
        throw new Error(bookingData.error || "Failed to create booking");
      }
        const bookingId = bookingData.booking?.id || bookingData.bookingId;

        // Step 2: Create Stripe checkout session
        const paymentRes = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });
        
         if (!paymentRes.ok) {
            const errorData = await paymentRes.json();
            throw new Error(errorData.error || "Failed to create payment session");
          }
          
        const {sessionId} = await paymentRes.json();

         if (!sessionId) {
            throw new Error("Could not retrieve payment session ID.");
        }
        //const clientSecret = paymentData.clientSecret;

        // Step 3: Show Stripe payment modal (use @stripe/stripe-js)
        // Example:
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

            if (stripe) {
            // --- FIX: Do not await the redirect and handle the potential error ---
            const result = await stripe.redirectToCheckout({ sessionId });

            // If redirectToCheckout fails, it will return an object with an error property.
            // This code will only execute if the redirect fails.
            if (result.error) {
              console.error("Stripe redirect error:", result.error.message);
              toast.error(result.error.message || "Failed to redirect to payment.");
            }
            
          } else {
            throw new Error("Stripe.js failed to load.");
          }

          // --- FIX: Remove the success toast and state resets from the success path ---
          // These lines should not be reached if the redirect is successful.
          // toast.success("Booking created! Please complete payment to confirm your booking.");
          // setOpen(false);
          // setDate("");
          // setTime("");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Booking or payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
          Book
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{`Book ${court.name}`}</DialogTitle>
          <DialogDescription>
            Select your preferred date and time slot to reserve this court.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Date Picker */}
          <div>
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => {
                setDate(e.target.value);
                setTime(""); // Reset selected time when date changes
              }}
              className="mt-1"
            />
          </div>

          {/* Time Slots */}
          <div>
            <Label className="text-sm font-medium">Time slot</Label>
            <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto pr-1">
          {checkingAvailability ? (
            <div className="col-span-3 text-center py-4 text-gray-500">
              Checking availability...
            </div>
          ) : slots.length > 0 ? (
            slots.map((slot) => {
              // Parse the UTC time string received from the API
              const slotDate = new Date(slot.startTime);
              
              // --- FIX: Use getUTCHours() to display the correct time ---
              // This ensures the time shown is the UTC hour, matching what the owner set,
              // regardless of the user's local browser timezone.
              const hours = slotDate.getUTCHours().toString().padStart(2, '0');
              const slotTime = `${hours}:00`;

              const isNotCreated = slot.status === 'NOT_CREATED';
              const isBooked = slot.status === 'BOOKED';

              return (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => setTime(slotTime)}
                  disabled={isBooked || isNotCreated}
                  className={cn(
                    "text-sm px-3 py-2 rounded-lg border transition-all duration-150 relative",
                    isBooked || isNotCreated
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : time === slotTime
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white hover:bg-slate-100"
                  )}
                >
                  {slotTime}
                  <Badge 
                    className={cn(
                      "absolute -top-2 -right-2 text-[10px] px-1",
                      isBooked
                        ? "bg-red-100 text-red-600"
                        : isNotCreated
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-100 text-green-600"
                    )}
                  >
                    {isNotCreated ? "unavailable" : slot.status.toLowerCase()}
                  </Badge>
                </button>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-4 text-gray-500">
              Select a date to see available slots
            </div>
          )}
        </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">
                {court.currency} {court.pricePerHour} / hour
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? "Booking..." : "Confirm"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}







// Here's a breakdown of what's happening: in generate simple timeslots from openTime-closeTime 
// This code generates an array of time slots based on the openTime and closeTime properties of the court object.

// Math.max(0, court.closeTime - court.openTime): This calculates the number of hours between openTime and closeTime. The Math.max function ensures that the result is not negative, in case closeTime is less than openTime.
// Array.from({ length: ... }, ...): This creates a new array with the calculated length. The Array.from method takes two arguments: an object with a length property, and a callback function.
// (_, i) =>
// ${(court.openTime + i).toString().padStart(2, "0")}:00``: This is the callback function that generates each time slot string. It takes two arguments: _ (which is ignored), and i, which is the index of the current iteration.
// Here's what happens inside the callback function:

// court.openTime + i: This adds the current index i to the openTime value, effectively incrementing the hour.
// (court.openTime + i).toString()
// : This converts the resulting hour value to a string.
// .padStart(2, "0"): This pads the hour string with leading zeros if necessary, to ensure it's always two digits long (e.g., "08" instead of "8").
// :00: This appends a colon and "00" to the hour string, creating a time slot in the format "HH:00" (e.g., "08:00").
// The resulting array times will contain time slots from openTime to closeTime, incrementing by one hour each. For example, if openTime is 8 and closeTime is 18, the times array might look like this:

// ["08:00", "09:00", "10:00", ..., "17:00"]

// This array is likely used to populate a dropdown or list of available time slots for booking.