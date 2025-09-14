"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Karan Patel",
      role: "Full Stack Developer & Creator",
      image: "/profile.jpg",
      linkedin: "https://www.linkedin.com/in/karan-patel-5bb3b2206/",
      github: "https://github.com/karanpptel",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1509223197845-458d87318791?q=80&w=1920&auto=format&fit=crop"
          alt="About SportifyHub"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold">About SportifyHub</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            We make discovering and booking sports venues effortless for players and venue owners.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Trust & Quality</h3>
              </div>
              <p className="text-gray-600">Admin-verified venues with high standards so you can focus on the game.</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Community First</h3>
              </div>
              <p className="text-gray-600">Connecting players and owners to build a vibrant sports ecosystem.</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Seamless Experience</h3>
              </div>
              <p className="text-gray-600">Streamlined booking, notifications, and management tools for everyone.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="shadow-sm hover:shadow-md transition max-w-sm w-full">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <Avatar className="w-28 h-28 mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(" ")[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl">{member.name}</h3>
                  <p className="text-gray-600 mb-4">{member.role}</p>
                  <div className="flex gap-3">
                    <Link href={member.linkedin} target="_blank">
                      <Button variant="outline" size="sm">LinkedIn</Button>
                    </Link>
                    <Link href={member.github} target="_blank">
                      <Button variant="outline" size="sm">GitHub</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 mt-1" />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">Join the SportifyHub community</h3>
                <p className="text-white/90 mt-1">Book verified venues and elevate your sports journey.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">Get Started</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
