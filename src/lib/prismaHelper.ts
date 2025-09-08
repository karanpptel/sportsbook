// File: src/lib/prismaHelpers.ts
import { prisma } from "@/lib/prisma";

/**
 * Recalculate min & max price per hour for a venue based on its courts
 * and update the Venue record.
 */
export async function recalcVenuePriceRange(venueId: number) {
  const courts = await prisma.court.findMany({
    where: { venueId },
    select: { pricePerHour: true },
  });

  if (!courts.length) {
    // No courts → reset to null
    await prisma.venue.update({
      where: { id: venueId },
      data: {
        minPricePerHour: null,
        maxPricePerHour: null,
      },
    });
    return;
  }

  const prices = courts.map((c) => c.pricePerHour);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  await prisma.venue.update({
    where: { id: venueId },
    data: {
      minPricePerHour: minPrice,
      maxPricePerHour: maxPrice,
    },
  });
}
