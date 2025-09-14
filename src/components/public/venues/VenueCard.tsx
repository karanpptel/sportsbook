// src/components/public/venues/VenueCard.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VenueCard({ venue }: { venue: any }) {
  return (
    <Card className="hover:shadow-lg transition">
      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-40 object-cover rounded-t-2xl"
      />
      <CardHeader>
        <CardTitle>{venue.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{venue.location}</p>
      </CardContent>
    </Card>
  );
}
