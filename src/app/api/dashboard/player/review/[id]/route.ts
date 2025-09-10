import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = { params: { id: string } };

// ✅ PATCH - update review
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rating, comment } = body;

  const review = await prisma.review.findUnique({
    where: { id: Number(params.id) },
  });

  if (!review || review.userId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const updated = await prisma.review.update({
    where: { id: review.id },
    data: { rating, comment },
  });

  return NextResponse.json(updated);
}

// ✅ DELETE - delete review with recalculating avarage review 
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = Number(params.id);

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || existing.userId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Not allowed " }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: reviewId } });

  // 🔄 Recalculate average
  const stats = await prisma.review.aggregate({
    where: { venueId: existing.venueId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.venue.update({
    where: { id: existing.venueId },
    data: {
      rating: stats._avg.rating || 0,
      reviewsCount: stats._count.rating,
    },
  });

  return NextResponse.json({ success: true });
}

