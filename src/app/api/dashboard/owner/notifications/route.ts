// src/app/api/dashboard/owner/notifications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownerId = Number(session.user.id);

  // Optional query params
  const url = new URL(req.url);
  const readFilter = url.searchParams.get("read"); // "true" or "false"
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: ownerId,
      ...(readFilter === "true" ? { read: true } : {}),
      ...(readFilter === "false" ? { read: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  return NextResponse.json({ notifications });
}
