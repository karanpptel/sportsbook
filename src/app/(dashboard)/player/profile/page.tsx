"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import {
  Settings,
  User,
  Mail,
  Calendar,
  Lock,
  ImageIcon,
} from "lucide-react";

type Profile = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

type Booking = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  court: {
    id: number;
    name: string;
    sport: string;
    venueId: number;
  };
};

export default function PlayerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  // Avatar file
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form state for profile update
  const [form, setForm] = useState({
    fullName: "",
    avatar: "",
    email: "",
  });

  // Form state for password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function fetchProfile() {
  try {
    setLoading(true);
    const res = await fetch("/api/dashboard/player/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.player) {
      setProfile(data.player);
      setForm({
        fullName: data.player.fullName || "",
        avatar: data.player.avatarUrl || "",
        email: data.player.email || "",
      });
    }
  } catch (err) {
    console.error("Fetch profile error:", err);
    toast.error("Failed to load profile");
  } finally {
    setLoading(false);
  }
}

  async function fetchRecentBookings() {
    try {
      const res = await fetch("/api/dashboard/player/bookings");
      const data = await res.json();
      if (data.booking) {
        // Get only the 5 most recent bookings
        setRecentBookings(data.booking.slice(0, 5));
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
    }
  }

  async function saveAvatar() {
  if (!avatarFile) return;

  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const res = await fetch("/api/dashboard/player/avatar", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload avatar");

    toast.success("Profile picture updated");
    setAvatarFile(null);
    fetchProfile();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update picture");
  }
}

  async function updateProfile() {
  try {
    const res = await fetch("/api/dashboard/player/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    toast.success("Profile updated successfully");
    fetchProfile();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile");
  }
}

  async function changePassword() {

    if(!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if(passwordForm.currentPassword == passwordForm.newPassword) {
      toast.error("New password cannot be the same as current password");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/dashboard/player/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      if (!res.ok) throw new Error("Password change failed");

      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchRecentBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-75"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Player Account
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={profile?.avatarUrl}
                      alt={profile?.fullName}
                    />
                    <AvatarFallback>{profile?.fullName ? getInitials(profile.fullName) : "?"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setAvatarFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    {avatarFile && (
                      <Button onClick={saveAvatar}>Update Picture</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-slate-50"
                    />
                  </div>
                </div>
                <Button onClick={updateProfile}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{booking.court.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.startTime).toLocaleDateString()}{" "}
                            {new Date(booking.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "CONFIRMED"
                              ? "default"
                              : booking.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No recent bookings
                    </p>
                  )}
                  {recentBookings.length > 0 && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/player/bookings">View All Bookings</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={changePassword}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
