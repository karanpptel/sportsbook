// src/app/api/dashboard/player/court/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: { id: string };
};

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

    try {
        const { id } = params;
        const courtId = parseInt(id, 10);

        //parse query params for date (YYYY-MM-DD)
        const url = new URL(request.url);
        const date = url.searchParams.get("date");

        if(!date){
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate) // set time to 00:00:00
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate) // set time to 23:59:59
        endOfDay.setHours(23, 59, 59, 999);


        //fetch court details
        const court = await prisma.court.findUnique({
            where:{id : courtId},
            include: { venue: true }
        });

        if(!court){
            return NextResponse.json({ error: "Court not found" }, { status: 404 });
        }


        // Fetch created slots for the court on the selected date
        const createdSlots = await prisma.slot.findMany({
            where: {
                courtId,
                startTime: { gte: startOfDay, lte: endOfDay },
            },
        });

        // Fetch bookings for the court on the selected date
        const bookings = await prisma.booking.findMany({
            where: {
                courtId,
                startTime: { gte: startOfDay, lte: endOfDay },
                status: { in: ["PENDING", "CONFIRMED"] }
            },
            select: {startTime: true, endTime: true, status: true},
        });

        // Generate slots
        const availableSlots = [];
        const now = new Date();
        const isToday = startOfDay.getDate() === now.getDate() && 
                       startOfDay.getMonth() === now.getMonth() && 
                       startOfDay.getFullYear() === now.getFullYear();
        
        // Always start from court's opening time for future dates
        const startHour = isToday ? Math.max(now.getHours(), court.openTime) : court.openTime;
        
        console.log('Debug - Slot Generation:', {
            courtOpenTime: court.openTime,
            courtCloseTime: court.closeTime,
            startHour,
            date: selectedDate,
            createdSlotsCount: createdSlots.length,
            bookingsCount: bookings.length
        });
        
        for (let hour = court.openTime; hour < court.closeTime; hour++) {
            const slotStart = new Date(selectedDate);
            slotStart.setHours(hour, 0, 0, 0);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(hour + 1);

            // For today's slots, skip past hours
            if (isToday && hour < now.getHours()) {
                continue;
            }

            // Check if slot is created by owner - use exact time matching
            const slotCreated = createdSlots.some(slot => {
                const slotHour = new Date(slot.startTime).getHours();
                return slotHour === hour;
            });

            // If slot is not created, mark as NOT_CREATED
            if (!slotCreated) {
                availableSlots.push({
                    startTime: slotStart,
                    endTime: slotEnd,
                    status: "NOT_CREATED"
                });
                continue;
            }

            // Check if slot is booked
            const isBooked = bookings.some(
                b =>
                    new Date(b.startTime).getTime() < slotEnd.getTime() &&
                    new Date(b.endTime).getTime() > slotStart.getTime()
            );

            availableSlots.push({
                startTime: slotStart,
                endTime: slotEnd,
                status: isBooked ? "BOOKED" : "AVAILABLE"
            });
    }


    return NextResponse.json({ court, slots: availableSlots }, { status: 200 });
    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}