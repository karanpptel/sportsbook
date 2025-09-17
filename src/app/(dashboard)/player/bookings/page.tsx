// src/app/(dashboard)/player/bookings/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { BookingsList } from "@/components/player/bookings/BookingsList";
import { Loader2, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/dashboard/player/bookings");
        
        const data = await res.json();
        setBookings(data.booking || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const totalBookings = bookings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          </div>
          <p className="text-slate-600">Manage and track all your sports venue bookings</p>
        </div>

        {/* Stats Cards */}
        {totalBookings > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-slate-900">{totalBookings}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Confirmed</p>
                    <p className="text-2xl font-bold text-green-600">{confirmedBookings}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{pendingBookings}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Loader2 className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings List */}
        <BookingsList bookings={bookings} />
      </div>
    </div>
  );
}
