"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

const AMENITIES = ["Parking", "Lights", "Locker Room", "WiFi", "Cafeteria"];
const PLACEHOLDER = "/window.svg";

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
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET");
    try {
      setUploading(true);
      const res = await fetch("/api/upload/venue", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.url) {
        setEditForm((f) => ({ ...f, photos: [...f.photos, data.url] }));
        toast.success("Photo uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Upload error");
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
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Venues</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by name, city, or address..."
          className="border rounded-md px-3 py-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {filteredVenues.length === 0 ? (
        <p className="text-gray-500">No venues found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card
              key={venue.id}
              className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <div className="relative h-44 w-full bg-muted">
                <Image
                  src={(venue.photos && venue.photos[0]) || PLACEHOLDER}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{venue.name}</span>
                  <Badge variant={venue.approved ? "default" : "secondary"}>
                    {venue.approved ? "Approved" : "Pending"}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {venue.description || "No description provided."}
                </p>
              </CardHeader>

              <CardContent className="text-sm text-foreground/80 space-y-1">
                {(venue.address || venue.city || venue.state) && (
                  <p>
                    📍 {venue.address}
                    {venue.city ? `, ${venue.city}` : ""}
                    {venue.state ? `, ${venue.state}` : ""}
                  </p>
                )}
                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {venue.amenities.map((a, i) => (
                      <Badge key={`${venue.id}-${a}-${i}`} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVenue(venue);
                    setActiveIndex(0);
                  }}
                >
                  View details
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditVenue(venue)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(venue.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedVenue} onOpenChange={() => setSelectedVenue(null)}>
        <DialogContent className="max-w-3xl">
          {selectedVenue && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVenue.name}</DialogTitle>
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
                    alt={selectedVenue.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {selectedVenue.description || "No description provided."}
                </p>
                {(selectedVenue.address || selectedVenue.city || selectedVenue.state) && (
                  <p>
                    📍 {selectedVenue.address}
                    {selectedVenue.city ? `, ${selectedVenue.city}` : ""}
                    {selectedVenue.state ? `, ${selectedVenue.state}` : ""}
                  </p>
                )}
                <p>
                  Status:{" "}
                  <Badge variant={selectedVenue.approved ? "default" : "secondary"}>
                    {selectedVenue.approved ? "Approved" : "Pending"}
                  </Badge>
                </p>
                {selectedVenue.amenities && selectedVenue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedVenue.amenities.map((a, i) => (
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
        <DialogContent className="max-w-2xl">
          {editVenue && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Venue – {editVenue.name}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={editForm.state}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, state: e.target.value }))
                    }
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 min-h-[90px]"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </div>

                {/* Amenities */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Amenities</label>
                  <div className="flex flex-wrap gap-3">
                    {AMENITIES.map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editForm.amenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleEditPhotoUpload(file);
                    }}
                  />
                  {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {editForm.photos.map((p, i) => (
                      <div key={i} className="relative w-20 h-20 rounded overflow-hidden">
                        <Image src={p} alt={`photo-${i}`} fill className="object-cover" />
                        <button
                          type="button"
                          className="absolute right-1 top-1 rounded bg-black/60 px-1 text-xs text-white"
                          onClick={() =>
                            setEditForm((f) => ({
                              ...f,
                              photos: f.photos.filter((_, idx) => idx !== i),
                            }))
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditVenue(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
