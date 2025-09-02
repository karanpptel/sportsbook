// src/lib/validations/auth.ts

import {z} from "zod";

export const signInSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type SignInInput = z.infer<typeof signInSchema>;


export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be less than 32 characters"),
  role: z.enum(["USER", "OWNER"], {
    error: "Please select a role",
  }),
  emailVerified: z.boolean(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;