// src/components/player/venue-detail/SlotBookingModal.tsx
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify"// optional toast utility

interface Court {
  id: number;
  name: string;
  sport: string;
  pricePerHour: number;
  currency: string;
  openTime: number;
  closeTime: number;
}

export default function SlotBookingModal({ court, venueId }: { court: Court; venueId: number }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

    try {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      const response = await fetch("/api/dashboard/player/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courtId: court.id,
          userId: parseInt(session.user.id, 10),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          idempotencyKey: `${court.id}-${startTime.toISOString()}-${session.user.id}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to book court");
      }

      setOpen(false);
      toast.success("Booking confirmed. Check your bookings page for details.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // generate simple timeslots from openTime-closeTime
  const times = Array.from(
    { length: Math.max(0, court.closeTime - court.openTime) },
    (_, i) => `${(court.openTime + i).toString().padStart(2, "0")}:00`
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Book</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Book {court.name}</h3>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <Label>Time slot</Label>
            <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-auto">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`text-sm px-3 py-2 rounded-lg border ${
                    time === t ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Price</div>
              <div className="font-medium">{court.currency} {court.pricePerHour} / hour</div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? "Booking..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
