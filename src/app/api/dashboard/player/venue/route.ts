// File: src/app/api/dashboard/player/venues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  search?: string; // venue name, city, or court name
};

// Get Venues , search by venue name, city, or court name
export async function GET(req: Request) {
  try {
    const { search } = Object.fromEntries(new URL(req.url).searchParams) as SearchParams;

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
        owner: true,
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ venues });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
