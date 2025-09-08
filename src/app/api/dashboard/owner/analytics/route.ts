// src/app/api/dashboard/owner/analytics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Fetch Owner with venues & courts in one query ---
    const owner = await prisma.facilityOwner.findUnique({
      where: { userId: Number(session.user.id) },
      include: {
        venues: {
          include: {
            courts: {
              include: { bookings: { include: { payment: true } } },
            },
            reviews: true,
          },
        },
      },
    });

    if (!owner) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }

    const venues = owner.venues;
    const totalVenues = venues.length;

    let activeBookings = 0;
    let totalEarnings = 0;
    let totalRatings = 0;
    let totalReviews = 0;
    const revenueMap: Record<string, number> = {};
    const bookingsPerVenue: any[] = [];
    const venuePopularity: any[] = [];
    const ratingsPerVenue: any[] = [];

    venues.forEach((venue) => {
      let confirmed = 0,
        cancelled = 0,
        pending = 0;

      // Ratings
      const venueRatings = venue.reviews.map((r) => r.rating);
      const venueAvgRating =
        venueRatings.length > 0
          ? venueRatings.reduce((a, b) => a + b, 0) / venueRatings.length
          : 0;

      ratingsPerVenue.push({ venue: venue.name, rating: venueAvgRating });
      totalRatings += venueRatings.reduce((a, b) => a + b, 0);
      totalReviews += venueRatings.length;

      // Bookings
      let venueBookingCount = 0;

      venue.courts.forEach((court) => {
        court.bookings.forEach((b) => {
          venueBookingCount++;
          if (b.status === "CONFIRMED") confirmed++;
          else if (b.status === "CANCELLED") cancelled++;
          else pending++;

          // Active bookings count
          if (["PENDING", "CONFIRMED"].includes(b.status)) activeBookings++;

          // Revenue (last 30 days)
          if (
            b.payment?.status === "SUCCEEDED" &&
            new Date(b.createdAt) >= new Date(new Date().setDate(new Date().getDate() - 30))
          ) {
            const date = b.createdAt.toISOString().split("T")[0];
            revenueMap[date] = (revenueMap[date] || 0) + (b.payment.amount || 0);
          }

          // Total earnings
          if (b.payment?.status === "SUCCEEDED") totalEarnings += b.payment.amount || 0;
        });
      });

      bookingsPerVenue.push({ venue: venue.name, confirmed, cancelled, pending });
      venuePopularity.push({ venue: venue.name, bookings: confirmed + pending });
    });

    const avgRating = totalReviews > 0 ? totalRatings / totalReviews : 0;

    const revenue = Object.keys(revenueMap)
      .sort()
      .map((date) => ({ date, revenue: revenueMap[date] / 100 })); // assuming amount is in paise

    return NextResponse.json({
      stats: { totalVenues, activeBookings, earnings: totalEarnings / 100, avgRating },
      revenue,
      bookings: bookingsPerVenue,
      venuePopularity,
      ratings: ratingsPerVenue,
    });
  } catch (error) {
    console.error("Owner Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
