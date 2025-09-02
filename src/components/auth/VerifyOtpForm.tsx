"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import {z} from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


// Zod schema for OTP
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

type OtpInput = z.infer<typeof otpSchema>;

export function VerifyOtpForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";



    const form = useForm<OtpInput>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        }
    });

     const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
      } = form;


    const onSubmit: SubmitHandler<OtpInput> =  async (data)  => {
        try {
            setLoading(true);
            const payload = { email, otp: data.otp };

            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify(payload),
            })

            const resData = await res.json();
            if(res.ok && resData.success) {
                toast.success("OTP verified successfully.");
                router.push("/login");
            }else {
                toast.error(resData.error || "Invalid OTP, please try again.");
            }
        }  catch (error) {
                console.error(error);
                toast.error("Something went wrong. Try again.");
            } finally {
                setLoading(false);
            }
    }



    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}  className="max-w-sm mx-auto space-y-4 mt-10">
                <h2 className="text-xl font-semibold text-center">
                    Verify your OTP
                </h2>
                <FormField
                    control={control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter OTP</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="6-digit OTP"
                                    {...field}
                                    maxLength={6}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
             

                {   errors.otp && (
                    <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                {/* this is optional becuase currently not use resend tool*/}
                <p className="text-center text-sm mt-2">
                    Didn't receive OTP?{" "}
                    <a  href={`/auth/resend-otp?email=${encodeURIComponent(email)}`} className="text-green-600 hover:underline">
                        Resend OTP
                    </a>
                </p>
            </form>
        </Form>
    )
}