import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.setDate(now.getDate() + 7));

    // Get upcoming bookings (next 7 days)
    const upcomingBookings = await prisma.booking.count({
      where: {
        userId,
        startTime: {
          gte: new Date(),
          lte: sevenDaysFromNow,
        },
        status: "CONFIRMED",
      },
    });

    // Get completed games
    const completedGames = await prisma.booking.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    });

    // Calculate total hours played
    const completedBookings = await prisma.booking.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const totalHoursPlayed = completedBookings.reduce((total, booking) => {
      const duration = booking.endTime.getTime() - booking.startTime.getTime();
      return total + (duration / (1000 * 60 * 60)); // Convert milliseconds to hours
    }, 0);

    // Get total bookings for booking rate calculation
    const totalBookings = await prisma.booking.count({
      where: {
        userId,
        status: {
          in: ["COMPLETED", "CANCELLED"],
        },
      },
    });

    // Calculate booking completion rate
    const bookingRate = totalBookings > 0 
      ? Math.round((completedGames / totalBookings) * 100)
      : 0;

    // Get wallet balance (you might need to adjust this based on your wallet implementation)
    const walletBalance = 0; // Replace with actual wallet balance logic

    return NextResponse.json({
      upcomingBookings,
      completedGames,
      walletBalance,
      totalHoursPlayed: Math.round(totalHoursPlayed * 10) / 10, // Round to 1 decimal place
      bookingRate,
    });

  } catch (error) {
    console.error("Error fetching player stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch player stats" },
      { status: 500 }
    );
  }
}