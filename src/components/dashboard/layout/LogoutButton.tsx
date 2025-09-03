"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully!");
      window.location.href = "/login"; // redirect to login page
    } catch (err) {
      console.error(err);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-600"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}
