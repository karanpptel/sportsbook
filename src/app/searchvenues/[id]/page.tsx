// File: src/app/searchvenues/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function VenueDetailsPage() {
  const { id } = useParams();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(`/api/dashboard/player/venues/${id}`);
        const data = await res.json();
        setVenue(data.venue);
      } catch (err) {
        console.error("Failed to fetch venue:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchVenue();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading venue...</div>;
  if (!venue) return <div className="p-10 text-center">Venue not found</div>;

  // Average rating calculation
  const avgRating =
    venue.reviews?.length > 0
      ? (
          venue.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          venue.reviews.length
        ).toFixed(1)
      : null;

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <p className="flex items-center text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-2 text-red-500" />
            {venue.city}, {venue.state}
          </p>
          <p className="flex items-center mt-1 text-yellow-500">
            <Star className="h-4 w-4 mr-1" />{" "}
            {avgRating ? `${avgRating} (${venue.reviews.length})` : "No ratings yet"}
          </p>
        </div>
        <Button size="lg" className="self-start bg-green-600 hover:bg-green-700">
          Book This Venue
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Image Gallery */}
      <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
        {venue.photos && venue.photos.length > 0 ? (
          <Image
            src={venue.photos[0]} // later extend to carousel
            alt={venue.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Images Available
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        <div className="md:col-span-2 space-y-10">
          {/* Sports Available */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sports Available</h2>
            <Tabs defaultValue={venue.courts?.[0]?.name}>
              <TabsList>
                {venue.courts?.map((court: any) => (
                  <TabsTrigger key={court.id} value={court.name}>
                    {court.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {venue.courts?.map((court: any) => (
                <TabsContent key={court.id} value={court.name}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="mt-4">
                        View Pricing
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <h3 className="font-semibold mb-2">{court.name} Pricing</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Pricing is subject to change and controlled by the venue.
                      </p>
                      <div className="flex justify-between text-sm py-1">
                        <span>Hourly</span>
                        <span>
                          ₹{court.pricePerHour}/hr ({court.openTime}:00 - {court.closeTime}:00)
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {venue.amenities?.map((a: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </section>

          {/* About Venue */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">About Venue</h2>
            <p className="text-gray-600">{venue.description || "No details available"}</p>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Player Reviews & Ratings</h2>
            <div className="space-y-4">
              {venue.reviews?.map((review: any, idx: number) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <p className="font-semibold">
                        {review.user?.fullName || "Anonymous"}
                      </p>
                      <p className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 mr-1" /> {review.rating}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
              {venue.reviews?.length === 0 && (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Operating Hours
              </h3>
              <p className="text-sm text-gray-600">
                {venue.courts?.length > 0
                  ? `${venue.courts[0].openTime}:00 - ${venue.courts[0].closeTime}:00`
                  : "Not specified"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> Address
              </h3>
              <p className="text-sm text-gray-600">{venue.address}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Location Map</h3>
              <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                Map Here
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
