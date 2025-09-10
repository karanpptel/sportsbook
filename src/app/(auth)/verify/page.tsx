// src/app/(auth)/verify/page.tsx

"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";

import { VerifyOtpSchema, verifyOtpSchema } from "@/lib/validations/auth";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";



  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds until next OTP can be resent

  const form = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
  });

  useEffect(() => {
    if (emailFromQuery) form.setValue("email", emailFromQuery);
  }, [emailFromQuery, form]);

  // countdown for resend OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const onSubmit: SubmitHandler<VerifyOtpSchema> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success("✅ OTP verified successfully");
        router.push("/login");
      } else {
        toast.error(resData.error || "❌ Invalid OTP, please try again.");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  async function resendOtp() {
    try {
      if (!form.getValues("email")) {
        toast.error("Missing email to resend OTP");
        return;
      }
      setCooldown(60);
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.getValues("email") }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to resend OTP");
      }
      toast.success("📩 OTP resent. Check your inbox/spam.");
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setCooldown(0);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-background to-muted/30">
      {/* Left Visual */}
      <div className="hidden md:flex items-center justify-center bg-muted/50 p-10">
        <Image
          src="/otp-page.jpg"
          alt="Verify OTP"
          width={600}
          height={600}
          className="h-auto w-[600px] rounded-2xl shadow-xl"
          priority
        />
      </div>

      {/* Right Content */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border bg-background/95 p-8 shadow-lg backdrop-blur">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Verify Your Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the 6-digit code sent to your email below.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email (read-only) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      readOnly
                      {...field}
                      className="bg-muted/30 font-medium cursor-not-allowed"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OTP Input */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        pattern="\d*"
                        containerClassName="justify-center gap-2"
                      >
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPGroup key={i}>
                            <InputOTPSlot
                              index={i}
                              className="h-12 w-12 text-lg border rounded-xl shadow-sm"
                            />
                          </InputOTPGroup>
                        ))}
                      </InputOTP>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resend OTP */}
              <p className="text-xs text-muted-foreground text-center">
                Didn’t get the code?{" "}
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={cooldown > 0}
                  className="underline underline-offset-4 text-primary hover:text-primary/80 disabled:opacity-50"
                >
                  Resend {cooldown > 0 ? `in ${cooldown}s` : ""}
                </button>
              </p>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>

              {/* Terms */}
              <p className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}


export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 py-8">
          Loading...
        </div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}