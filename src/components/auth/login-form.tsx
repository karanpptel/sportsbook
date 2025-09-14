"use client"

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
import { signInSchema, SignInInput } from "@/lib/validations/auth";


export function LoginForm() {
    const router = useRouter();
    

    const form = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

        const {
            control,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = form;
    const onSubmit: SubmitHandler<SignInInput> = async (data) => {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });
            if (res?.error) throw new Error(res.error);
            if (!res?.ok) throw new Error("Login failed for unknown reasons please try again");
            toast.success("Login successful!");

            // Fetch the session AFTER successful login to get role
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            const role = sessionData?.user?.role;

            // Redirect based on role
            if (role === "OWNER") router.push("/owner");
            else if (role === "USER") router.push("/player");
            else if (role === "ADMIN") router.push("/admin");
            else router.push("/");
            
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed for unknown reasons please try again");
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Login"}
                </Button>
                <p className="text-center text-sm mt-2">
                    Dont have an account?{" "}
                    <a href="/signup" className="text-green-600 hover:underline cursor-pointer">
                        Sign up
                    </a>
                </p>


                {/*forgot password */}
                <p className="text-center text-sm mt-2">
                    <a href="/forgot-password" className="text-green-600 hover:underline cursor-pointer">
                        Forgot password?
                    </a>
                </p>
            </form>
        </Form>
    )
}


