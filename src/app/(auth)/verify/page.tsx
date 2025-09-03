// src/(auth)/verify/page.tsx

"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
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

import { VerifyOtpSchema, verifyOtpSchema } from "@/lib/validations/auth";

export function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(10); //second until next otp can be sent

  const form = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (emailFromQuery) form.setValue("email", emailFromQuery);
  }, [emailFromQuery, form]);

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
      if (res.ok && resData.success) {
        toast.success("OTP verified successfully.");
        router.push("/login");
      } else {
        toast.error(resData.error || "Invalid OTP, please try again.");
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
        toast.error("Please enter your email or Missing email to resend OTP");
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
      toast.success("OTP resent. Check inbox/spam.");
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setCooldown(0); // let user try again if server failed
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* left */}
      <div className="hidden md:flex items-center justify-center bg-muted/40">
        <Image
          src="/background.png"
          alt="Background"
          width={480}
          height={480}
          className="h-auto w-[420px] rounded-xl shadow-sm"
          priority
        />
      </div>

      {/* right */}
      <div className="flex items-center justify-center p-6 ">
        <div className="w-full max-w-md rounded-2xl border bg-background/95 p-6 shadow-sm backdrop-blur">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the 6-digit code sent to the email below.
            </p>
          </div>
          

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* email read only */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                      </FormLabel>
                      
                        <Input
                          type="email"
                          placeholder="Email"
                          readOnly
                          {...field}
                          className="bg-muted-50 font-medium"
                        />
                      <FormDescription className="mt-1">
                          Can’t access this email? Return to sign up to change it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  

                  {/* otp: continuee from here............ */}
                  
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
