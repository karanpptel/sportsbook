// app/api/dashboard/owner/reviews/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { email } from "zod";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    // Ensure owner profile exists
    const ownerProfile = await prisma.facilityOwner.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
    }

    // Fetch reviews for all venues owned by this owner
    const reviews = await prisma.review.findMany({
      where: { venue: { ownerId: ownerProfile.id } },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        venue: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        venue: r.venue.name,
        rating: r.rating,
        comment: r.comment,
        fullName: r.user.fullName,
        email: r.user.email,
        createdAt: r.createdAt,
      })),
    });
    } catch (error) {
    console.error("Error fetching owner reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}