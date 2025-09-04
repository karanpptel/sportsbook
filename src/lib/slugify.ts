// lib/slugify.ts
import { prisma } from "@/lib/prisma";

function basicSlugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // spaces → -
    .replace(/[^\w\-]+/g, "") // remove non-word chars
    .replace(/\-\-+/g, "-");  // collapse multiple -
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = basicSlugify(name);
  let slug = baseSlug;
  let count = 1;

  // Keep checking until we find a unique slug
  while (true) {
    const existing = await prisma.venue.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) break; // ✅ slug is unique

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
