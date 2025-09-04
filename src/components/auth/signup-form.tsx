"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInput, signUpSchema } from "@/lib/validations/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react"; 
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export  function SignUpForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    

    const form = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "USER",
        }
    })

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = form;

      // Handle avatar upload
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
    
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
    
        const res = await fetch("/api/upload/avatar", {
          method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setAvatar(url);
      toast.success("Avatar uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };



    const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
       try {
            setLoading(true)
            //const payload = {...data, image: avatar};

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success("User created successfully");
                router.push(`/verify?email=${encodeURIComponent(data.email)}`);
            } else {
                const errorData = await res.json(); // Get the error message from the server
                if (res.status === 400 && errorData.error === "User already exists.") {
                    toast.error("Email already registered.");
                } else if (res.status === 400 && errorData.error && Array.isArray(errorData.error)) {
                    // Zod validation errors, if you want to display specific messages
                    const firstError = errorData.error[0];
                    toast.error(`Validation failed: ${firstError.message}`);
                }
                else {
                    toast.error(errorData.error || "Signup failed. Please try again.");
                }
            }
       } catch (error) {
        console.error("Signup error:", error);
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("Something went wrong. Try again.");
        }
        } finally {
            setLoading(false);
        }
    };


    return(
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                        <Image
                            src={avatar || "/avatar-img.jpg"}
                            alt="avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <label className="cursor-pointer text-sm flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? "Uploading..." : "Upload Avatar"}</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onAvatarChange}
                            disabled={uploading}
                        />
                    </label>
                </div>

                    {/* Full Name */}
                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {   errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}

                    {/* Email */}
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  

                    {   errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}

                    {/* Password */}
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {   errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    {/* Role */}
                    <FormField
                    control={control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    
                                    <SelectItem value="USER">Player</SelectItem>
                                    <SelectItem value="OWNER">Facility Owner</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                    {   errors.role && (
                        <p className="text-red-500 text-sm">{errors.role.message}</p>
                    )}

                        {/* Submit */}
                    <Button type="submit" className="w-full" disabled={isSubmitting || uploading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>

                    {/* Login Link */}
                    <p className="text-center text-sm mt-2">
                        Already have an account?{" "}
                        <a href="/login" className="text-green-600 hover:underline cursor-pointer">
                            Login
                        </a>
                    </p>

            </form>
        </Form>
    )


}