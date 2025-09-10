// src/app/api/dashboard/admin/venues/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = parseInt(params.id, 10);

    const venue = await prisma.venue.update({
      where: { id: venueId },
      data: { approved: true },
    });

    return NextResponse.json({ message: "Venue approved", venue });
  } catch (error) {
    console.error("Venue Approve Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
