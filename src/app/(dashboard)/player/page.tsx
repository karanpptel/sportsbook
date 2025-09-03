// src/app/(dashboard)/player/page.tsx
"use client";

import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PlayerDashboardPage() {
  const { data: session } = useSession();

  const stats = [
    { title: "Upcoming Bookings", value: "3", icon: <Calendar className="text-green-600" /> },
    { title: "Completed Games", value: "12", icon: <CheckCircle className="text-green-600" /> },
    { title: "Wallet Balance", value: "₹1500", icon: <Wallet className="text-green-600" /> },
  ];

  const recentBookings = [
    { id: "B001", venue: "City Sports Arena", date: "2025-09-05", status: "Confirmed" },
    { id: "B002", venue: "Green Park Turf", date: "2025-09-01", status: "Completed" },
    { id: "B003", venue: "Arena Club", date: "2025-08-28", status: "Cancelled" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {session?.user?.name || "Player"} 👋
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bookings */}
        <Card className="shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.venue}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
