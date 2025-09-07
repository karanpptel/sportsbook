// File: src/app/venues/page.tsx    still OLD DATA IS BELOW THAT COMMENTED and also this page needs more update
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Venue = {
  id: number;
  name: string;
  city: string;
  courts: { id: number; name: string }[];
  owner: { id: string; name: string | null; email: string };
  reviews: { id: number; rating: number; comment: string }[];
};

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);

        const url = `/api/dashboard/player/venues${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`;

        const res = await fetch(url);
        const data = await res.json();

        if (data?.venues) {
          setVenues(data.venues);
        } else {
          setVenues([]);
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [search]);

  // Client-side filters for extra refinement
  const filteredVenues = venues.filter((venue) => {
    const avgRating =
      venue.reviews.length > 0
        ? venue.reviews.reduce((sum, r) => sum + r.rating, 0) /
          venue.reviews.length
        : 0;

    return (
      (cityFilter ? venue.city === cityFilter : true) &&
      (ratingFilter ? avgRating >= parseInt(ratingFilter) : true)
    );
  });

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <section className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by name, city or court..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          <Select onValueChange={(val) => setCityFilter(val)}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              {/* Dynamically generate city options */}
              {[...new Set(venues.map((v) => v.city))].map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => setRatingFilter(val)}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ★ & up</SelectItem>
              <SelectItem value="2">2 ★ & up</SelectItem>
              <SelectItem value="3">3 ★ & up</SelectItem>
              <SelectItem value="4">4 ★ & up</SelectItem>
              <SelectItem value="5">5 ★</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setCityFilter("");
              setRatingFilter("");
            }}
          >
            Reset
          </Button>
        </section>

        {/* Venues Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading venues...</p>
        ) : filteredVenues.length === 0 ? (
          <p className="text-center text-gray-500">No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => {
              const avgRating =
                venue.reviews.length > 0
                  ? (
                      venue.reviews.reduce((s, r) => s + r.rating, 0) /
                      venue.reviews.length
                    ).toFixed(1)
                  : "No ratings";

              return (
                <Card
                  key={venue.id}
                  className="shadow hover:shadow-lg transition duration-200"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">
                      {venue.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{venue.city}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      Owner: {venue.owner?.name || "Unknown"}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {venue.courts.map((court) => (
                        <Badge key={court.id} variant="secondary">
                          {court.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      ⭐ {avgRating}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}




// // src/app/venues/page.tsx
// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Badge } from "@/components/ui/badge";
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Star, MapPin } from "lucide-react";

// // Dummy venues data
// const dummyVenues = [
//   {
//     id: 1,
//     name: "S&R Badminton",
//     rating: 4.5,
//     reviews: 6,
//     location: "Vaishnavdevi Cir",
//     price: 250,
//     tags: ["Badminton", "Outdoor", "Top Rated", "Budget"],
//     image: "https://via.placeholder.com/300x200",
//   },
//   {
//     id: 2,
//     name: "City Sports Arena",
//     rating: 4.2,
//     reviews: 12,
//     location: "SG Highway",
//     price: 400,
//     tags: ["Football", "Indoor", "Premium"],
//     image: "https://via.placeholder.com/300x200",
//   },
//   {
//     id: 3,
//     name: "Arena Pro Turf",
//     rating: 4.8,
//     reviews: 20,
//     location: "Bopal",
//     price: 600,
//     tags: ["Cricket", "Outdoor", "Top Rated"],
//     image: "https://via.placeholder.com/300x200",
//   },
// ];

// export default function VenuesPage() {
//   const [price, setPrice] = useState([0, 5500]);

//   return (
//     <main className="flex flex-col min-h-screen">
//       <section className="px-6 py-8 bg-gradient-to-b from-blue-50 to-white">
//         <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
//           Sports Venues in Ahmedabad: <span className="text-blue-600">Discover and Book Nearby Venues</span>
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
//           {/* Sidebar Filters */}
//           <aside className="md:col-span-1 space-y-6">
//             {/* Mobile Accordion */}
//             <Accordion type="single" collapsible className="md:hidden">
//               <AccordionItem value="filters">
//                 <AccordionTrigger>Filters</AccordionTrigger>
//                 <AccordionContent>
//                   <Filters price={price} setPrice={setPrice} />
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>

