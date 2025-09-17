// src/app/(dashboard)/owner/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Building,
  CalendarCheck,
  DollarSign,
  Inbox,
  PlusCircle,
} from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface Booking {
  id: string;
  user: string;
  venue: string;
  date: string;
  status: string;
}

export default function OwnerDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard/owner", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const error = await res.json();
          toast.error(error.error || "Failed to fetch dashboard");
          setLoading(false);
          return;
        }

        const data = await res.json();

        setStats([
          {
            title: "Total Venues",
            value: data.stats.totalVenues,
            icon: <Building className="text-blue-600 w-6 h-6" />,
          },
          {
            title: "Active Bookings",
            value: data.stats.activeBookings,
            icon: <CalendarCheck className="text-green-600 w-6 h-6" />,
          },
          {
            title: "Earnings (This Month)",
            value: `₹${data.stats.earnings}`,
            icon: <DollarSign className="text-yellow-600 w-6 h-6" />,
          },
        ]);

        setRecentBookings(data.recentBookings || []);
      } catch (error) {
        console.error("Fetch Owner Dashboard Error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <div className="space-y-8 px-4 md:px-8 lg:px-16 py-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {session?.user?.name || "Owner"} 👋
          </h1>
          <Link href="/owner/venues">
            <Button className="flex items-center gap-2 px-4 py-2">
              <PlusCircle className="w-4 h-4" /> Add New Venue
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-md rounded-2xl p-6 animate-pulse">
                  <Skeleton className="h-5 w-32 mb-4" />
                  <Skeleton className="h-10 w-20" />
                </Card>
              ))
            : stats.map((stat) =>
                stat.title === "Total Venues" && stat.value === 0 ? (
                  <Card
                    key={stat.title}
                    className="shadow-sm rounded-2xl flex flex-col items-center justify-center text-center p-6 border-dashed border-2 border-gray-300"
                  >
                    <Building className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-4">
                      No venues added yet
                    </p>
                    <Button asChild size="sm">
                      <Link href="/owner/venues" className="flex items-center gap-1">
                        <PlusCircle className="w-4 h-4" />
                        Add Your First Venue
                      </Link>
                    </Button>
                  </Card>
                ) : (
                  <Card
                    key={stat.title}
                    className="shadow-md rounded-2xl border border-gray-100"
                  >
                    <CardHeader className="flex items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </CardTitle>
                      {stat.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-800">
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
        </div>

        {/* Recent Bookings Section */}
        <Card className="shadow-md rounded-2xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Inbox className="w-12 h-12 mb-3" />
                <p className="text-sm">No recent bookings yet.</p>
              </div>
            ) : (
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.user}</TableCell>
                      <TableCell>{booking.venue}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoutes>
  );
}
