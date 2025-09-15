// src/app/(dashboard)/player/page.tsx
"use client";

import { useSession } from "next-auth/react";

import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";
import { WelcomeSection } from "@/components/player/dashboard/WelcomeSection";
import { StatsSection } from "@/components/player/dashboard/StatsSection";
import { BookingsSection } from "@/components/player/dashboard/BookingsSection";
import { RecommendedVenues } from "@/components/player/dashboard/RecommendedVenues";
import { useEffect, useState } from "react";


interface DashboardStats {
  upcomingBookings: number;
  completedGames: number;
  walletBalance: number;
  totalHoursPlayed: number;
  bookingRate: number;
}

interface RecentBooking {
  id: string;
  venue: string;
  date: string;
  time: string;
  sport: string;
  price: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

interface RecommendedVenue {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  sport: string;
  pricePerHour: number;
}




export default function PlayerDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    completedGames: 0,
    walletBalance: 0,
    totalHoursPlayed: 0,
    bookingRate: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recommendedVenues, setRecommendedVenues] = useState<RecommendedVenue[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsRes = await fetch("/api/dashboard/player/stats");
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        if (statsData) setStats(statsData);

        // Fetch recent bookings
        const bookingsRes = await fetch("/api/dashboard/player/bookings?limit=5");
        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        const bookingsData = await bookingsRes.json();
        if (bookingsData?.bookings) setRecentBookings(bookingsData.bookings);

        // Fetch recommended venues
        const venuesRes = await fetch("/api/dashboard/player/recommended-venues");
        if (!venuesRes.ok) throw new Error("Failed to fetch venues");
        const venuesData = await venuesRes.json();
        if (venuesData?.venues) setRecommendedVenues(venuesData.venues);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error instanceof Error ? error.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <ProtectedRoutes allowedRoles={["USER", "PLAYER"]}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </ProtectedRoutes>
    );
  }


  if (loading) {
    return (
      <ProtectedRoutes allowedRoles={["USER", "PLAYER"]}>
        <div className="space-y-6 p-6">
          <div className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
        </div>
      </ProtectedRoutes>
    );
  }

  return (
    <ProtectedRoutes allowedRoles={["USER", "PLAYER"]}>
      <div className="space-y-6 p-6">
        <WelcomeSection 
          userName={session?.user?.name ?? ""} 
          avatarUrl={session?.user?.image ?? ""} 
        />
        
        <StatsSection stats={stats} />
        
         <div className="grid grid-cols-1 gap-6">
          {Array.isArray(recentBookings) && <BookingsSection recentBookings={recentBookings} />}
          {Array.isArray(recommendedVenues) && <RecommendedVenues venues={recommendedVenues} />}
        </div>

      </div>
    </ProtectedRoutes>
  );
}