//             {/* Desktop Filters */}
//             <div className="hidden md:block">
//               <Filters price={price} setPrice={setPrice} />
//             </div>
//           </aside>

//           {/* Venues Grid */}
//           <div className="md:col-span-3">
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {dummyVenues.map((venue) => (
//                 <Card key={venue.id} className="shadow hover:shadow-lg transition">
//                   <img src={venue.image} alt={venue.name} className="w-full h-40 object-cover rounded-t-lg" />
//                   <CardContent className="p-4">
//                     <h3 className="font-semibold text-lg">{venue.name}</h3>
//                     <div className="flex items-center text-sm text-gray-500 mt-1">
//                       <Star className="w-4 h-4 text-yellow-500 mr-1" />
//                       {venue.rating} ({venue.reviews})
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500 mt-1">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {venue.location}
//                     </div>
//                     <p className="text-gray-700 font-semibold mt-2">₹ {venue.price} per hour</p>
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {venue.tags.map((tag, i) => (
//                         <Badge key={i} variant="secondary">{tag}</Badge>
//                       ))}
//                     </div>
//                     <Button className="mt-4 w-full">View Details</Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="mt-8 flex justify-center">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious href="#" />
//                   </PaginationItem>
//                   <PaginationItem>
//                     <PaginationLink href="#" isActive>1</PaginationLink>
//                   </PaginationItem>
//                   <PaginationItem>
//                     <PaginationLink href="#">2</PaginationLink>
//                   </PaginationItem>
//                   <PaginationItem>
//                     <PaginationLink href="#">3</PaginationLink>
//                   </PaginationItem>
//                   <PaginationItem>
//                     <PaginationNext href="#" />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// // Filters Component
// function Filters({ price, setPrice }: { price: number[]; setPrice: (val: number[]) => void }) {
//   return (
//     <div className="space-y-6 border rounded-lg p-4 shadow-sm bg-white">
//       {/* Search */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Search by venue name</label>
//         <Input placeholder="Search for venue" />
//       </div>

//       {/* Sport Type */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Filter by sport type</label>
//         <Select>
//           <SelectTrigger>
//             <SelectValue placeholder="All Sports" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Sports</SelectItem>
//             <SelectItem value="badminton">Badminton</SelectItem>
//             <SelectItem value="football">Football</SelectItem>
//             <SelectItem value="cricket">Cricket</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Price Range */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Price range (per hour)</label>
//         <Slider value={price} onValueChange={setPrice} max={5500} step={50} className="w-full" />
//         <div className="flex justify-between text-sm mt-2">
//           <span>₹ {price[0]}</span>
//           <span>₹ {price[1]}</span>
//         </div>
//       </div>

//       {/* Venue Type */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Choose Venue Type</label>
//         <div className="flex flex-col space-y-2">
//           <label className="flex items-center gap-2">
//             <input type="radio" name="venue-type" /> Indoor
//           </label>
//           <label className="flex items-center gap-2">
//             <input type="radio" name="venue-type" /> Outdoor
//           </label>
//         </div>
//       </div>

//       {/* Ratings */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Rating</label>
//         <div className="flex flex-col space-y-2 text-sm">
//           <label><input type="checkbox" /> 4 stars & up</label>
//           <label><input type="checkbox" /> 3 stars & up</label>
//           <label><input type="checkbox" /> 2 stars & up</label>
//           <label><input type="checkbox" /> 1 star & up</label>
//         </div>
//       </div>

//       {/* Clear Filters */}
//       <Button variant="destructive" className="w-full">Clear Filters</Button>
//     </div>
//   );
// }
