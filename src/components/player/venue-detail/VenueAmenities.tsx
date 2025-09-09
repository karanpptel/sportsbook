// src/components/player/venue-detail/VenueAmenities.tsx
"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ParkingSquare, Lightbulb, Home, CircleDot } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  parking: <ParkingSquare className="w-4 h-4" />,
  lights: <Lightbulb className="w-4 h-4" />,
  indoor: <Home className="w-4 h-4" />,
  ball_rental: <CircleDot className="w-4 h-4" />,
};

export default function VenueAmenities({ amenities }: { amenities: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((a) => (
        <Badge key={a} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          <span className="mr-2 inline-flex items-center">{ICON_MAP[a] ?? null}</span>
          <span className="capitalize text-xs">{a.replace("_", " ")}</span>
        </Badge>
      ))}
    </div>
  );
}
