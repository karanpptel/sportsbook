//  src/app/(dashboard)/owner/venues/[venueId]/courts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourtList } from "@/components/owner/CourtList";
import { CourtForm } from "@/components/owner/CourtForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog";

export default function CourtsPage() {
  const { venueId } = useParams();
  const [courts, setCourts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchCourts() {
  setLoading(true);
  try {
    const res = await fetch(`/api/dashboard/owner/venues/${venueId}/courts`);
    const data = await res.json();
    setCourts(data?.courts ?? []);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    fetchCourts();
  }, [venueId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courts Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Court</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Court</DialogTitle>
            </DialogHeader>

            {/** Add Court Form */}
            <CourtForm 
              venueId={venueId as string} 
              onSuccess={() => { setOpen(false); fetchCourts(); }} 
            />
          </DialogContent>
        </Dialog>
      </div>
      {/** Courts Table List */}
      {loading ? (
        <p className="text-muted-foreground">Loading courts...</p>
      ) : (
        <CourtList venueId={venueId as string} courts={courts} refresh={fetchCourts} />
      )}
    </div>
  );
}
