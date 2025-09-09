// src/components/owner/CourtList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

export function CourtList({
  venueId,
  courts = [],
  refresh,
}: {
  venueId: string;
  courts?: any[];
  refresh: () => void;
}) {
  const router = useRouter();
  const [editingCourt, setEditingCourt] = useState<any | null>(null);
  
  const handleBack = () => {
    router.back();
  };
  const [deletingCourt, setDeletingCourt] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  // Normalize incoming courts to a safe array
  const list: any[] = Array.isArray(courts)
    ? courts
    : (courts && Array.isArray((courts as any).courts)
        ? (courts as any).courts
        : []);

  async function updateCourt() {
    if (!editingCourt) return;

    // Basic validation
    if (
      !editingCourt.name.trim() ||
      !editingCourt.sport.trim() ||
      editingCourt.pricePerHour <= 0
    ) {
      toast.error("Please fill all fields with valid values.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/owner/venues/${venueId}/courts/${editingCourt.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingCourt.name,
            sport: editingCourt.sport,
            pricePerHour: editingCourt.pricePerHour,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update court");

      toast.success("Court updated successfully.");
      setEditingCourt(null);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update court");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCourt(id: string) {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/owner/venues/${venueId}/courts/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete court");

      toast.success("Court removed successfully.");
      setDeletingCourt(null);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete court");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="mb-4"
        >
          ← Back
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Price (₹/hr)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No courts found.
              </TableCell>
            </TableRow>
          )}
          {list.map((court) => (
            <TableRow key={court.id}>
              <TableCell>{court.name}</TableCell>
              <TableCell>{court.sport}</TableCell>
              <TableCell>{inr.format(court.pricePerHour)}</TableCell>
              <TableCell className="flex gap-2">
                {/* Manage Slots */}
                <Link href={`/owner/venues/${venueId}/courts/${court.id}/slots`}>
                  <Button variant="secondary">Manage Slots</Button>
                </Link>

                {/* Edit Court */}
                <Dialog
                  open={editingCourt?.id === court.id}
                  onOpenChange={(o) => !o && setEditingCourt(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditingCourt(court)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Edit Court</DialogTitle>
                    </DialogHeader>
                    {editingCourt && (
                      <>
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={editingCourt.name}
                            onChange={(e) =>
                              setEditingCourt({
                                ...editingCourt,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Sport</Label>
                          <Input
                            value={editingCourt.sport}
                            onChange={(e) =>
                              setEditingCourt({
                                ...editingCourt,
                                sport: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Price (₹/hr)</Label>
                          <Input
                            type="number"
                            min={0}
                            step={50}
                            disabled={loading}
                            value={editingCourt.pricePerHour}
                            onChange={(e) =>
                              setEditingCourt({
                                ...editingCourt,
                                pricePerHour: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingCourt(null)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button onClick={updateCourt} disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Delete Court */}
                <Dialog
                  open={deletingCourt?.id === court.id}
                  onOpenChange={(o) => !o && setDeletingCourt(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setDeletingCourt(court)}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Delete Court</DialogTitle>
                    </DialogHeader>
                    <p>
                      Are you sure you want to delete court{" "}
                      <b>{deletingCourt?.name}</b>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="outline"
                        onClick={() => setDeletingCourt(null)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteCourt(deletingCourt!.id)}
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Confirm Delete"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
