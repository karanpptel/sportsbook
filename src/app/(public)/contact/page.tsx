// src/app/contact/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import Link from "next/link";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form Submitted:", data);
    toast.success("Message sent successfully!");
    form.reset();
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=1920&auto=format&fit=crop"
          alt="Contact SportifyHub"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-white/90">
            Have questions? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Type your message..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Map & Info */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-2xl font-bold mb-4">Find Us</h2>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.067180007413!2d72.57136207496317!3d22.61255427947295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f22a7f52fb%3A0xd46b94a54c7b0a23!2sAhmedabad%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1696938123456!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-2">
              <h2 className="text-xl font-semibold">Get in Touch</h2>
              <p>Email: support@sportifyhub.com</p>
              <p>Phone: +91 9925831646</p>
              <p>Location: Ahmedabad, Gujarat, India</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Prefer to talk?</h3>
              <p className="text-white/90 mt-1">Schedule a quick call and we’ll walk you through.</p>
            </div>
            <div className="flex gap-3">
              <a href="mailto:support@sportifyhub.com">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">Email Us</Button>
              </a>
              <Link href="/venues">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Browse Venues</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
