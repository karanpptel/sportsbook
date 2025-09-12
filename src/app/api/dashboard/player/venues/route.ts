// src/app/api/dashboard/player/venues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const sport = searchParams.get("sport") || "all";
    const type = searchParams.get("type"); // indoor / outdoor
    const rating = searchParams.get("rating");
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999");

    const venues = await prisma.venue.findMany({
      where: {
        approved: true,
        name: {
          contains: search,
          mode: "insensitive",
        },
        ...(rating ? { rating: { gte: parseFloat(rating) } } : {}),
        ...(type ? { amenities: { has: type } } : {}), // You may want a better indoor/outdoor marker
        minPricePerHour: { gte: minPrice },
        maxPricePerHour: { lte: maxPrice },
        ...(sport !== "all"
          ? {
              courts: {
                some: { sport: { equals: sport, mode: "insensitive" } },
              },
            }
          : {}),
      },
      include: {
        courts: {
          select: { id: true, sport: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ venues });
  } catch (err) {
    console.error("Error fetching venues", err);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}
