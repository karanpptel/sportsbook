import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH: update a booking (cancel)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user?.role !== "USER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //only allow cancel
        if (status !== "CANCELLED") {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
    
        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
    
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status },
        });
    
        if (!updatedBooking) {
            return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
        }
    
        return NextResponse.json({ booking });
    
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
        
    }
}