// // src/app/api/dashboard/player/venue/route.ts 


// this code suggested by copilot 
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get search and filter parameters from the URL
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const city = searchParams.get("city") || undefined;
        const sport = searchParams.get("sport") || undefined;
        const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!, 10) : undefined;
        const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!, 10) : undefined;

        // Fetch approved venues with their courts
        const venues = await prisma.venue.findMany({
            where: {
                approved: true,
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
                ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),

                 // Sport filter (independent of price)
                ...(sport
                    ? {
                        courts: {
                        some: {
                            sport: { equals: sport, mode: "insensitive" },
                        },
                        },
                    }
                    : {}),

                    // Price filter (independent of sport)
                ...(minPrice || maxPrice ? {
                    courts: {
                        some: {
                            pricePerHour: {
                                ...(minPrice ? { gte: minPrice } : {}),
                                ...(maxPrice ? { lte: maxPrice } : {})
                            },
                        
                        }
                    }
                } : {})
            },
            include: {
                courts: {
                    where: {
                        ...(sport ? { sport: { equals: sport, mode: 'insensitive' } } : {}),
                        ...(minPrice || maxPrice ? {
                            pricePerHour: {
                                ...(minPrice ? { gte: minPrice } : {}),
                                ...(maxPrice ? { lte: maxPrice } : {})
                            }
                        } : {})
                    },
                    select: {
                        id: true,
                        name: true,
                        sport: true,
                        pricePerHour: true
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        });

        // Calculate average rating and price range for each venue
        const venuesWithStats = venues.map(venue => {
            const ratings = venue.reviews.map(r => r.rating);
            const avgRating = ratings.length > 0 
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
                : undefined;
            
            const prices = venue.courts.map(c => c.pricePerHour);
            const minPricePerHour = prices.length > 0 ? Math.min(...prices) : undefined;
            const maxPricePerHour = prices.length > 0 ? Math.max(...prices) : undefined;

            const { reviews, ...venueWithoutReviews } = venue;
            
            return {
                ...venueWithoutReviews,
                rating: avgRating,
                minPricePerHour,
                maxPricePerHour,
                totalReviews: venue._count.reviews
            };
        });

        return NextResponse.json(venuesWithStats);
    } catch (error) {
        console.error("Error fetching venues:", error);
        return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
    }
}





//original code 
// File: src/app/api/dashboard/player/venues/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";


// type SearchParams = {
//   search?: string; // venue name, city, or court name
// };

// // Get Venues , search by venue name, city, or court name
// export async function GET(req: Request) {
//   try {
//     const { search } = Object.fromEntries(
//       new URL(req.url).searchParams
//     ) as SearchParams;

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
//         owner: {
//           include: {
//             user: {
//               select: { fullName: true, email: true, avatarUrl: true },
//             },
//           },
//         },
//         reviews: {
//           include: {
//             user: {
//               select: { fullName: true, avatarUrl: true },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // Directly return minPricePerHour & maxPricePerHour
//     return NextResponse.json({
//       venues: venues.map((venue) => ({
//         id: venue.id,
//         name: venue.name,
//         slug: venue.slug,
//         description: venue.description,
//         city: venue.city,
//         state: venue.state,
//         country: venue.country,
//         address: venue.address,
//         amenities: venue.amenities,
//         photos: venue.photos,
//         rating: venue.rating,
//         reviewsCount: venue.reviewsCount,
//         minPricePerHour: venue.minPricePerHour,
//         maxPricePerHour: venue.maxPricePerHour,
//         courts: venue.courts,
//         owner: venue.owner,
//         reviews: venue.reviews,
//         createdAt: venue.createdAt,
//         // id: venue.id,
//         // name: venue.name,
//         // slug: venue.slug,
//         // description: venue.description,
//         // city: venue.city,
//         // state: venue.state,
//         // country: venue.country,
//         // address: venue.address,
//         // amenities: venue.amenities,
//         // photos: venue.photos,
//         // rating: venue.rating,
//         // reviewsCount: venue.reviewsCount,
//         // minPricePerHour: venue.minPricePerHour,
//         // maxPricePerHour: venue.maxPricePerHour,
//         // courts: venue.courts,
//         // owner: venue.owner,
//         // reviews: venue.reviews,
//         // createdAt: venue.createdAt,
//       })),
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }







