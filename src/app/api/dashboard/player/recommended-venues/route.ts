import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type venue = {
  id: string;
  name: string;
  photos: string[];
  city: string;
  state: string;    
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
 
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    // Get user's booking history to determine preferences
    const userBookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        court: {
          select: {
            sport: true,
            venue: {
              select: {
                city: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      take: 10, // Look at last 10 bookings
    });

    // Extract user preferences
    const userPreferences = {
      sports: [...new Set(userBookings.map(b => b.court.sport))],
      cities: [...new Set(userBookings.map(b => b.court.venue.city))],
    };

    

    // Get recommended venues based on user preferences
    const recommendedVenues = await prisma.venue.findMany({
      where: {
        approved: true,
        OR: [
          // Match user's preferred cities
          {
            city: {
              in: userPreferences.cities,
            },
          },
          // Match user's preferred sports
          {
            courts: {
              some: {
                sport: {
                  in: userPreferences.sports,
                },
              },
            },
          },
        ],
      },
      include: {
        courts: {
          select: {
            sport: true,
            pricePerHour: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
       // photos: true,
      },
      take: 6, // Limit to 6 recommendations
    });

    // Format venues for response
    const formattedVenues = recommendedVenues.map(venue => {
      const avgRating = venue.reviews.length > 0
        ? venue.reviews.reduce((sum, review) => sum + review.rating, 0) / venue.reviews.length
        : 0;

      const sports = [...new Set(venue.courts.map(court => court.sport))];
      const minPrice = Math.min(...venue.courts.map(court => court.pricePerHour));

      return {
        id: venue.id,
        name: venue.name,
        location: `${venue.city}, ${venue.state}`,
        image: venue.photos[0] || "",
        rating: Math.round(avgRating * 10) / 10,
        sport: sports[0], // Primary sport
        pricePerHour: minPrice,
      };
    });

    // If no preferences yet, return top-rated venues
    if (formattedVenues.length === 0) {
      const topVenues = await prisma.venue.findMany({
        where: {
          approved: true,
        },
        orderBy: {
          rating: "desc",
        },
        include: {
          courts: {
            select: {
              sport: true,
              pricePerHour: true,
            },
          },
         // photos: true,
        },
        take: 6,
      });

      return NextResponse.json({
        venues: topVenues.map(venue => ({
          id: venue.id,
          name: venue.name,
          location: `${venue.city}, ${venue.state}`,
          image: venue.photos[0] || "",
          rating: venue.rating,
          sport: venue.courts[0]?.sport || "Various",
          pricePerHour: venue.courts[0]?.pricePerHour || 0,
          
        })),
      });
    }

    return NextResponse.json({
      venues: formattedVenues,
    });

  } catch (error) {
    console.error("Error fetching recommended venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended venues" },
      { status: 500 }
    );
  }
}