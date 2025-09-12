"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, TrendingUp, Wallet } from "lucide-react";

interface StatsCardProps {
  stats: {
    upcomingBookings: number;
    completedGames: number;
    walletBalance: number;
    totalHoursPlayed: number;
    bookingRate: number;
  };
}

export function StatsSection({ stats }: StatsCardProps) {
  const statCards = [
    {
      title: "Upcoming Bookings",
      value: stats.upcomingBookings.toString(),
      subtitle: "Next 7 days",
      icon: <Calendar className="text-blue-600" />,
      trend: "+2 from last week",
      trendUp: true,
    },
    {
      title: "Completed Games",
      value: stats.completedGames.toString(),
      subtitle: "All time",
      icon: <CheckCircle className="text-green-600" />,
      trend: `${stats.bookingRate}% completion rate`,
      trendUp: true,
    },
    {
      title: "Hours Played",
      value: stats.totalHoursPlayed.toString(),
      subtitle: "Total hours",
      icon: <Clock className="text-purple-600" />,
      trend: "2 hours this week",
      trendUp: true,
    },
    {
      title: "Wallet Balance",
      value: `₹${stats.walletBalance}`,
      subtitle: "Available credit",
      icon: <Wallet className="text-amber-600" />,
      trend: "Add money",
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className="p-2 bg-gray-50 rounded-full">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-4 w-4 ${stat.trendUp ? 'text-green-500' : 'text-gray-400'} mr-1`} />
                <span className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-gray-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}