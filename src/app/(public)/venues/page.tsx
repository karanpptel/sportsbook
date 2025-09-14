"use client";

import React from "react";
import VenueSearchBox from "@/components/public/venues/VenueSearchBox";
import VenueImageSlider from "@/components/public/VenueImageSlider"; 
import VenueCard from "@/components/player/VenueCard"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const mockVenues = [
  {
    id: 1,
    name: "Skyline Sports Arena",
    location: "Ahmedabad",
    image: "https://via.placeholder.com/400x250?text=Skyline+Arena",
  },
  {
    id: 2,
    name: "Greenfield Court",
    location: "Bangalore",
    image: "https://via.placeholder.com/400x250?text=Greenfield+Court",
  },
  {
    id: 3,
    name: "Sunrise Sports Complex",
    location: "Mumbai",
    image: "https://via.placeholder.com/400x250?text=Sunrise+Complex",
  },
];

export default function VenuesPage() {

    const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <VenueSearchBox />
        <VenueImageSlider />
      </div>

      {/* Recently Added Venues */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Recently Added Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
        <Button variant="outline" onClick={() => router.push("/searchvenues")} className="mt-4" >See All Venues <span>→</span></Button>
      </section>
    </div>
  );
}
