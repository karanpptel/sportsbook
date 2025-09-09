// src/components/owner/CourtForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";


export function CourtForm({
  venueId,
  onSuccess,
}: {
  venueId: string;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [pricePerHour, setPricePerHour] = useState(500);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert "HH:mm" string to integer hour
      const openHour = openTime ? parseInt(openTime.split(":")[0], 10) : undefined;
      const closeHour = closeTime ? parseInt(closeTime.split(":")[0], 10) : undefined;

      const res = await fetch(`/api/dashboard/owner/venues/${venueId}/courts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sport,
          pricePerHour,
          openTime: openHour,
          closeTime: closeHour,
        }),
      });

      if (!res.ok) throw new Error("Failed to create court");

      toast.success("The court was created successfully.");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Could not create court");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Court Name</Label>
            <Input
              placeholder="e.g., Court A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Sport Type</Label>
            <Input
              placeholder="e.g., Badminton"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Price / Hour (₹)</Label>
            <Input
              type="number"
              min={0}
              step={50}
              value={pricePerHour}
              onChange={(e) => setPricePerHour(Number(e.target.value))}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Open Time</Label>
            <Input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Close Time</Label>
            <Input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
