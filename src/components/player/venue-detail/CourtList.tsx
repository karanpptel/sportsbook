// src/components/player/venue-detail/CourtList.tsx
"use client";
import React from "react";
import CourtCard from "./CourtCard";

export default function CourtList({ courts, venueId }: { courts: any[]; venueId: number }) {
  return (
    <div className="space-y-4">
      {courts.map((c) => (
        <CourtCard key={c.id} court={c} venueId={venueId} />
      ))}
    </div>
  );
}
