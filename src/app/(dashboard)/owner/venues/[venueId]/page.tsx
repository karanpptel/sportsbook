// src/app/(dashboard)/owner/venues/[venueId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CourtForm } from "@/components/owner/CourtForm";
import { CourtList } from "@/components/owner/CourtList";

export default function VenuePage({ params }: { params: { venueId: string } }) {
  const { venueId } = params;
  const [courts, setCourts] = useState<any[]>([]);
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);

  async function fetchCourts() {
    const res = await fetch(`/api/dashboard/owner/venues/${venueId}/courts`);
    const data = await res.json();
    setCourts(data.courts ?? []);
  }

  useEffect(() => {
    fetchCourts();
  }, [venueId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Courts for Venue {venueId}</h1>

       {/** Add Court Form */}
            <CourtForm 
              venueId={venueId as string} 
              onSuccess={() => { setOpen(false); fetchCourts(); }} 
            />

      {/* List Courts */}
      <CourtList venueId={venueId} courts={courts} refresh={fetchCourts} />
    </div>
  );
}
