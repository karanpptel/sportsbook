// src/components/player/VenueCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export type Venue = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  amenities?: string[];
  photos?: string[];
  minPricePerHour?: number;
  maxPricePerHour?: number;
  approved?: boolean;
  rating?: number;
};


export default function VenueCard({ venue }: { venue: Venue }) {
  const priceLabel = venue.minPricePerHour
    ? `₹${(venue.minPricePerHour / 1).toLocaleString()} / hr`
    : "Contact";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
      <div className="relative h-44 w-full bg-slate-100">
        <Image
          src={venue.photos?.[0] ?? "/window.svg"}
          alt={venue.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/80 text-slate-800">
            {venue.city}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold">{(venue.rating ?? 0).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 leading-tight">{venue.name}</h3>
            <p className="text-sm text-slate-500">{venue.address}{venue.city ? ` • ${venue.city}` : ""}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">From</div>
            <div className="text-lg font-semibold text-slate-900">{priceLabel}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(venue.amenities || []).slice(0, 3).map((a) => (
              <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
            ))}
            {venue.amenities && venue.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">+{venue.amenities.length - 3}</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/player/venues/${venue.id}`}>
              <Button size="sm">View</Button>
            </Link>
            <Link href={`/player/venues/${venue.id}#book`}>
              <Button size="sm" variant="secondary">Book</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
