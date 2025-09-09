// src/app/api/dashboard/owner/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";


// ✅ GET: fetch owner profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const ownerProfile = await prisma.facilityOwner.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
        venues: { select: { id: true, name: true, city: true, state: true } },
      },
    });

    if (!ownerProfile) {
      return NextResponse.json({ message: "Profile not created yet" }, { status: 200 });
    }

    return NextResponse.json({ profile: ownerProfile });
  } catch (err) {
    console.error("GET Owner Profile Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ✅ POST: create profile (if missing)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const data = await req.json();

    const existing = await prisma.facilityOwner.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    const newProfile = await prisma.facilityOwner.create({
      data: {
        userId,
        businessName: data.businessName || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
      },
    });

    return NextResponse.json({ profile: newProfile });
  } catch (err) {
    console.error("POST Owner Profile Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ✅ PUT: update profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const data = await req.json();

    const updatedProfile = await prisma.facilityOwner.update({
      where: { userId },
      data: {
        businessName: data.businessName ?? undefined,
        phone: data.phone ?? undefined,
        address: data.address ?? undefined,
        city: data.city ?? undefined,
        state: data.state ?? undefined,
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (err) {
    console.error("PUT Owner Profile Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}