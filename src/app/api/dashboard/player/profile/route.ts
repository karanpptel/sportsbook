import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// ✅ GET player profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const player = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json({ player });
  } catch (err) {
    console.error("GET /player/profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



// ✅ UPDATE player profile
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, avatar } = body;

    const updatedPlayer = await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: {
        fullName,
        avatarUrl: avatar,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ player: updatedPlayer });
  } catch (err) {
    console.error("PUT /player/profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
