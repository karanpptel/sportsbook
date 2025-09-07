"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Linkedin, Star, Github } from "lucide-react";

export default function HomePage() {
  const demoReviews = [
    { name: "Alice Johnson", rating: 5, comment: "Amazing platform! Easy to book and reliable." },
    { name: "Michael Smith", rating: 4, comment: "Great UI and fast bookings. Loved it!" },
    { name: "Emma Watson", rating: 5, comment: "Highly recommend SportifyHub for players and owners." },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Book Sports Venues <span className="text-blue-600">Effortlessly</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Find and book your favorite courts, manage your games, and connect with venues instantly — all in one platform.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/venues">
            <Button variant="outline" size="lg">
              Explore Venues
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-600">SportifyHub</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-2">Easy Booking</h3>
              <p className="text-gray-600">Quickly find available slots and book your favorite courts in just a few clicks.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-2">Verified Venues</h3>
              <p className="text-gray-600">Play at trusted, admin-approved venues with quality facilities.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Stay informed with instant notifications for booking updates.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 leading-relaxed">
            SportifyHub is your go-to platform for hassle-free sports venue booking. 
            Whether you’re a player or a venue owner, we provide tools to simplify bookings, manage schedules, and create the best sports experiences.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make sports accessible and fun for everyone. We focus on trust, quality, and instant updates.
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {demoReviews.map((review, idx) => (
            <Card key={idx} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-2">"{review.comment}"</p>
                <p className="font-semibold text-gray-800">- {review.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Developer Team Section */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Meet the Developer</h2>
        <div className="flex flex-col items-center gap-6">
          <Card className="shadow-lg max-w-sm w-full">
            <CardContent className="flex flex-col items-center text-center p-6">
              <img
                src="/profile.jpg"
                alt="Main Developer"
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="font-bold text-xl mb-1">Karan Patel</h3>
              <p className="text-gray-600 mb-2">Full Stack Developer & Creator of SportifyHub</p>
              <div className="flex gap-4 mt-2">
                <Link href="https://www.linkedin.com/in/karan-patel-5bb3b2206/" target="_blank">
                  <Linkedin className="w-5 h-5 text-blue-700 hover:scale-110 transition" />
                </Link>
                <Link href="https://github.com/karanpptel" target="_blank">
                  <Github className="w-5 h-5 text-sky-500 hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-blue-600">SportifyHub</h3>
            <p className="text-gray-600 mt-2 text-sm">Book your courts, connect with venues, and play more.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
              <li><Link href="/venues" className="hover:text-blue-600">Venues</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="https://facebook.com" target="_blank">
                <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600" />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-500" />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <Twitter className="w-5 h-5 text-gray-600 hover:text-sky-500" />
              </Link>
              <Link href="https://linkedin.com" target="_blank">
                <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-700" />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <p className="text-center text-gray-500 text-sm pb-6">
          © {new Date().getFullYear()} SportifyHub. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
