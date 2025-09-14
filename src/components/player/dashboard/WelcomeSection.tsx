"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

interface WelcomeSectionProps {
  userName?: string;
  avatarUrl?: string;
}

export function WelcomeSection({ userName, avatarUrl }: WelcomeSectionProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {userName || "Player"} 👋
          </h2>
          <p className="text-gray-600 mt-1">Ready for your next game?</p>
        </div>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Button asChild variant="default" className="flex-1 md:flex-none">
          <Link href="/player/venues">
            <Search className="mr-2 h-4 w-4" />
            Find Venues
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 md:flex-none">
          <Link href="/player/bookings">
            View Bookings
          </Link>
        </Button>
      </div>
    </div>
  );
}