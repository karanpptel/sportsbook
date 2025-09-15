// src/app/api/dashboard/player/bookings/cleanup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// This endpoint will be called by a cron job or scheduled task
export async function POST(req: NextRequest) {
    try {
        // Ensure request is authenticated and from an admin or system
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Calculate cutoff time (15 minutes ago)
        const cutoffTime = new Date(Date.now() - 15 * 60 * 1000);

        // Find and update stale bookings
        const staleBookings = await prisma.booking.updateMany({
            where: {
                status: "PENDING",
                createdAt: {
                    lt: cutoffTime
                }
            },
            data: {
                status: "CANCELLED"
            }
        });

        return NextResponse.json({ 
            message: "Cleanup completed",
            cancelledBookings: staleBookings.count 
        });

    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json({ error: "Failed to cleanup bookings" }, { status: 500 });
    }
}

// This endpoint will show current pending bookings that might need cleanup
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const cutoffTime = new Date(Date.now() - 15 * 60 * 1000);

        const pendingBookings = await prisma.booking.findMany({
            where: {
                status: "PENDING",
                createdAt: {
                    lt: cutoffTime
                }
            },
            select: {
                id: true,
                createdAt: true,
                startTime: true,
                endTime: true,
                userId: true,
                courtId: true
            }
        });

        return NextResponse.json({ pendingBookings });

    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        return NextResponse.json({ error: "Failed to fetch pending bookings" }, { status: 500 });
    }
}