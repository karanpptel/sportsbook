"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, CalendarCheck, DollarSign, Star, Download } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

// Types
interface Stat {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface BookingData {
  venue: string;
  confirmed: number;
  cancelled: number;
  pending: number;
}

interface VenuePopularityData {
  venue: string;
  bookings: number;
}

interface RatingData {
  venue: string;
  rating: number;
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

export default function OwnerAnalyticsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [venuePopularity, setVenuePopularity] = useState<VenuePopularityData[]>([]);
  const [ratingData, setRatingData] = useState<RatingData[]>([]);
  const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-01"));
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dashboard/owner/reports?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to fetch analytics");
        setLoading(false);
        return;
      }

      const data = await res.json();

      setStats([
        {
          title: "Total Venues",
          value: data.stats.totalVenues,
          subtitle: "Registered venues",
          icon: <Building className="text-blue-600" />,
        },
        {
          title: "Active Bookings",
          value: data.stats.activeBookings,
          subtitle: "Currently active",
          icon: <CalendarCheck className="text-green-600" />,
        },
        {
          title: "Earnings",
          value: `₹${data.stats.earnings / 100}`,
          subtitle: "Revenue earned",
          icon: <DollarSign className="text-yellow-600" />,
        },
        {
          title: "Average Rating",
          value: data.stats.avgRating.toFixed(1),
          subtitle: "Across all venues",
          icon: <Star className="text-orange-500" />,
        },
      ]);

      setRevenueData(data.revenue.map((d: RevenueData) => ({
        ...d,
        revenue: d.revenue / 100,
      })));
      setBookingData(data.bookings);
      setVenuePopularity(data.venuePopularity);
      setRatingData(data.ratings);
    } catch (error) {
      console.error("Fetch Analytics Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  async function exportReport(format: "csv" | "xlsx") {
    try {
      const res = await fetch(
        `/api/dashboard/owner/reports?startDate=${startDate}&endDate=${endDate}&export=${format}`
      );
      if (!res.ok) throw new Error("Failed to download report");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `owner_report.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report");
    }
  }

  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Owner Analytics Dashboard</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-2 py-1"
            />
            <span className="font-semibold">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-2 py-1"
            />
            <Button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Filter
            </Button>
            <Button
              onClick={() => exportReport("csv")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1 transition"
            >
              <Download size={16} /> CSV
            </Button>
            <Button
              onClick={() => exportReport("xlsx")}
              className="px-4 py-2  text-white rounded-md hover:bg-orange-700 flex items-center gap-1 transition"
            >
              <Download size={16} /> XLSX
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => (
                <Card key={i} className="shadow-lg rounded-2xl p-6 animate-pulse">
                  <Skeleton className="h-6 w-28 mb-2" />
                  <Skeleton className="h-10 w-20" />
                </Card>
              ))
            : stats.map((stat) => (
                <Card
                  key={stat.title}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6"
                >
                  <CardHeader className="flex items-center space-x-4 pb-2">
                    <div className="p-2 rounded-full bg-gray-100">{stat.icon}</div>
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      {stat.subtitle && <p className="text-xs text-gray-400">{stat.subtitle}</p>}
                    </div>
                  </CardHeader>
                </Card>
              ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Line Chart */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bookings per Venue Stacked Bar Chart */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle>Bookings per Venue</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingData}>
                    <XAxis dataKey="venue" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="confirmed" stackId="a" fill="#10B981" />
                    <Bar dataKey="cancelled" stackId="a" fill="#EF4444" />
                    <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Venue Popularity Pie Chart */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle>Venue Popularity</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={venuePopularity}
                      dataKey="bookings"
                      nameKey="venue"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {venuePopularity.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Ratings Radar Chart */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle>Venue Ratings</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={ratingData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="venue" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                    <Radar
                      name="Rating"
                      dataKey="rating"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
