import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// ✅ GET - fetch all reviews for a venue
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const venueId = Number(params.id);
    if (!venueId) {
      return NextResponse.json({ error: "Invalid venue ID" }, { status: 400 });
    }
  
    const reviews = await prisma.review.findMany({
      where: { venueId, comment: { not: "" } },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(reviews);
  } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
