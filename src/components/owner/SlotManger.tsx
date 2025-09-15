// src/components/owner/SlotManger.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";

type SlotManagerProps = { courtId: string; venueId: string };

export function SlotManager({ courtId, venueId }: SlotManagerProps) {
  const router = useRouter();
  const [slots, setSlots] = useState<any[]>([]);

  const handleBack = () => {
    router.back();
  };

  // 
  // We initialize it to today's date in YYYY-MM-DD format
  const [generationDate, setGenerationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // 

  // Generator state
  const [start, setStart] = useState("07:00");
  const [end, setEnd] = useState("22:00");
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(500);
  const [generating, setGenerating] = useState(false);

  // Edit slot modal state
  const [editingSlot, setEditingSlot] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Loading slots
  const [loadingSlots, setLoadingSlots] = useState(false);

  const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  async function fetchSlots() {
    try {
      setLoadingSlots(true);
      // Add date as query parameter
      const queryDate = generationDate || new Date().toISOString().split('T')[0];
      const res = await fetch(
        `/api/dashboard/owner/venues/${venueId}/courts/${courtId}/slots?date=${queryDate}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched slots data for date:", queryDate, data); // Debug log
      
      // Sort slots by start time
      const sortedSlots = Array.isArray(data) ? 
        data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) 
        : [];
      
      setSlots(sortedSlots);
    } catch (e) {
      console.error("Error fetching slots:", e);
      toast.error("Failed to fetch slots");
      setSlots([]); // Ensure slots is reset on error
    } finally {
      setLoadingSlots(false);
    }
  }

  function validateGenerator() {
    if (!start || !end) return false;
    if (duration <= 0) return false;
    if (price < 0) return false;
    if (start >= end) return false;
    //  Also validate the new date field ---
    if (!generationDate) return false;
    
    return true;
  }

  async function generateSlots() {
    if (!validateGenerator()) {
      toast.error("Please provide a valid date, start/end time, duration and price.");
      return;
    }
    try {
      setGenerating(true);
      
      // --- Include the new date in the payload sent to the backend ---
      const payload = {
        date: generationDate,
        startTime: start,
        endTime: end,
        duration,
        price,
      };
      console.log("Generating slots with:", payload);

      const res = await fetch(
        `/api/dashboard/owner/venues/${venueId}/courts/${courtId}/slots`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Failed to generate slots: ${errorData.error || res.statusText}`
        );
      }

      toast.success("Time slots were generated successfully.");

      setTimeout(() => {
        fetchSlots();
      }, 100);
    } catch (err) {
      console.error("Error generating slots:", err);
      toast.error("Could not generate slots");
    } finally {
      setGenerating(false);
    }
  }
  // ... (deleteSlot and updateSlot functions remain the same) ...
  async function deleteSlot(id: string) {
    try {
      setDeletingId(id);
      const res = await fetch(
        `/api/dashboard/owner/venues/${venueId}/courts/${courtId}/slots/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete slot");

      toast.success("Slot removed successfully.");
      fetchSlots();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete slot");
    } finally {
      setDeletingId(null);
    }
  }

  async function updateSlot() {
    if (!editingSlot) return;
    try {
      setSavingEdit(true);
      const res = await fetch(
        `/api/dashboard/owner/venues/${venueId}/courts/${courtId}/slots/${editingSlot.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startTime: editingSlot.startTime,
            endTime: editingSlot.endTime,
            price: editingSlot.price,
            isBooked: editingSlot.isBooked,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update slot");

      toast.success("Slot updated successfully.");
      setEditingSlot(null);
      fetchSlots();
    } catch (err) {
      console.error(err);
      toast.error("Could not update slot");
    } finally {
      setSavingEdit(false);
    }
  }

  useEffect(() => {
    fetchSlots();
    
  }, [courtId, venueId]);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          ← Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {/* --- CHANGE 4: Add the new date input to the grid --- */}
          {/* Adjusted grid to handle 5 items gracefully */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={generationDate}
                onChange={(e) => setGenerationDate(e.target.value)}
                disabled={generating}
              />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                disabled={generating}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                disabled={generating}
              />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min={15}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={generating}
              />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                min={0}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={generating}
              />
            </div>
          </div>
          {/* --- END CHANGE 4 --- */}
          <div className="mt-4">
            <Button onClick={generateSlots} disabled={generating}>
              {generating ? "Generating..." : "Generate Slots"}
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={fetchSlots}
              disabled={loadingSlots}
            >
              {loadingSlots ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            {/* The rest of the table remains the same and will work correctly */}
            <TableHeader>
              <TableRow>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!slots || slots.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    {loadingSlots ? "Loading slots..." : "No slots found."}
                  </TableCell>
                </TableRow>
              )}
              {slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.startTime.substring(11, 16)}</TableCell>
                  <TableCell>{slot.endTime.substring(11, 16)}</TableCell>
                  <TableCell>{inr.format(slot.price)}</TableCell>
                  <TableCell>
                    {slot.isBooked ? (
                      <span className="text-red-600 font-medium">BOOKED</span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        AVAILABLE
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog
                      open={Boolean(editingSlot?.id === slot.id)}
                      onOpenChange={(o) => {
                        if (!o) {
                          setEditingSlot(null);
                          return;
                        }
                        setEditingSlot({
                          ...slot,
                          startTime: new Date(slot.startTime)
                            .toISOString()
                            .slice(0, 16),
                          endTime: new Date(slot.endTime)
                            .toISOString()
                            .slice(0, 16),
                        });
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="secondary">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Slot</DialogTitle>
                        </DialogHeader>
                        {editingSlot && (
                          <div className="space-y-4">
                            <div>
                              <Label>Start Time</Label>
                              <Input
                                type="datetime-local"
                                value={editingSlot.startTime}
                                onChange={(e) =>
                                  setEditingSlot({
                                    ...editingSlot,
                                    startTime: e.target.value,
                                  })
                                }
                                disabled={savingEdit}
                              />
                            </div>
                            <div>
                              <Label>End Time</Label>
                              <Input
                                type="datetime-local"
                                value={editingSlot.endTime}
                                onChange={(e) =>
                                  setEditingSlot({
                                    ...editingSlot,
                                    endTime: e.target.value,
                                  })
                                }
                                disabled={savingEdit}
                              />
                            </div>
                            <div>
                              <Label>Price (₹)</Label>
                              <Input
                                type="number"
                                value={editingSlot.price}
                                min={0}
                                step={50}
                                onChange={(e) =>
                                  setEditingSlot({
                                    ...editingSlot,
                                    price: Number(e.target.value),
                                  })
                                }
                                disabled={savingEdit}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={editingSlot.isBooked}
                                onCheckedChange={(checked: boolean) =>
                                  setEditingSlot({
                                    ...editingSlot,
                                    isBooked: checked,
                                  })
                                }
                                disabled={savingEdit}
                              />
                              <span>
                                {editingSlot.isBooked ? "BOOKED" : "AVAILABLE"}
                              </span>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingSlot(null)}
                                disabled={savingEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={updateSlot}
                                disabled={savingEdit}
                              >
                                {savingEdit ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      onClick={() => deleteSlot(slot.id)}
                      disabled={deletingId === slot.id}
                    >
                      {deletingId === slot.id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}