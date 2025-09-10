// File: src/app/api/dashboard/player/venues/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }>, searchParams?: { courtName?: string } }
) {
    const params = await context.params;
    const searchParams = context.searchParams;
  try {
    const { id } = params;
    const courtFilter = searchParams?.courtName;

    const venue = await prisma.venue.findUnique({
      where: { id: Number(id) },
      include: {
        owner: {
          include: {
            user: {
              select: { fullName: true, email: true, avatarUrl: true },
            },
          },
        },
        courts: courtFilter
          ? {
              where: {
                name: { contains: courtFilter, mode: "insensitive" },
              },
            }
          : true,
        reviews: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json({
      venue: {
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
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// OLD BASIC DATA ROUTE BUT KEPT FOR REFERENCE
// // File: src/app/api/dashboard/player/venues/[id]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type Params = {
//   params: { id: string };
//   searchParams?: { courtName?: string };
// };

// export async function GET(req: Request, { params, searchParams }: Params) {
//   try {
//     const { id } = params;
//     const courtFilter = searchParams?.courtName;

//     const venue = await prisma.venue.findUnique({
//       where: { id: Number(id) },
//       include: {
//         owner: true,
//         courts: courtFilter
//           ? {
//               where: {
//                 name: { contains: courtFilter, mode: "insensitive" },
//               },
//             }
//           : true,
//         reviews: true,
//       },
//     });

//     if (!venue) {
//       return NextResponse.json({ error: "Venue not found" }, { status: 404 });
//     }

//     return NextResponse.json({ venue });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
