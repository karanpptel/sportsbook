// src/components/player/VenueFilters.tsx
"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  cities: string[];
  selectedCity?: string | null;
  onCityChange: (c: string | null) => void;
  selectedSport?: string | null;
  onSportChange: (s: string | null) => void;
  sortBy: "featured" | "price_asc" | "price_desc" | "rating";
  onSortChange: (s: "featured" | "price_asc" | "price_desc" | "rating") => void;
  selectedAmenities: string[];
  onAmenitiesChange: (a: string[]) => void;
};

const SPORT_OPTIONS = ["Tennis", "Badminton", "Football", "Basketball", "Cricket", "Squash"];
const AMENITY_OPTIONS = ["Parking","Lights","WiFi","Seating Area","Cafeteria","Restrooms","First Aid", "Equipment Rental", "Locker Room"];

export default function VenueFilters({
  cities,
  selectedCity,
  onCityChange,
  selectedSport,
  onSportChange,
  sortBy,
  onSortChange,
  selectedAmenities,
  onAmenitiesChange,
}: Props) {
  function toggleAmenity(a: string) {
    if (selectedAmenities.includes(a)) {
      onAmenitiesChange(selectedAmenities.filter((x) => x !== a));
    } else {
      onAmenitiesChange([...selectedAmenities, a]);
    }
  }

  return (
    <aside className="space-y-4">
      <div className="bg-white border border-slate-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Filters</h4>
          <button
            className="text-xs text-slate-500 hover:text-slate-700"
            onClick={() => {
              onCityChange(null);
              onSportChange(null);
              onSortChange("featured");
              onAmenitiesChange([]);
            }}
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          {/* City */}
          <div>
            <Label className="text-xs">City</Label>
            <Select value={selectedCity ?? ""} onValueChange={(v) => onCityChange(v || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sport */}
          <div>
            <Label className="text-xs">Sport</Label>
            <Select value={selectedSport ?? ""} onValueChange={(v) => onSportChange(v || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All sports" />
              </SelectTrigger>
              <SelectContent>
                {SPORT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <Label className="text-xs">Sort</Label>
            <Select value={sortBy} onValueChange={(v) => onSortChange(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sort option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4">
        <h5 className="text-sm font-semibold mb-2">Amenities</h5>
        <div className="grid grid-cols-2 gap-2">
          {AMENITY_OPTIONS.map((a) => {
            const active = selectedAmenities.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`text-xs border rounded-md px-3 py-1 transition ${
                  active ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
