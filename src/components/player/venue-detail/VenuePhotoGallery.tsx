// src/components/player/venue-detail/VenuePhotoGallery.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function VenuePhotoGallery({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photos.slice(0, 4).map((p, i) => (
          <button
            key={p + i}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="relative h-32 sm:h-40 w-full rounded-lg overflow-hidden shadow-sm transform-gpu hover:scale-105 transition"
            aria-label={`Open photo ${i + 1}`}
          >
            <Image src={p} alt={`venue photo ${i + 1}`} fill style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-4xl p-0">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-20 bg-black/50 p-2 rounded-full"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="h-[60vh] relative">
              <Image
                src={photos[index]}
                alt={`photo ${index + 1}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className="flex items-center justify-center gap-3 p-3 bg-slate-900/60">
              {photos.map((p, i) => (
                <button
                  key={p + i}
                  onClick={() => setIndex(i)}
                  className={`w-20 h-12 rounded overflow-hidden ring-2 ${
                    index === i ? "ring-emerald-500" : "ring-transparent"
                  }`}
                >
                  <Image src={p} alt={`thumb ${i}`} fill style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
