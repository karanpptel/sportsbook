"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { z } from "zod";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success("If that email exists, a reset link has been sent.");
    } catch {
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual */}
      <div className="hidden md:flex items-center justify-center bg-muted/40">
        <Image
          src="/login-img.jpg"
          alt="Forgot Password"
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
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
