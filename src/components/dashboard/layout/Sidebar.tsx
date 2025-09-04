"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "next-auth/react";
import {
  Home,
  Calendar,
  User,
  Settings,
  LogOut,
  MapPin,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  role: "OWNER" | "USER";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems =
    role === "OWNER"
      ? [
          { title: "Dashboard", href: "/owner", icon: <Home size={18} /> },
          { title: "Venues", href: "/owner/venues", icon: <MapPin size={18} /> },
          { title: "Bookings", href: "/owner/bookings", icon: <Calendar size={18} /> },
          { title: "Profile", href: "/owner/profile", icon: <User size={18} /> },
          { title: "Settings", href: "/owner/settings", icon: <Settings size={18} /> },
        ]
      : [
          { title: "Dashboard", href: "/player", icon: <Home size={18} /> },
          { title: "Book Venue", href: "/player/bookings", icon: <Calendar size={18} /> },
          { title: "Profile", href: "/player/profile", icon: <User size={18} /> },
          { title: "Settings", href: "/player/settings", icon: <Settings size={18} /> },
        ];

  const renderMenuItems = () =>
    menuItems.map((item) => {
      const active = pathname === item.href;
      return (
        <Link
          key={item.title}
          href={item.href}
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            active
              ? "bg-green-100 text-green-700 font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          {!collapsed && item.title}
        </Link>
      );
    });

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="lg:hidden flex items-center justify-between p-2 border-b">
        <h1 className="text-xl font-bold text-green-600">SportsBook</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-50 bg-white border-r shadow-sm flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header + Collapse toggle */}
        <div className="flex items-center justify-between h-20 p-4 border-b">
          {!collapsed && <h1 className="text-xl font-bold text-green-600">SportsBook</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </Button>
        </div>

        {/* Menu */}
        <ScrollArea className="flex-1 p-4">{renderMenuItems()}</ScrollArea>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </aside>
    </>
  );
}
