import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ✅ GET - fetch logged-in player's reviews
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { userId: Number(session.user.id) },
    include: { venue: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}


// POST - create a review for venue
export async function POST(request: NextRequest) {
    
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const body = await request.json();
    const { venueId, rating, comment } = body;
  
    if (!venueId || !rating) {
      return NextResponse.json({ error: "VenueId and rating required" }, { status: 400 });
    }
  
    //optional: verify user has a confirmed booking for this venue
    const booking  = await prisma.booking.findFirst({
      where: {
          userId: Number(session.user.id),
          court: {venueId: venueId},
          status: "CONFIRMED",
      }
    });
  
  
    if (!booking) {
      return NextResponse.json({ error: "You must book this venue before reviewing" }, { status: 403 });
    }
  
    const review = await prisma.review.create({
      data: {
        userId: Number(session.user.id),
        venueId,
        rating,
        comment,
      },
    });

        // 🔄 Recalculate average rating for the venue
      const stats = await prisma.review.aggregate({
        where: { venueId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.venue.update({
        where: { id: venueId },
        data: {
          rating: stats._avg.rating || 0,
          reviewsCount: stats._count.rating,
        },
      });
  
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}