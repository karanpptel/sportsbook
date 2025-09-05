// File: src/app/api/dashboard/player/venues/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
  searchParams?: { courtName?: string };
};

export async function GET(req: Request, { params, searchParams }: Params) {
  try {
    const { id } = params;
    const courtFilter = searchParams?.courtName;

    const venue = await prisma.venue.findUnique({
      where: { id: Number(id) },
      include: {
        owner: true,
        courts: courtFilter
          ? {
              where: {
                name: { contains: courtFilter, mode: "insensitive" },
              },
            }
          : true,
        reviews: true,
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json({ venue });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
