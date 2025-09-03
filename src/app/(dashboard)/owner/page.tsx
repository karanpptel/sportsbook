// src/app/(dashboard)/owner/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, CalendarCheck, DollarSign, Inbox, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface Booking {
  id: number;
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
        const res = await fetch("/api/dashboard/owner");
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch dashboard");
          setLoading(false);
          return;
        }

        setStats([
          { title: "Total Venues", value: data.stats.totalVenues, icon: <Building className="text-blue-600" /> },
          { title: "Active Bookings", value: data.stats.activeBookings, icon: <CalendarCheck className="text-blue-600" /> },
          { title: "Earnings (This Month)", value: `₹${data.stats.earnings}`, icon: <DollarSign className="text-blue-600" /> },
        ]);

        setRecentBookings(data.recentBookings);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Owner Dashboard Error:", error);
        toast.error("Something went wrong");
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome */}
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {session?.user?.name || "Owner"} 👋
          </h2>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Card key={i} className="shadow-sm rounded-2xl p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </Card>
                ))
              : stats.map((stat) =>
                  stat.title === "Total Venues" && stat.value === 0 ? (
                    <Card
                      key={stat.title}
                      className="shadow-sm rounded-2xl flex flex-col items-center justify-center text-center p-6 border-dashed border-2 border-gray-300"
                    >
                      <Building className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-3">No venues added yet</p>
                      <Button asChild>
                        <Link href="/dashboard/owner/venues/new">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add Your First Venue
                        </Link>
                      </Button>
                    </Card>
                  ) : (
                    <Card key={stat.title} className="shadow-sm rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  )
                )}
          </div>

          {/* Recent Bookings */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Venue Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Inbox className="w-10 h-10 mb-2" />
                  <p className="text-sm">No recent bookings yet.</p>
                </div>
              ) : (
                <Table>
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
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.user}</TableCell>
                        <TableCell>{booking.venue}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
}
