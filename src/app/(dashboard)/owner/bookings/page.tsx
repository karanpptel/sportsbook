"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";

type BookingStatusType = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
type PaymentStatusType = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

// Type for bookings
type Booking = {
  id: number;
  startTime: string;
  endTime: string;
  status: BookingStatusType;
  user: { id: number; fullName: string; email: string };
  court: { id: number; name: string; sport: string; venueId: number };
  payment?: { status: PaymentStatusType; amount: number; currency: string };
};

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  // Format date
  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));

  // Fetch bookings
  useEffect(() => {
    const controller = new AbortController();

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/owner/bookings", {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok) setBookings(data.bookings);
        else toast.error(data.error || "Failed to fetch bookings");
      } catch (err: any) {
        if (err.name !== "AbortError") toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    return () => controller.abort();
  }, []);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        b.court.name.toLowerCase().includes(search.toLowerCase()) ||
        b.court.sport.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, filterStatus]);

  // Update booking status
  const updateBookingStatus = async (
    id: number,
    status: "CONFIRMED" | "CANCELLED"
  ) => {
    try {
      setUpdating(id);
      const res = await fetch(`/api/dashboard/owner/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update status");
        return;
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <DashboardLayout>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Bookings</h2>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by user, court, sport..."
              className="border rounded-md px-3 py-2 w-full md:w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded-md px-3 py-2 w-full md:w-1/6"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Bookings List */}
          {loading ? (
            <p className="text-gray-500">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBookings.map((b) => (
                <Card
                  key={b.id}
                  className="rounded-2xl shadow hover:shadow-md transition"
                >
                  <CardHeader>
                    <CardTitle>{b.court.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{b.court.sport}</p>
                  </CardHeader>
                  <CardContent className="text-sm text-foreground/80 space-y-1">
                    <p>👤 User: {b.user.fullName}</p>
                    <p>📧 Email: {b.user.email}</p>
                    <p>
                      🕒 {formatDate(b.startTime)} - {formatDate(b.endTime)}
                    </p>
                    <p>
                      Status:{" "}
                      <Badge
                        variant={
                          b.status === "PENDING"
                            ? "secondary"
                            : b.status === "CONFIRMED"
                            ? "default"
                            : b.status === "CANCELLED"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {b.status}
                      </Badge>
                    </p>
                    {b.payment && (
                      <p>
                        Payment:{" "}
                        <Badge
                          variant={
                            b.payment.status === "PENDING"
                              ? "secondary"
                              : b.payment.status === "SUCCEEDED"
                              ? "default"
                              : b.payment.status === "REFUNDED"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {b.payment.status} ({b.payment.amount / 100}{" "}
                          {b.payment.currency})
                        </Badge>
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {b.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          disabled={updating === b.id}
                          onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={updating === b.id}
                          onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
}
