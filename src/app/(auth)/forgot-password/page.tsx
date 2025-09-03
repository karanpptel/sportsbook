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

  const { control, handleSubmit, formState:{errors, isSubmitting}} = form;
  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json();
       if (!res.ok) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success("If that email exists in our system, a reset link has been sent.");
    } catch (error) {
      console.error("Error sending reset email", error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen">
        <div className="hidden lg:flex w-1/2 relative">
            <Image
                src="/background.png"
                alt="Background"
                fill
                className="object-cover"
            />
        </div>

        <div className="flex w-full lg:w-1/2 justify-center items-center p-6">
            <div className="max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Forgot Password
                </h1>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    </div>

  )
}