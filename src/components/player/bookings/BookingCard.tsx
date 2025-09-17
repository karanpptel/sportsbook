// src/components/player/bookings/BookingCard.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Loader2, 
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  StickyNote
} from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: 'UTC',  // It's good practice to add this here too
  });
}

function formatTime(dateStr: string) {
   // Tell the function to interpret and display the time in the UTC timezone
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: 'UTC',  // Ensures time is shown in UTC
    hour12: true,    // Use AM/PM for better readability
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return {
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    case 'PENDING':
      return {
        variant: 'secondary' as const,
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
      };
    case 'CANCELLED':
      return {
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    default:
      return {
        variant: 'outline' as const,
        icon: AlertCircle,
        color: 'text-slate-600',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200'
      };
  }
}
type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export function BookingCard({ booking }: { booking: any & { status: Status } }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(booking.status);
  const [open, setOpen] = useState(false);
  
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

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

  const isUpcoming = new Date(booking.startTime) > new Date();
  const isPast = new Date(booking.endTime) < new Date();

  return (
    <>
    <div className="cursor-pointer" onClick={() => setOpen(true)}>
    <Card className={`border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 ${statusConfig.borderColor} border-l-4`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
                  <Trophy className={`h-5 w-5 ${statusConfig.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {booking.court?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                      {booking.court?.sport}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Venue #{booking.court?.venueId}
                    </span>
                  </div>
                </div>
              </div>
              
              <Badge 
                variant={statusConfig.variant}
                className="flex items-center gap-1 px-3 py-1"
              >
                <StatusIcon className="h-3 w-3" />
                {status}
              </Badge>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Date</p>
                  <p className="font-medium text-slate-900">{formatDate(booking.startTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Clock className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Time</p>
                  <p className="font-medium text-slate-900">
                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <StickyNote className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">Note</p>
                  <p className="text-sm text-blue-800">{booking.notes}</p>
                </div>
              </div>
            )}

            {/* Time Status Indicator */}
            <div className="flex items-center gap-2">
              {isPast && (
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                  Completed
                </span>
              )}
              {isUpcoming && status === 'CONFIRMED' && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Upcoming
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {["PENDING", "CONFIRMED"].includes(status) && isUpcoming && (
            <div className="flex flex-col gap-2 lg:w-auto w-full">
              <Button
                onClick={handleCancel}
                disabled={loading}
                variant="outline"
                size="sm"
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cancel Booking
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
    <BookingDetailsModal
        booking={booking}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}