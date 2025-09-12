// src/components/public/VenueImageSlider.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const images = [
  "https://plus.unsplash.com/premium_photo-1744468902575-2b78275fc79b?q=80&w=1644&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1745950166769-aae6afdf3243?q=80&w=1633&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1630262038272-e1ecefd3415a?q=80&w=1470&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1684713510655-e6e31536168d?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564687978103-511228eb1816?q=80&w=1476&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1684241183936-6362e5c51ebf?q=80&w=1470&auto=format&fit=crop",
];

export default function VenueImageSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full">
      {/* Slider */}
      <div className="overflow-hidden rounded-2xl shadow-md" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div className="flex-[0_0_100%] relative" key={i}>
              <img
                src={src}
                alt={`Slide ${i}`}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition",
              selectedIndex === i ? "bg-blue-600" : "bg-gray-300"
            )}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
