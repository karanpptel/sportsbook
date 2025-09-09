"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  Mail, 
  MapPin, 
  Search, 
  Filter,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

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

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: 1,
    startTime: "2025-01-15T10:00:00Z",
    endTime: "2025-01-15T11:00:00Z",
    status: "PENDING",
    user: { id: 1, fullName: "John Smith", email: "john@example.com" },
    court: { id: 1, name: "Court A", sport: "Tennis", venueId: 1 },
    payment: { status: "PENDING", amount: 5000, currency: "INR" }
  },
  {
    id: 2,
    startTime: "2025-01-15T14:00:00Z",
    endTime: "2025-01-15T15:30:00Z",
    status: "CONFIRMED",
    user: { id: 2, fullName: "Sarah Johnson", email: "sarah@example.com" },
    court: { id: 2, name: "Court B", sport: "Badminton", venueId: 1 },
    payment: { status: "SUCCEEDED", amount: 3500, currency: "INR" }
  },
  {
    id: 3,
    startTime: "2025-01-16T09:00:00Z",
    endTime: "2025-01-16T10:30:00Z",
    status: "CANCELLED",
    user: { id: 3, fullName: "Mike Wilson", email: "mike@example.com" },
    court: { id: 3, name: "Court C", sport: "Squash", venueId: 1 },
    payment: { status: "REFUNDED", amount: 4000, currency: "INR" }
  },
  {
    id: 4,
    startTime: "2025-01-16T16:00:00Z",
    endTime: "2025-01-16T17:00:00Z",
    status: "COMPLETED",
    user: { id: 4, fullName: "Emma Davis", email: "emma@example.com" },
    court: { id: 4, name: "Court D", sport: "Basketball", venueId: 1 },
    payment: { status: "SUCCEEDED", amount: 6000, currency: "INR" }
  }
];

// Loading skeleton component
const BookingSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
      <div className="flex gap-2 pt-4">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: BookingStatusType }) => {
  const config = {
    PENDING: { 
      color: "bg-amber-100 text-amber-800 border-amber-200", 
      icon: AlertCircle,
      label: "Pending"
    },
    CONFIRMED: { 
      color: "bg-emerald-100 text-emerald-800 border-emerald-200", 
      icon: CheckCircle,
      label: "Confirmed"
    },
    CANCELLED: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: XCircle,
      label: "Cancelled"
    },
    COMPLETED: { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: CheckCircle,
      label: "Completed"
    },
  };

  const { color, icon: Icon, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// Payment badge component
const PaymentBadge = ({ payment }: { payment: { status: PaymentStatusType; amount: number; currency: string } }) => {
  const config = {
    PENDING: { 
      color: "bg-gray-100 text-gray-800 border-gray-200", 
      label: "Pending"
    },
    SUCCEEDED: { 
      color: "bg-emerald-100 text-emerald-800 border-emerald-200", 
      label: "Paid"
    },
    FAILED: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      label: "Failed"
    },
    REFUNDED: { 
      color: "bg-purple-100 text-purple-800 border-purple-200", 
      label: "Refunded"
    },
  };

  const { color, label } = config[payment.status];

  return (
    <div className="flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-gray-400" />
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${color}`}>
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-700">
        ₹{payment.amount / 100}
      </span>
    </div>
  );
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

  // Simulate loading and set mock data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const totalRevenue = bookings
      .filter(b => b.payment?.status === 'SUCCEEDED')
      .reduce((sum, b) => sum + (b.payment?.amount || 0), 0) / 100;
    
    return { total, pending, confirmed, totalRevenue };
  }, [bookings]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      
      // Toast would go here in real implementation
      console.log(`Booking ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bookings Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your venue bookings and track performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, court, or sport..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white cursor-pointer"
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
          </div>
        </div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BookingSkeleton key={i} />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500">There are no bookings matching your current filters.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {booking.court.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {booking.court.sport}
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  {/* User Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{booking.user.fullName}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {booking.user.email}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{formatDate(booking.startTime)}</div>
                        <div className="text-xs text-gray-500">to {formatDate(booking.endTime)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  {booking.payment && (
                    <div className="mb-4">
                      <PaymentBadge payment={booking.payment} />
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                {booking.status === "PENDING" && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={updating === booking.id}
                        onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                      >
                        {updating === booking.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </>
                        )}
                      </button>
                      
                      <button
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={updating === booking.id}
                        onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                      >
                        {updating === booking.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}