import { z } from "zod";

export const venueSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  description: z.string().max(500).optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(), // array of URLs from Cloudinary
});

export type VenueFormValues = z.infer<typeof venueSchema>;
