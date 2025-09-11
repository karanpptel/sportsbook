// app/(player)/venues/[venueId]/page.tsx
import React from "react";
import VenueDetailHero from "@/components/player/venue-detail/VenueDetailHero";
import VenuePhotoGallery from "@/components/player/venue-detail/VenuePhotoGallery";
import VenueAmenities from "@/components/player/venue-detail/VenueAmenities";
import CourtList from "@/components/player/venue-detail/CourtList";
import VenueReviews from "@/components/player/venue-detail/VenueReviews";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

async function fetchVenue(venueId: string) {
  const res = await fetch(`${BASE_URL}/api/dashboard/player/venue/${venueId}`);
  if (!res.ok) throw new Error("Venue not found");
  const data = await res.json();
  return data.venue;
}

async function fetchReviews(venueId: string) {
  const res = await fetch(`${BASE_URL}/api/dashboard/player/venue/${venueId}/review`);
  if (!res.ok) return [];
  return await res.json();
}

interface PageProps {
  params: Promise<{ venueId: string }>;
}

export default async function VenuePage({ params }: PageProps) {
  const { venueId } = await params;
  const venue = await fetchVenue(venueId);
  const reviews = await fetchReviews(venueId);

  return (
    <main className="container mx-auto px-4 lg:px-8 py-8">
      <VenueDetailHero venue={venue} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <section className="space-y-6">
          <VenuePhotoGallery photos={venue.photos} />
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {venue.description}
            </p>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Amenities</h4>
              <VenueAmenities amenities={venue.amenities} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Courts</h3>
            <CourtList courts={venue.courts} venueId={venue.id} />
          </div>

          <div className="mt-6">
            <VenueReviews reviews={reviews} rating={venue.rating} />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h4 className="text-sm font-medium text-slate-700">
                Venue info
              </h4>
              <div className="mt-3 text-sm text-slate-600">
                <div>{venue.address}</div>
                <div className="mt-1">City: {venue.city}</div>
                <div className="mt-1">Rating: {venue.rating} ({venue.reviewsCount} reviews)</div>
              </div>
            </div>

            <div className="mt-5">
              {/* potential place for booking summary / CTA / price calculator */}
              <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-5 border border-slate-100">
                <h5 className="text-sm font-semibold">Quick Book</h5>
                <p className="text-xs text-slate-500 mt-1">Select a court to start booking</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
