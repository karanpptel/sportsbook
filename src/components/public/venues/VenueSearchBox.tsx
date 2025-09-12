// src/components/public/venues/VenueSearchBox.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function VenueSearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/searchvenues?query=${query}`);
    }
  };

  return (
    <div className="p-6  rounded-2xl shadow-sm bg-white space-y-4">
      <h2 className="text-xl font-semibold">FIND PLAYERS & VENUES NEARBY</h2>
      <div className="flex gap-3">
        <Input
          placeholder="Search by name or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} className="w-full md:w-auto">
          Search
        </Button>
      </div>
      <p className="text-sm text-gray-600">Seamlessly explore sports venues and play with sports enthusiasts just like you!</p>
    </div>
  );
}
