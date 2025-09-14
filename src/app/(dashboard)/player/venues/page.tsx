"use client";

import { useEffect, useMemo, useState } from "react";
import VenueFilters from "@/components/player/VenueFilters";
import VenueCard from "@/components/player/VenueCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";




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
  reviewsCount?: number;
  
};

// Mock data for development/testing
const MOCK: Venue[] = [
  {
    id: 1,
    name: "Greenwood Sports Complex",
    city: "Mumbai",
    state: "MH",
    address: "Sector 12, Greenwood",
    photos: ["/demo/venue-1.jpg"],
    amenities: ["Parking", "Lights", "Restrooms"],
    minPricePerHour: 500,
    maxPricePerHour: 700,
    approved: true,
    rating: 4.6,
  },
  {
    id: 2,
    name: "Laketown Courts",
    city: "Pune",
    state: "MH",
    address: "Laketown Road",
    photos: ["/demo/venue-2.jpg"],
    amenities: ["WiFi", "Cafeteria"],
    minPricePerHour: 300,
    maxPricePerHour: 450,
    approved: true,
    rating: 4.2,
  },
  {
    id: 3,
    name: "Seaside Arena",
    city: "Goa",
    state: "GA",
    address: "Beachfront Lane",
    photos: ["/demo/venue-3.jpg"],
    amenities: ["Seating Area", "First Aid"],
    minPricePerHour: 800,
    maxPricePerHour: 1200,
    approved: true,
    rating: 4.9,
  },
];

export default function PlayerVenuesPage() {
  const [venues, setVenues] = useState<Venue[] | null>(null);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [sport, setSport] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  async function loadVenues() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/player/venue");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      // expect { venues: Venue[] } or array
      const v: Venue[] = Array.isArray(data) ? data : data.venues ?? [];
      setVenues(v);
    } catch (err) {
      console.warn("Falling back to mock venues (API not available)", err);
      setVenues(MOCK);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  const filtered = useMemo(() => {
  if (!venues) return [];
  return venues
    .filter((v) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.address?.toLowerCase().includes(q);

      const matchesCity = !city || v.city === city;

      const matchesSport =
        !sport ||
        (v as any).courts?.some((c: any) =>
          c.sport.toLowerCase() === sport.toLowerCase()
        );

      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => v.amenities?.includes(a));

      return matchesQuery && matchesCity && matchesSport && matchesAmenities && v.approved;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "price_asc") return (a.minPricePerHour ?? 0) - (b.minPricePerHour ?? 0);
      if (sortBy === "price_desc") return (b.maxPricePerHour ?? 0) - (a.maxPricePerHour ?? 0);
      return (b.rating ?? 0) - (a.rating ?? 0);
    });
}, [venues, query, city, sport, sortBy, selectedAmenities]);

  const cities = useMemo(() => {
    if (!venues) return [];
    const set = new Set<string>();
    venues.forEach((v) => v.city && set.add(v.city));
    return Array.from(set);
  }, [venues]);

  

  return (
    <ProtectedRoutes allowedRoles={['USER']}>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Find a Venue</h1>
            <p className="text-sm text-slate-600 mt-1">Search venues by city, sport, price and availability — book instantly.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              placeholder="Search name, city or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-96"
            />
            <Button onClick={loadVenues} variant="ghost" className="hidden md:inline-flex">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Filters + results */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Filters column */}
          <div className="space-y-4">
            <VenueFilters
              cities={cities}
              selectedCity={city}
              onCityChange={setCity}
              selectedSport={sport}
              onSportChange={setSport}
              sortBy={sortBy}
              onSortChange={(s) => setSortBy(s)}
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={setSelectedAmenities}
            />


            <Card className="hidden lg:block sticky top-24">
              <CardContent>
                <div className="text-sm text-slate-600">Quick tips</div>
                <ul className="mt-3 text-sm space-y-2">
                  <li>Use filters to narrow results by city or sport.</li>
                  <li>Click a venue to view courts & book slots.</li>
                  <li>Use sorting to find the best rated or cheapest venues.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Results list */}
          <div>
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-56" />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                <h3 className="text-lg font-semibold">No venues match your filters</h3>
                <p className="text-sm text-slate-500 mt-2">Try clearing filters or searching different city/sport.</p>
                <div className="mt-4">
                  <Button variant="ghost" onClick={() => { setQuery(""); setCity(null); setSport(null); }}>
                    Clear filters
                  </Button>
                </div>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((v) => (
                  <VenueCard key={v.id} venue={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoutes>
  );
}
