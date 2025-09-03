// src/app/(auth)/signup/page.tsx
"use client";

import Image from "next/image";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual */}
      <div className="hidden md:flex items-center justify-center bg-muted/40">
        <Image
          src="/login-img.jpg"
          alt="Sign Up"
          width={600}
          height={600}
          className="h-auto w-[600px] rounded-xl shadow-sm"
          priority
        />
      </div>

      {/* Right content */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border bg-background/95 p-6 shadow-sm backdrop-blur">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign up to start booking and managing sports facilities.
            </p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
