// src/app/(dashboard)/admin/page.tsx
"use client";

import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, Activity } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  const stats = [
    { title: "Total Users", value: "245", icon: <Users className="text-purple-600" /> },
    { title: "Active Venues", value: "32", icon: <Building2 className="text-purple-600" /> },
    { title: "System Logs", value: "120", icon: <Activity className="text-purple-600" /> },
  ];

  const recentUsers = [
    { id: "U101", name: "Rahul Mehta", email: "rahul@example.com", role: "PLAYER", joined: "2025-09-01" },
    { id: "U102", name: "Ankit Sharma", email: "ankit@example.com", role: "OWNER", joined: "2025-08-28" },
    { id: "U103", name: "Priya Patel", email: "priya@example.com", role: "PLAYER", joined: "2025-08-25" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {session?.user?.name || "Admin"} 👋
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

        {/* Recent Users */}
        <Card className="shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.joined}</TableCell>
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
