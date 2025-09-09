//  src/app/(dashboard)/owner/venues/[venueId]/courts/[courtId]/slots/page.tsx
"use client";

import { useParams } from "next/navigation";
import { SlotManager } from "@/components/owner/SlotManger";

export default function SlotsPage() {
  const params = useParams();
  const courtId = params.courtId as string;
  const venueId = params.venueId as string;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Slots</h1>
      <SlotManager courtId={courtId} venueId={venueId} />
    </div>
  );
}
