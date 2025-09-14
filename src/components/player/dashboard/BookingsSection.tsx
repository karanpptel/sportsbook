"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  venue: string;
  date: string;
  time: string;
  sport: string;
  price: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

interface BookingsSectionProps {
  recentBookings: Booking[];
}

export function BookingsSection({ recentBookings }: BookingsSectionProps) {
  const getStatusColor = (status: Booking["status"]) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return statusColors[status];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <CardTitle>Recent Bookings</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/player/bookings" className="flex items-center gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue & Sport</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.venue}</div>
                      <div className="text-sm text-gray-500">{booking.sport}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatDate(booking.date)}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>₹{booking.price}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/player/bookings/${booking.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}