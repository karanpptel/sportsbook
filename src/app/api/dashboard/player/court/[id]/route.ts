// src/app/api/dashboard/player/court/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const { id } = params;
    const courtId = parseInt(id, 10);

    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Use explicit UTC dates to avoid server timezone issues
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const court = await prisma.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return NextResponse.json({ error: "Court not found" }, { status: 404 });
    }

    // --- REFACTORED LOGIC ---

    // 1. Fetch all created slots for the day with their booking status
    const createdSlots = await prisma.slot.findMany({
      where: {
        courtId,
        startTime: { gte: startOfDay, lte: endOfDay },
      },
      select: {
        startTime: true,
        isBooked: true, // Fetch the authoritative status
      },
    });

    // 2. Create a Map for fast lookups (Timestamp -> isBooked)
    const slotStatusMap = new Map(
      createdSlots.map((slot) => [
        new Date(slot.startTime).getTime(),
        slot.isBooked,
      ])
    );
    
    // The separate query for bookings is no longer needed for this check,
    // simplifying the logic and removing the inconsistency.

    // 3. Generate all possible hourly slots and check their status from the map
    const availableSlots = [];
    const now = new Date();

    for (let hour = court.openTime; hour < court.closeTime; hour++) {
      const slotStart = new Date(startOfDay);
      slotStart.setUTCHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setUTCHours(hour + 1, 0, 0, 0);

      // Skip past hours for today
      if (slotStart < now) {
        continue;
      }

      // Check if a slot was created for this exact time
      if (slotStatusMap.has(slotStart.getTime())) {
        const isBooked = slotStatusMap.get(slotStart.getTime());
        
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          status: isBooked ? "BOOKED" : "AVAILABLE",
        });

      } else {
        // If the slot is not in the map, the owner has not created it
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          status: "NOT_CREATED",
        });
      }
    }
    // --- END OF REFACTORED LOGIC ---

    return NextResponse.json({ court, slots: availableSlots }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching slot availability:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}