"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Edit, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  approved: boolean;
}

export default function OwnerVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch("/api/dashboard/owner/venues");
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to fetch venues");
          setLoading(false);
          return;
        }
        setVenues(data.venues);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (loading) return <DashboardLayout><div>Loading venues...</div></DashboardLayout>;

  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Venues</h2>

          <Card className="shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Venues List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell>{venue.id}</TableCell>
                      <TableCell>{venue.name}</TableCell>
                      <TableCell>{venue.city}</TableCell>
                      <TableCell>{venue.address}</TableCell>
                      <TableCell>{venue.approved ? "Approved" : "Pending"}</TableCell>
                      <TableCell className="flex gap-2">
                        <button className="text-blue-600"><Edit size={16} /></button>
                        <button className="text-red-600"><Trash size={16} /></button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
}
