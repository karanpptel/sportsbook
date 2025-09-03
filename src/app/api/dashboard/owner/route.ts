// src/app/api/dashboard/owner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // Get FacilityOwner id for this user
    const ownerProfile = await prisma.facilityOwner.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }

    const ownerId = ownerProfile.id;

   // Total Venues
    const totalVenues = await prisma.venue.count({
      where: { ownerId },
    });

    // Active Bookings (Confirmed)
    const activeBookings = await prisma.booking.count({
      where: {
        court: { venue: { ownerId } },
        status: "CONFIRMED",
      },
    });


    //Earning this month 
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const earningRaw =  await prisma.payment.aggregate({
        _sum: {amount: true},
        where: {
          booking: { court: { venue: { ownerId } } },
          status: "SUCCEEDED",
          createdAt: {  gte: startOfMonth,lte: endOfMonth},
        }
    });

    const earning = earningRaw._sum.amount ?? 0;


    //Recent Bookings (last 5)
    const recentBookings = await prisma.booking.findMany({
      where: { court: { venue: { ownerId } } },
      include: {
        user: { select: { fullName: true } },
        court: { include: { venue: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });


    return NextResponse.json({
      stats:{
        totalVenues,
        activeBookings,
        earning
      },
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        user: booking.user.fullName,
        venue: booking.court.venue.name,
        date: booking.startTime.toISOString().split("T")[0],
        status: booking.status,
      })),
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
