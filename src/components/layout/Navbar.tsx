"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
};

type Role = "USER" | "OWNER" | "ADMIN" | "GUEST";

// Role-based navlinks
const navLinks: Record<Exclude<Role, "GUEST">, NavLink[]> = {
  USER: [
    // { href: "/", label: "Home" },
    { href: "/player", label: "Dashboard" },
    { href: "/player/venues", label: "Venues" },
    { href: "/player/bookings", label: "My Bookings" },
    { href: "/contact", label: "Contact" },
    { href: "/player/profile", label: "Profile" },
  ],
  OWNER: [
    //{ href: "/", label: "Home" },
    { href: "/owner", label: "Dashboard" },
    //{ href: "/venues/manage", label: "Manage Venues" },
    { href: "/owner/bookings", label: "Manage Bookings" },
    //{ href: "/contact", label: "Contact" },
    { href: "/owner/analytics", label: "Analytics" },
    { href: "/owner/settings", label: "Profile" },
  ],
  ADMIN: [
    { href: "/", label: "Home" },
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/venues", label: "Venues" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allowedRoles: Role[] = ["USER", "OWNER", "ADMIN", "GUEST"];
  const sessionRole = session?.user?.role;

  const role: Role = allowedRoles.includes(sessionRole as Role)
    ? (sessionRole as Role)
    : "GUEST";
  const links: NavLink[] =
    role in navLinks
      ? navLinks[role as keyof typeof navLinks]
      : [
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/venues", label: "Venues" },
          { href: "/contact", label: "Contact" },
        ];

    const profileDropdownLinks: Record<Exclude<Role, "GUEST">, NavLink> = {
      USER: { href: "/player/profile", label: "Player Profile" },
      OWNER: { href: "/owner/settings", label: "Owner Settings" },
      ADMIN: { href: "/admin/settings", label: "Admin Settings" },
    };
        
  return (
    <header className="w-full shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center text-xl font-bold">
           <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 mr-2 rounded-full"
            />
          Sportify<span className="text-blue-600">Hub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center  space-x-6">
          {links.map((link: NavLink) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-blue-600 font-semibold  transition"
            >
              {link.label}
            </Link>
          ))}
          </nav>
          

          <div className="hidden md:flex items-center space-x-3">
          {/* Auth Buttons / User Dropdown */}
          {!session ? (
            <div className="grid sm:grid-cols-2 space-x-3">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-3">
                  <User className="w-5 h-5 mr-2" />
                  {session.user?.name || "Profile"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  Signed in as <br />
                  <span className="font-semibold">{session.user?.email}</span>
                </DropdownMenuLabel>
                {/* <DropdownMenuItem>
                  <Link href={profileDropdownLinks[role as keyof typeof profileDropdownLinks].href}>
                  {profileDropdownLinks[role as keyof typeof profileDropdownLinks].label}
                </Link>
              </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem> */}
                {role === "USER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/player/bookings">My Bookings</Link>
                  </DropdownMenuItem>  
                )}
                {role === "USER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/player/profile">Settings</Link>
                  </DropdownMenuItem>
                )}
                {role === "OWNER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/owner/venues">Manage Venues</Link>
                  </DropdownMenuItem>
                )}
                {role === "OWNER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/owner/settings">Settings</Link>
                  </DropdownMenuItem>
                )}
                {role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {links.map((link : NavLink) => (
            <Link
              key={link.href}
              href={link.href}
              className="block hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!session ? (
            <div className="flex flex-col gap-3">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                Signed in as <br />
                <span className="font-semibold">{session.user?.email}</span>
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
