// src/app/api/dashboard/admin/venues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all venues (pending + approved)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venues = await prisma.venue.findMany({
      include: {
        owner: {
          include: {
            user: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ venues });
  } catch (error) {
    console.error("Admin Venues List Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
