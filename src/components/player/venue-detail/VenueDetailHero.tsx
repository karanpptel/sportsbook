// src/components/player/venue-detail/VenueDetailHero.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react"; // replace with shadcn icon if you have one
import Image from "next/image";

interface Venue {
  id: number;
  name: string;
  city: string;
  rating: number;
  reviewsCount: number;
  photos: string[];
}

export default function VenueDetailHero({ venue }: { venue: Venue }) {

  
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="relative">
        <div className="h-60 sm:h-72 md:h-96 w-full relative">
          <Image
            src={venue.photos?.[0] || "/otp-page.jpg"}
            alt={`${venue.name} hero`}
            fill
            style={{ objectFit: "cover" }}
            className="brightness-[0.95]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        <div className="absolute left-6 bottom-6 right-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-semibold">{venue.name}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm md:text-base">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400" />
                <strong>{venue.rating}</strong>
              </span>
              <span className="opacity-90">·</span>
              <span>{venue.city}</span>
            </div>
            <div className="mt-3 flex gap-3">
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
                Save
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/5 rounded-lg p-2 text-white text-sm">
              <div className="text-xs opacity-90">Open</div>
              <div className="font-medium">6:00 - 23:00</div>
            </div>

            <div className="bg-white rounded-2xl p-2">
              <Image
                src="/profile.jpg"
                alt="owner"
                width={56}
                height={56}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
