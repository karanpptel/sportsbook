// src/components/player/bookings/BookingDetailsModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: 'UTC',  // It's good practice to add this here too

  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: 'UTC',  // Ensures time is shown in UTC
    hour12: true,    // Use AM/PM for better readability
  });
}

export function BookingDetailsModal({
  booking,
  open,
  onOpenChange,
}: {
  booking: any;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(booking.status);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/player/bookings/${booking.id}/cancel`,
        { method: "PATCH" }
      );

      const data = await res.json();
      if (res.ok) {
        setStatus("CANCELLED");
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while cancelling booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Booking Details
          </DialogTitle>
          <DialogDescription>
            Review details for your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {booking.court?.name} ({booking.court?.sport})
            </h3>
            <Badge
              variant={
                status === "CONFIRMED"
                  ? "default"
                  : status === "PENDING"
                  ? "secondary"
                  : "destructive"
              }
            >
              {status}
            </Badge>
          </div>

          <p className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Venue #{booking.court?.venueId}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {formatDate(booking.startTime)}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
          </p>

          {booking.notes && (
            <p className="text-sm italic text-muted-foreground">
              Note: {booking.notes}
            </p>
          )}

          {["PENDING", "CONFIRMED"].includes(status) && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
              className="w-full mt-3"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Cancel Booking
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
