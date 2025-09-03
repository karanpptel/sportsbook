"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validations/auth";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid password reset link");
      router.replace("/forgot-password");
    }
  }, [token, email, router]);

  const {
    control,
    handleSubmit,
    formState: {  isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          newPassword: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to reset password");
        return;
      }

      toast.success("Password reset successful! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Server error while resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:flex w-1/2 relative shadow-lg">
          <Image
            src="/background.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />    
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white p-10 rounded-r-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">
                  Reset Password
              </h2>
              <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      
                      <FormField
                          control={control}
                          name="password"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                      <Input 
                                          type="password"
                                          placeholder="Enter new Password" 
                                          {...field}
                                          className="border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                                          />
                                  </FormControl>
                                  <FormMessage className="text-red-600" />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={control}
                          name="confirmPassword"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="font-semibold text-gray-700">Confirm Password</FormLabel>
                                  <FormControl>
                                      <Input 
                                          type="password"
                                          placeholder="Confirm Password" 
                                          {...field}
                                          className="border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                                          />
                                  </FormControl>
                                  <FormMessage className="text-red-600" />
                              </FormItem>
                          )}
                      />

                      <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Reseting..." : "Reset Password"}
                      </Button>
                  </form>
              </Form>
          </div>
      </div>
    </div>
  )
}
