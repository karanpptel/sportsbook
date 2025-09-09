// src/components/player/venue-detail/CourtCard.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import SlotBookingModal from "./SlotBookingModal";

interface Court {
  id: number;
  name: string;
  sport: string;
  pricePerHour: number;
  currency: string;
  openTime: number;
  closeTime: number;
  slotsAvailable?: number;
}

export default function CourtCard({ court, venueId }: { court: Court; venueId: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-tr from-emerald-50 to-white flex items-center justify-center">
          <div className="text-sm font-semibold">{court.sport}</div>
        </div>

        <div>
          <div className="text-sm font-semibold">{court.name}</div>
          <div className="text-xs text-slate-500 mt-1">Open: {court.openTime}:00 - {court.closeTime}:00</div>
          <div className="text-xs text-slate-500 mt-1">Slots available: {court.slotsAvailable ?? "—"}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-lg font-semibold">{court.currency} {court.pricePerHour}</div>
          <div className="text-xs text-slate-500">/ hour</div>
        </div>

        <div>
          <SlotBookingModal court={court} venueId={venueId} />
        </div>
      </div>
    </div>
  );
}
