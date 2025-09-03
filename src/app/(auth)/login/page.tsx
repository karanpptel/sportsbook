// src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual */}
      <div className="hidden md:flex items-center justify-center bg-muted">
        <Image
          src="/login-img.jpg"
          alt="Login"
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
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Login to continue booking and managing facilities.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