// // NEW ADVANCED DATA ROUTE WITH FILTERING, SORTING, AND PAGINATION KEEP FOR REFERENCE
// // File: src/app/api/dashboard/player/venues/route.ts
// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";

// // type SearchParams = {
// //   search?: string;
// //   city?: string;
// //   sport?: string;
// //   minPrice?: string;
// //   maxPrice?: string;
// //   rating?: string;
// //   sortBy?: string;
// //   page?: string;
// //   limit?: string;
// // };

// // export async function GET(req: Request) {
// //   try {
// //     const { search, city, sport, minPrice, maxPrice, rating, sortBy, page = "1", limit = "10" } =
// //       Object.fromEntries(new URL(req.url).searchParams) as SearchParams;

// //     const skip = (Number(page) - 1) * Number(limit);
// //     const take = Number(limit);

// //     const venues = await prisma.venue.findMany({
// //       where: {
// //         approved: true,
// //         AND: [
// //           search
// //             ? {
// //                 OR: [
// //                   { name: { contains: search, mode: "insensitive" } },
// //                   { city: { contains: search, mode: "insensitive" } },
// //                   { courts: { some: { name: { contains: search, mode: "insensitive" } } } },
// //                 ],
// //               }
// //             : {},
// //           city ? { city: { equals: city, mode: "insensitive" } } : {},
// //           sport ? { courts: { some: { sport: { equals: sport, mode: "insensitive" } } } } : {},
// //           minPrice || maxPrice
// //             ? {
// //                 courts: {
// //                   some: {
// //                     price: {
// //                       gte: minPrice ? Number(minPrice) : undefined,
// //                       lte: maxPrice ? Number(maxPrice) : undefined,
// //                     },
// //                   },
// //                 },
// //               }
// //             : {},
// //         ],
// //       },
// //       include: {
// //         courts: true,
// //         owner: true,
// //         reviews: true,
// //       },
// //       orderBy:
// //         sortBy === "price_asc"
// //           ? { courts: { _min: { price: "asc" } } }
// //           : sortBy === "price_desc"
// //           ? { courts: { _max: { price: "desc" } } }
// //           : sortBy === "rating"
// //           ? { reviews: { _avg: { rating: "desc" } } }
// //           : { createdAt: "desc" }, // default: newest
// //       skip,
// //       take,
// //     });

// //     return NextResponse.json({ venues });
// //   } catch (err) {
// //     console.error(err);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }


// // OLD BASIC DATA ROUTE BUT KEPT FOR REFERENCE
// // // File: src/app/api/dashboard/player/venues/route.ts
// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";

// // type SearchParams = {
// //   search?: string; // venue name, city, or court name
// // };

// // // Get Venues , search by venue name, city, or court name
// // export async function GET(req: Request) {
// //   try {
// //     const { search } = Object.fromEntries(new URL(req.url).searchParams) as SearchParams;

// //     const venues = await prisma.venue.findMany({
// //       where: {
// //         approved: true,
// //         OR: [
// //           { name: { contains: search || "", mode: "insensitive" } },
// //           { city: { contains: search || "", mode: "insensitive" } },
// //           {
// //             courts: {
// //               some: {
// //                 name: { contains: search || "", mode: "insensitive" },
// //               },
// //             },
// //           },
// //         ],
// //       },
// //       include: {
// //         courts: true,
// //         owner: true,
// //         reviews: true,
// //       },
// //       orderBy: { createdAt: "desc" },
// //     });

// //     return NextResponse.json({ venues });
// //   } catch (err) {
// //     console.error(err);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }
