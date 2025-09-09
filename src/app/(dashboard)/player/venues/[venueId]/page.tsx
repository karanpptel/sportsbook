// app/(player)/venues/[venueId]/page.tsx
import React from "react";
import VenueDetailHero from "@/components/player/venue-detail/VenueDetailHero";
import VenuePhotoGallery from "@/components/player/venue-detail/VenuePhotoGallery";
import VenueAmenities from "@/components/player/venue-detail/VenueAmenities";
import CourtList from "@/components/player/venue-detail/CourtList";
import VenueReviews from "@/components/player/venue-detail/VenueReviews";

// NOTE: Replace fetchVenue mock with Prisma/DB call when ready
async function fetchVenue(venueId: string) {
  // fallback mock
  return {
    id: Number(venueId || 1),
    name: "SRK Badminton Arena",
    slug: "srk-badminton-arena",
    city: "Ahmedabad",
    address: "Sector 12, Sport Complex",
    rating: 4.7,
    reviewsCount: 128,
    photos: [
      "/images/venues/srk-hero.jpg",
      "/images/venues/srk-1.jpg",
      "/images/venues/srk-2.jpg",
      "/images/venues/srk-3.jpg",
    ],
    amenities: ["parking", "lights", "indoor", "ball_rental"],
    description:
      "Premium indoor courts with wooden flooring, pro-level lighting and equipment rental. Perfect for competitive and casual play.",
    courts: [
      {
        id: 1,
        name: "Court A",
        sport: "Badminton",
        pricePerHour: 400,
        currency: "INR",
        openTime: 6,
        closeTime: 23,
        slotsAvailable: 8,
      },
      {
        id: 2,
        name: "Court B",
        sport: "Badminton",
        pricePerHour: 350,
        currency: "INR",
        openTime: 6,
        closeTime: 23,
        slotsAvailable: 6,
      },
      {
        id: 3,
        name: "Court C",
        sport: "Table Tennis",
        pricePerHour: 200,
        currency: "INR",
        openTime: 8,
        closeTime: 21,
        slotsAvailable: 10,
      },
    ],
    reviews: [
      { id: 1, user: "Rahul", rating: 5, comment: "Great lighting!" },
      { id: 2, user: "Meera", rating: 4, comment: "Courts well maintained." },
    ],
  };
}

interface PageProps {
  params: { venueId: string };
}

export default async function VenuePage({ params }: PageProps) {
  const { venueId } = params;
  const venue = await fetchVenue(venueId);

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
            <VenueReviews reviews={venue.reviews} rating={venue.rating} />
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
