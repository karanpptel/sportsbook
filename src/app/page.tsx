"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Star,
  ShieldCheck,
  Timer,
  MapPin,
  Users,
  Trophy,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => carouselApi.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [carouselApi]);

  const heroSlides = [
    {
      src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1920&auto=format&fit=crop",
      alt: "Football field under lights",
    },
    {
      src: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=1920&auto=format&fit=crop",
      alt: "Basketball court",
    },
    {
      src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop",
      alt: "Tennis court",
    },
    {
      src: "https://images.unsplash.com/photo-1629245100728-4e9f710a5800?q=80&w=1632&auto=format&fit=crop",
      alt: "basketball court with sunset",
    },
    {
      src: "https://images.unsplash.com/photo-1745180266396-ec9b9a66e442?q=80&w=1401&auto=format&fit=crop",
      alt: "people playing cricket",
    },  
  ];

  const demoReviews = [
    {
      name: "Alice Johnson",
      rating: 5,
      comment: "Amazing platform! Easy to book and reliable.",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    },
    {
      name: "Michael Smith",
      rating: 4,
      comment: "Great UI and fast bookings. Loved it!",
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=256&auto=format&fit=crop",
    },
    {
      name: "Emma Watson",
      rating: 5,
      comment:
        "Highly recommend SportifyHub for players and owners.",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero with background image slider */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background slider */}
        <div className="absolute inset-0">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="h-full">
            <CarouselContent className="h-full">
              {heroSlides.map((slide, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div className="relative h-[85vh]">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Light shadow overlay for readability */}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
          </Carousel>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 w-full ">
          <div className="max-w-7xl mx-auto px-6 py-16 text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              Book Top Sports Venues
              <span className="text-blue-300"> Effortlessly</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">
              Discover, compare, and book courts instantly. Admin-verified venues,
              real-time updates, and a seamless experience for players and owners.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/signup">
                <Button size="lg" className="shadow-lg">Get Started</Button>
              </Link>
              <Link href="/venues">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Explore Venues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">10k+</p>
            <p className="text-gray-600">Bookings Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">1.2k+</p>
            <p className="text-gray-600">Admin-Verified Venues</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">4.8/5</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">24/7</p>
            <p className="text-gray-600">Real-time Updates</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-600">SportifyHub</span>?
        </h2>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Timer className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Instant Booking</h3>
              </div>
              <p className="text-gray-600">Find available slots and book in seconds with a streamlined flow.</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Verified Venues</h3>
              </div>
              <p className="text-gray-600">Play at trusted, admin-approved venues with quality facilities.</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Smart Discovery</h3>
              </div>
              <p className="text-gray-600">Search by location, sport, and amenities to find the perfect fit.</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">For Players & Owners</h3>
              </div>
              <p className="text-gray-600">Tools for both sides—manage schedules, bookings, and more.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">1</span>
                  <h3 className="font-semibold">Explore Venues</h3>
                </div>
                <p className="text-gray-600">Browse top-rated venues near you with rich details and photos.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">2</span>
                  <h3 className="font-semibold">Select a Slot</h3>
                </div>
                <p className="text-gray-600">Choose available time slots that match your schedule.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">3</span>
                  <h3 className="font-semibold">Book & Play</h3>
                </div>
                <p className="text-gray-600">Confirm your booking and show up—leave the rest to us.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {demoReviews.map((review, idx) => (
            <Card key={idx} className="shadow-sm hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{review.name}</p>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"{review.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-gray-600 to-gray-800 p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to book your next game?</h3>
              <p className="text-white/90 mt-1">Join SportifyHub and start discovering top venues today.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">Get Started</Button>
              </Link>
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
