// src/components/player/bookings/BookingsList.tsx
import React from "react";
import { BookingCard } from "./BookingCard";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingsList({ bookings }: { bookings: any[] }) {
  if (!bookings.length) {
    return (
      <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-6">
              <Calendar className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start your sports journey by exploring and booking amazing venues near you.
            </p>
            <Button asChild className="rounded-full px-8">
              <a href="/player/venues" className="inline-flex items-center gap-2">
                Explore Venues
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Your Bookings</h2>
        <p className="text-sm text-slate-600">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}