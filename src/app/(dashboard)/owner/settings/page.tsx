// src/app/(dashboard)/owner/settings/page.tsx
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Building2,
  Phone,
  MapPin,
  Mail,
  Edit3,
  Save,
  Building,
  Users,
  Settings,
  ImageIcon,
  Lock,
} from "lucide-react";

type Profile = {
  id: number;
  businessName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  user: { id: number; fullName: string; email: string, avatarUrl?: string };
  venues: { id: number; name: string; city: string; state: string }[];
};

export default function OwnerSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  // Avatar file
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form state for password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/owner/profile");
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setForm({
          businessName: data.profile.businessName || "",
          phone: data.profile.phone || "",
          address: data.profile.address || "",
          city: data.profile.city || "",
          state: data.profile.state || "",
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  }

    async function saveAvatar() {
        if (!avatarFile) return;

        try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const res = await fetch("/api/dashboard/owner/avatar", {
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

    async function changePassword() {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("Passwords do not match");
        return;
        }

        try {
        const res = await fetch("/api/dashboard/owner/change-password", {
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

  async function saveProfile() {
    try {
      const method = profile ? "PUT" : "POST";
      const res = await fetch("/api/dashboard/owner/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      toast.success("Profile saved successfully");
      setEditOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  }

  useEffect(() => {
    fetchProfile();
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
            Manage your account and business information
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Owner Account
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 gap-2 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
             <span className="hidden md:block">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden md:block">Business</span>
          </TabsTrigger>
          <TabsTrigger value="venues" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="hidden md:block">Venues</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden md:block">Password</span>
          </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden md:block">Avatar</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {profile && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    {profile.user.avatarUrl ? (
                      <AvatarImage src={profile.user.avatarUrl} alt="avatar" />
                    ) : (
                      <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                        {getInitials(profile.user.fullName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{profile.user.fullName}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile.user.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.user.fullName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.user.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your business details and contact information
                </p>
              </div>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    {profile ? "Edit" : "Create"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {profile ? "Edit Business Profile" : "Create Business Profile"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        placeholder="Enter your business name"
                        value={form.businessName}
                        onChange={(e) =>
                          setForm({ ...form, businessName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="Enter your business address"
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={form.state}
                          onChange={(e) =>
                            setForm({ ...form, state: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveProfile} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Business Name
                      </Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.businessName || "Not specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.phone || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Address
                      </Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.address || "Not specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Location
                      </Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {profile.city && profile.state
                            ? `${profile.city}, ${profile.state}`
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Business Profile</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your business profile to get started
                  </p>
                  <Button onClick={() => setEditOpen(true)} className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Create Business Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venues Tab */}
        <TabsContent value="venues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Your Venues
                {profile?.venues?.length && (
                  <Badge variant="secondary" className="ml-2">
                    {profile.venues.length}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your sports venues and facilities
              </p>
            </CardHeader>
            <CardContent>
              {profile && profile.venues?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.venues.map((venue) => (
                    <Card key={venue.id} className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Building className="w-4 h-4 text-primary" />
                              {venue.name}
                            </h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {venue.city}, {venue.state}
                            </p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Venues Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any venues yet. Start by adding your first venue.
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Add Your First Venue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avatar Upload */}
        <TabsContent value="avatar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
              {avatarFile && (
                <div className="flex items-center gap-4">
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Button onClick={saveAvatar}>Upload</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

         {/* Password Change */}
        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                />
              </div>
              <Button onClick={changePassword} className="w-full">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
