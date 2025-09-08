"use client";

import { useParams } from "next/navigation";
import { SlotManager } from "@/components/owner/SlotManger";

export default function SlotsPage() {
  const { courtId } = useParams();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Slots</h1>
      <SlotManager courtId={courtId as string} />
    </div>
  );
}
