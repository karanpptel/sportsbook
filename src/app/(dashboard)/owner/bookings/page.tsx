
// src/app/(dashboard)/owner/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

type Booking = {
  id: number;
  user: { id: number; fullName: string; email: string };
  court: { id: number; name: string; sport: string; venueId: number };
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  payment?: { id: number; amount: number; status: string };
};

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", venue: "", date: "" });
  const [updating, setUpdating] = useState<number | null>(null);

  // 🔹 Fetch bookings from backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/owner/bookings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Update booking status
  const updateBookingStatus = async (id: number, status: "CONFIRMED" | "CANCELLED") => {
    try {
      setUpdating(id);
      const res = await fetch(`/api/dashboard/owner/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update booking");

      setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error("Error updating booking:", err);
      toast.error("Failed to update booking");
    } finally {
      setUpdating(null);
    }
  };

  // 🔹 Apply filters (frontend for now)
  const filteredBookings = bookings.filter((b) => {
    return (
      (!filter.status || b.status === filter.status) &&
      (!filter.venue || b.court.venueId.toString() === filter.venue) &&
      (!filter.date || b.startTime.startsWith(filter.date))
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select onValueChange={(v) => setFilter({ ...filter, status: v })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          className="w-[200px]"
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      {/* Bookings List */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredBookings.map((b) => (
            <Card key={b.id} className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle>
                  {b.court.name} ({b.court.sport})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <b>Player:</b> {b.user.fullName} ({b.user.email})
                </p>
                <p>
                  <b>Time:</b>{" "}
                  {new Date(b.startTime).toLocaleString()} -{" "}
                  {new Date(b.endTime).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Badge>{b.status}</Badge>
                  {b.payment && (
                    <Badge variant="outline">
                      Payment: ₹{b.payment.amount} ({b.payment.status})
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {b.status === "PENDING" && (
                    <Button
                      size="sm"
                      disabled={updating === b.id}
                      onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                    >
                      Approve
                    </Button>
                  )}
                  {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={updating === b.id}
                      onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                    >
                      {b.status === "CONFIRMED" ? "Cancel & Refund" : "Decline"}
                    </Button>
                    
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState, useMemo } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";

// import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";

// type BookingStatusType = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
// type PaymentStatusType = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

// // Type for bookings
// type Booking = {
//   id: number;
//   startTime: string;
//   endTime: string;
//   status: BookingStatusType;
//   user: { id: number; fullName: string; email: string };
//   court: { id: number; name: string; sport: string; venueId: number };
//   payment?: { status: PaymentStatusType; amount: number; currency: string };
// };

// export default function OwnerBookingsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string>("ALL");
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState<number | null>(null);

//   // Format date
//   const formatDate = (dateStr: string) =>
//     new Intl.DateTimeFormat("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date(dateStr));

//   // Fetch bookings
//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/dashboard/owner/bookings", {
//           signal: controller.signal,
//         });
//         const data = await res.json();
//         if (res.ok) setBookings(data.bookings);
//         else toast.error(data.error || "Failed to fetch bookings");
//       } catch (err: any) {
//         if (err.name !== "AbortError") toast.error("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//     return () => controller.abort();
//   }, []);

//   // Filtered bookings
//   const filteredBookings = useMemo(() => {
//     return bookings.filter((b) => {
//       const matchSearch =
//         b.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
//         b.court.name.toLowerCase().includes(search.toLowerCase()) ||
//         b.court.sport.toLowerCase().includes(search.toLowerCase());
//       const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
//       return matchSearch && matchStatus;
//     });
//   }, [bookings, search, filterStatus]);

//   // Update booking status
//   const updateBookingStatus = async (
//     id: number,
//     status: "CONFIRMED" | "CANCELLED"
//   ) => {
//     try {
//       setUpdating(id);
//       const res = await fetch(`/api/dashboard/owner/bookings/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.error || "Failed to update status");
//         return;
//       }
//       setBookings((prev) =>
//         prev.map((b) => (b.id === id ? { ...b, status } : b))
//       );
//       toast.success(`Booking ${status.toLowerCase()} successfully`);
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   return (
//     <ProtectedRoutes allowedRoles={["OWNER"]}>
      
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-4">Bookings</h2>

//           {/* Search & Filter */}
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <input
//               type="text"
//               placeholder="Search by user, court, sport..."
//               className="border rounded-md px-3 py-2 w-full md:w-1/3"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <select
//               className="border rounded-md px-3 py-2 w-full md:w-1/6"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="ALL">All Status</option>
//               <option value="PENDING">Pending</option>
//               <option value="CONFIRMED">Confirmed</option>
//               <option value="CANCELLED">Cancelled</option>
//               <option value="COMPLETED">Completed</option>
//             </select>
//           </div>

//           {/* Bookings List */}
//           {loading ? (
//             <p className="text-gray-500">Loading bookings...</p>
//           ) : filteredBookings.length === 0 ? (
//             <p className="text-gray-500">No bookings found.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//               {filteredBookings.map((b) => (
//                 <Card
//                   key={b.id}
//                   className="rounded-2xl shadow hover:shadow-md transition"
//                 >
//                   <CardHeader>
//                     <CardTitle>{b.court.name}</CardTitle>
//                     <p className="text-sm text-muted-foreground">{b.court.sport}</p>
//                   </CardHeader>
//                   <CardContent className="text-sm text-foreground/80 space-y-1">
//                     <p>👤 User: {b.user.fullName}</p>
//                     <p>📧 Email: {b.user.email}</p>
//                     <p>
//                       🕒 {formatDate(b.startTime)} - {formatDate(b.endTime)}
//                     </p>
//                     <p>
//                       Status:{" "}
//                       <Badge
//                         variant={
//                           b.status === "PENDING"
//                             ? "secondary"
//                             : b.status === "CONFIRMED"
//                             ? "default"
//                             : b.status === "CANCELLED"
//                             ? "destructive"
//                             : "default"
//                         }
//                       >
//                         {b.status}
//                       </Badge>
//                     </p>
//                     {b.payment && (
//                       <p>
//                         Payment:{" "}
//                         <Badge
//                           variant={
//                             b.payment.status === "PENDING"
//                               ? "secondary"
//                               : b.payment.status === "SUCCEEDED"
//                               ? "default"
//                               : b.payment.status === "REFUNDED"
//                               ? "outline"
//                               : "destructive"
//                           }
//                         >
//                           {b.payment.status} ({b.payment.amount / 100}{" "}
//                           {b.payment.currency})
//                         </Badge>
//                       </p>
//                     )}
//                   </CardContent>
//                   <CardFooter className="flex gap-2">
//                     {b.status === "PENDING" && (
//                       <>
//                         <Button
//                           size="sm"
//                           disabled={updating === b.id}
//                           onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
//                         >
//                           Confirm
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           disabled={updating === b.id}
//                           onClick={() => updateBookingStatus(b.id, "CANCELLED")}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     )}
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
      
//     </ProtectedRoutes>
//   );
// }
