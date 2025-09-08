// src/components/owner/VenueListPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

type Venue = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  amenities?: string[];
  photos?: string[];
  approved?: boolean;
};

type Props = {
  venues: Venue[];
};

const AMENITIES = ["Parking", "Lights", "Locker Room", "WiFi", "Cafeteria", "Seating Area", "First Aid", "Equipment Rental", "Restrooms"];
const PLACEHOLDER = "/window.svg";

// PhotoPreview component for edit dialog
interface PhotoPreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ src, alt, onRemove }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    setImageLoaded(false);
  };

  return (
    <div className="relative group">
      {isLoading && (
        <div className="w-20 h-20 rounded-xl bg-slate-200 animate-pulse flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {imageError && (
        <div className="w-20 h-20 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center">
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-xs text-red-500 mt-1">Error</span>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={400}
        height={300}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`object-cover rounded-xl w-full h-full transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ display: imageError ? 'none' : 'block' }}
      />

      {(imageLoaded || imageError) && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default function VenueListPage({ venues }: Props) {
  const [items, setItems] = useState<Venue[]>(venues);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    description: "",
    amenities: [] as string[],
    photos: [] as string[],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => setItems(venues), [venues]);

  // ---------- Delete ----------
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/dashboard/owner/venues/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete venue");
        return;
      }
      setItems((prev) => prev.filter((v) => v.id !== id));
      toast.success("Venue deleted");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // ---------- View dialog ----------
  const selectedPhotos = useMemo(() => selectedVenue?.photos ?? [], [selectedVenue]);
  const photoCount = selectedPhotos.length;
  const nextImage = () => photoCount > 1 && setActiveIndex((p) => (p + 1) % photoCount);
  const prevImage = () => photoCount > 1 && setActiveIndex((p) => (p - 1 + photoCount) % photoCount);

  // ---------- Edit dialog ----------
  useEffect(() => {
    if (!editVenue) return;
    setEditForm({
      name: editVenue.name ?? "",
      address: editVenue.address ?? "",
      city: editVenue.city ?? "",
      state: editVenue.state ?? "",
      description: editVenue.description ?? "",
      amenities: editVenue.amenities ?? [],
      photos: editVenue.photos ?? [],
    });
  }, [editVenue]);

  const toggleAmenity = (a: string) => {
    setEditForm((f) => {
      const has = f.amenities.includes(a);
      return { ...f, amenities: has ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] };
    });
  };

  const handleEditPhotoUpload = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, JPEG or PNG)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    
    try {
      setUploading(true);
      const res = await fetch("/api/upload/venue", { 
        method: "POST", 
        body: fd 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      
      if (data?.url) {
        setEditForm((f) => ({ ...f, photos: [...f.photos, data.url] }));
        toast.success("Photo uploaded successfully");
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async () => {
    if (!editVenue) return;
    try {
      const res = await fetch(`/api/dashboard/owner/venues/${editVenue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update");
        return;
      }
      setItems((prev) =>
        prev.map((v) => (v.id === editVenue.id ? { ...v, ...data.venue } : v))
      );
      toast.success("Venue updated");
      setEditVenue(null);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  // ---------- Search & Filter ----------
  const filteredVenues = useMemo(() => {
    return items.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.city?.toLowerCase().includes(search.toLowerCase()) ||
        v.address?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "approved" && v.approved) ||
        (filterStatus === "pending" && !v.approved);
      return matchesSearch && matchesStatus;
    });
  }, [items, search, filterStatus]);

  return (
    <div className="container mx-auto px-4">
      <Card className="rounded-3xl border-0 bg-white shadow-xl shadow-slate-200/50">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Your Venues
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Manage and monitor your venue listings
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        {/* Search & Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, city, or address..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 pr-8 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="approved">�� Approved</option>
                <option value="pending">⏳ Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No venues found</h3>
            <p className="text-slate-500 mb-4">
              {search ? "Try adjusting your search terms" : "You haven't created any venues yet"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search to see all venues
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Card
                key={venue.id}
                className="rounded-2xl overflow-hidden border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group"
              >
                {/* Venue Image */}
                <div className="relative h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <Image
                    src={(venue.photos && venue.photos[0]) || PLACEHOLDER}
                    alt={venue.name}
                    width={800}
                    height={600}
                    priority
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER;
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={venue.approved ? "default" : "secondary"}
                      className={`${
                        venue.approved 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      } font-medium`}
                    >
                      {venue.approved ? "✅ Approved" : "⏳ Pending"}
                    </Badge>
                  </div>
                </div>

                {/* Venue Content */}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                    {venue.name}
                  </CardTitle>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {venue.description || "No description provided."}
                  </p>
                </CardHeader>

                <CardContent className="text-sm text-slate-600 space-y-3">
                  {/* Location */}
                  {(venue.address || venue.city || venue.state) && (
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-slate-700">
                        {venue.address}
                        {venue.city ? `, ${venue.city}` : ""}
                        {venue.state ? `, ${venue.state}` : ""}
                      </span>
                    </div>
                  )}

                  {/* Amenities */}
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Amenities
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {venue.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge 
                            key={`${venue.id}-${amenity}-${i}`} 
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {venue.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                            +{venue.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Action Buttons */}
                <CardFooter className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
                  <Link href={`/owner/venues/${venue.id}/courts`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Manage Courts
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVenue(venue);
                      setActiveIndex(0);
                    }}
                    className="rounded-lg border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditVenue(venue)}
                    className="rounded-lg border-slate-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(venue.id)}
                    className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </CardFooter>
+
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    {/* View Details Dialog */}
    <Dialog open={!!selectedVenue} onOpenChange={() => setSelectedVenue(null)}>
        <DialogContent className="max-w-3xl">
          {selectedVenue && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVenue?.name}</DialogTitle>
              </DialogHeader>

              {/* Image Slider */}
              {photoCount > 1 ? (
                <div className="relative w-full h-72 mb-4 overflow-hidden rounded-xl">
                  {selectedPhotos.map((src, idx) => (
                    <Image
                      key={idx}
                      src={src}
                      alt={`photo-${idx}`}
                      fill
                      className={`object-cover transition-opacity duration-500 ${
                        idx === activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-black/50 px-2 py-1 text-white"
                    onClick={prevImage}
                  >
                    ◀
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-black/50 px-2 py-1 text-white"
                    onClick={nextImage}
                  >
                    ▶
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-72 mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={selectedPhotos[0] || PLACEHOLDER}
                    alt={selectedVenue?.name || "Venue"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {selectedVenue?.description || "No description provided."}
                </p>
                {(selectedVenue?.address || selectedVenue?.city || selectedVenue?.state) && (
                  <p>
                    📍 {selectedVenue?.address || ""}
                    {selectedVenue?.city ? `, ${selectedVenue.city}` : ""}
                    {selectedVenue?.state ? `, ${selectedVenue.state}` : ""}
                  </p>
                )}
                <p>
                  Status:{" "}
                  <Badge variant={selectedVenue?.approved ? "default" : "secondary"}>
                    {selectedVenue?.approved ? "Approved" : "Pending"}
                  </Badge>
                </p>
                {selectedVenue?.amenities && selectedVenue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedVenue?.amenities?.map((a, i) => (
                      <Badge key={`detail-${i}`} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editVenue} onOpenChange={() => setEditVenue(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editVenue && (
            <>
              <DialogHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-slate-900">
                      Edit Venue
                    </DialogTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      Update the details for "{editVenue?.name || 'Venue'}"
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Venue Name
                      </label>
                      <input
                        className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 px-4 transition-all duration-200"
                        placeholder="Enter venue name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        City
                      </label>
                      <input
                        className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 px-4 transition-all duration-200"
                        placeholder="Enter city"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, city: e.target.value }))
                        }
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Street Address
                      </label>
                      <input
                        className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 px-4 transition-all duration-200"
                        placeholder="Enter street address"
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, address: e.target.value }))
                        }
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        State/Province
                      </label>
                      <input
                        className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 px-4 transition-all duration-200"
                        placeholder="Enter state or province"
                        value={editForm.state}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, state: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6 space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description
                    </label>
                    <textarea
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 px-4 py-3 min-h-[120px] transition-all duration-200 resize-none"
                      placeholder="Provide a detailed description of your venue..."
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Available Amenities
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {AMENITIES.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 bg-slate-50/30 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 group"
                      >
                        <input
                          type="checkbox"
                          checked={editForm.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Venue Photos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEditPhotoUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {uploading && (
                      <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-600 font-medium">Uploading photo...</span>
                      </div>
                    )}

                    {editForm.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {editForm.photos.map((photo, i) => (
                          <PhotoPreview
                            key={`edit-${photo}-${i}`}
                            src={photo}
                            alt={`Venue photo ${i + 1}`}
                            onRemove={() =>
                              setEditForm((f) => ({
                                ...f,
                                photos: f.photos.filter((_, idx) => idx !== i),
                              }))
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditVenue(null)}
                    className="px-6 py-2 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveEdit}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
