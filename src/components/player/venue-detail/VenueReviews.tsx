// src/components/player/venue-detail/VenueReviews.tsx
"use client";
import React from "react";

export default function VenueReviews({ reviews, rating }: { reviews: any[]; rating: number }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <div className="text-sm text-slate-600">Avg: {rating}</div>
      </div>

      <div className="mt-4 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border rounded-lg p-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{r.user}</div>
              <div className="text-sm text-amber-500">{Array.from({length: r.rating}).map((_,i)=> "★").join("")}</div>
            </div>
            <div className="text-sm text-slate-600 mt-2">{r.comment}</div>
          </div>
        ))}
        {reviews.length === 0 && <div className="text-sm text-slate-500">No reviews yet.</div>}
      </div>
    </div>
  );
}
