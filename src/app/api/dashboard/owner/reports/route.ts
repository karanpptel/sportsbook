// src/app/api/dashboard/owner/reports/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Parser } from "json2csv"; // CSV export
import ExcelJS from "exceljs"; // Excel export
import { format } from "date-fns";


export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const exportType = searchParams.get("export"); // csv | xlsx

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "startDate and endDate are required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const userId = parseInt(session.user.id, 10);

    // Ensure owner profile
    const ownerProfile = await prisma.facilityOwner.findUnique({
      where: { userId },
    });
    if (!ownerProfile) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }
    const ownerId = ownerProfile.id;

    // Earnings in range
    const earningRaw = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        booking: { court: { venue: { ownerId } } },
        status: "SUCCEEDED",
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    // Bookings in range
    const bookingsCount = await prisma.booking.count({
      where: {
        court: { venue: { ownerId } },
        startTime: { gte: startDate, lte: endDate },
      },
    });

    // Breakdown by venue
    const earningsByVenue = await prisma.venue.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        courts: {
          select: {
            id: true,
            _count: {
              select: {
                bookings: {
                  where: {
                    startTime: { gte: startDate, lte: endDate }
                  }
                }
              }
            },
            bookings: {
              where: {
                startTime: { gte: startDate, lte: endDate }
              },
              select: {
                payment: {
                  where: { status: "SUCCEEDED" },
                  select: { amount: true }
                }
              }
            }
          }
        }
      }
    });


     // Transform venue breakdown
    const venueReport = earningsByVenue.map((venue) => {
      const totalEarnings = venue.courts.reduce((sum, court) => {
        return (
          sum +
          court.bookings.reduce((bSum, b) => bSum + (b.payment?.amount ?? 0), 0)
        );
      }, 0);

      const totalBookings = venue.courts.reduce((sum, court) => sum + court._count.bookings, 0);
      return { id: venue.id, name: venue.name, totalBookings, totalEarnings };
    });

     // Export as CSV
    if (exportType === "csv") {
      const parser = new Parser({ fields: ["id", "name", "totalBookings", "totalEarnings"] });
      const csv = parser.parse(venueReport);

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=owner-report-${startDateStr}-to-${endDateStr}.csv`,
        },
      });
    }

    // Export as Excel
    if (exportType === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Owner Report");

      worksheet.columns = [
        { header: "Venue ID", key: "id", width: 10 },
        { header: "Venue Name", key: "name", width: 30 },
        { header: "Total Bookings", key: "totalBookings", width: 20 },
        { header: "Total Earnings", key: "totalEarnings", width: 20 },
      ];

      venueReport.forEach((venue) => worksheet.addRow(venue));

      const buffer = await workbook.xlsx.writeBuffer();

      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=owner-report-${startDateStr}-to-${endDateStr}.xlsx`,
        },
      });
    }

    // Get total venues count
    const totalVenues = await prisma.venue.count({
      where: { ownerId }
    });

    // Get active bookings (current date)
    const activeBookings = await prisma.booking.count({
      where: {
        court: { venue: { ownerId } },
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
        status: "CONFIRMED"
      }
    });

    // Get average rating
    const avgRatingData = await prisma.venue.aggregate({
      where: { ownerId },
      _avg: { rating: true }
    });

    // Default JSON
    return NextResponse.json({
      stats: {
        totalVenues,
        activeBookings,
        earnings: earningRaw._sum.amount ?? 0,
        avgRating: avgRatingData._avg.rating ?? 0
      },
      venues: venueReport,
      // Transform venue data for different chart types
      revenue: [{
        date: format(startDate, "yyyy-MM-dd"),
        revenue: earningRaw._sum.amount ?? 0
      }],
      bookings: venueReport.map(venue => ({
        venue: venue.name,
        confirmed: venue.totalBookings,
        cancelled: 0,
        pending: 0
      })),
      venuePopularity: venueReport.map(venue => ({
        venue: venue.name,
        bookings: venue.totalBookings
      })),
      ratings: venueReport.map(venue => ({
        venue: venue.name,
        rating: 0 // You might want to add rating to the venue query above
      }))
    });
    } catch (err) {
    console.error("Error generating owner report:", err);
    return NextResponse.json({ error: "Something went wrong while generating report" },{ status: 500 });
  }

}