"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendedVenue {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  sport: string;
  pricePerHour: number;
}

interface RecommendedVenuesProps {
  venues: RecommendedVenue[];
}

export function RecommendedVenues({ venues = [] }: RecommendedVenuesProps) {
  if (!Array.isArray(venues) || venues.length === 0) {
    return (
      <Card className="shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recommended Venues</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/player/venues" className="flex items-center gap-2">
              Browse All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No recommended venues available at the moment.
            <br />
            <Link href="/player/venues" className="text-primary hover:underline">
              Browse all venues
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recommended Venues</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/player/venues" className="flex items-center gap-2">
            Browse All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/player/venues/${venue.id}`}
              className="group rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <MapPin className="h-4 w-4" />
                  {venue.location}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    ₹{venue.pricePerHour}/hour
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {venue.sport}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}