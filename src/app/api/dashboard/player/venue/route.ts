// File: src/app/api/dashboard/player/venues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { id } from "date-fns/locale";

type SearchParams = {
  search?: string; // venue name, city, or court name
};

// Get Venues , search by venue name, city, or court name
export async function GET(req: Request) {
  try {
    const { search } = Object.fromEntries(
      new URL(req.url).searchParams
    ) as SearchParams;

    const venues = await prisma.venue.findMany({
      where: {
        approved: true,
        OR: [
          { name: { contains: search || "", mode: "insensitive" } },
          { city: { contains: search || "", mode: "insensitive" } },
          {
            courts: {
              some: {
                name: { contains: search || "", mode: "insensitive" },
              },
            },
          },
        ],
      },
      include: {
        courts: true,
        owner: {
          include: {
            user: {
              select: { fullName: true, email: true, avatarUrl: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Directly return minPricePerHour & maxPricePerHour
    return NextResponse.json({
      venues: venues.map((venue) => ({
        id: venue.id,
        name: venue.name,
        slug: venue.slug,
        description: venue.description,
        city: venue.city,
        state: venue.state,
        country: venue.country,
        address: venue.address,
        amenities: venue.amenities,
        photos: venue.photos,
        rating: venue.rating,
        reviewsCount: venue.reviewsCount,
        minPricePerHour: venue.minPricePerHour,
        maxPricePerHour: venue.maxPricePerHour,
        courts: venue.courts,
        owner: venue.owner,
        reviews: venue.reviews,
        createdAt: venue.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// NEW ADVANCED DATA ROUTE WITH FILTERING, SORTING, AND PAGINATION KEEP FOR REFERENCE
// File: src/app/api/dashboard/player/venues/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type SearchParams = {
//   search?: string;
//   city?: string;
//   sport?: string;
//   minPrice?: string;
//   maxPrice?: string;
//   rating?: string;
//   sortBy?: string;
//   page?: string;
//   limit?: string;
// };

// export async function GET(req: Request) {
//   try {
//     const { search, city, sport, minPrice, maxPrice, rating, sortBy, page = "1", limit = "10" } =
//       Object.fromEntries(new URL(req.url).searchParams) as SearchParams;

//     const skip = (Number(page) - 1) * Number(limit);
//     const take = Number(limit);

//     const venues = await prisma.venue.findMany({
//       where: {
//         approved: true,
//         AND: [
//           search
//             ? {
//                 OR: [
//                   { name: { contains: search, mode: "insensitive" } },
//                   { city: { contains: search, mode: "insensitive" } },
//                   { courts: { some: { name: { contains: search, mode: "insensitive" } } } },
//                 ],
//               }
//             : {},
//           city ? { city: { equals: city, mode: "insensitive" } } : {},
//           sport ? { courts: { some: { sport: { equals: sport, mode: "insensitive" } } } } : {},
//           minPrice || maxPrice
//             ? {
//                 courts: {
//                   some: {
//                     price: {
//                       gte: minPrice ? Number(minPrice) : undefined,
//                       lte: maxPrice ? Number(maxPrice) : undefined,
//                     },
//                   },
//                 },
//               }
//             : {},
//         ],
//       },
//       include: {
//         courts: true,
//         owner: true,
//         reviews: true,
//       },
//       orderBy:
//         sortBy === "price_asc"
//           ? { courts: { _min: { price: "asc" } } }
//           : sortBy === "price_desc"
//           ? { courts: { _max: { price: "desc" } } }
//           : sortBy === "rating"
//           ? { reviews: { _avg: { rating: "desc" } } }
//           : { createdAt: "desc" }, // default: newest
//       skip,
//       take,
//     });

//     return NextResponse.json({ venues });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// OLD BASIC DATA ROUTE BUT KEPT FOR REFERENCE
// // File: src/app/api/dashboard/player/venues/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type SearchParams = {
//   search?: string; // venue name, city, or court name
// };

// // Get Venues , search by venue name, city, or court name
// export async function GET(req: Request) {
//   try {
//     const { search } = Object.fromEntries(new URL(req.url).searchParams) as SearchParams;

//     const venues = await prisma.venue.findMany({
//       where: {
//         approved: true,
//         OR: [
//           { name: { contains: search || "", mode: "insensitive" } },
//           { city: { contains: search || "", mode: "insensitive" } },
//           {
//             courts: {
//               some: {
//                 name: { contains: search || "", mode: "insensitive" },
//               },
//             },
//           },
//         ],
//       },
//       include: {
//         courts: true,
//         owner: true,
//         reviews: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ venues });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
