"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    // Add more team members if needed
  ];

  return (
    <main className="flex flex-col min-h-screen px-6 md:px-16 py-12 bg-gray-50">
      {/* About Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600 animate-fade-in">
          About SportifyHub
        </h1>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-4 animate-fade-up">
          SportifyHub is your all-in-one platform for hassle-free sports venue booking. Whether you’re a player or a venue owner, our tools help you simplify bookings, manage schedules, and create the best sports experiences.
        </p>
        <p className="text-gray-600 text-lg md:text-lg leading-relaxed animate-fade-up delay-150">
          Our mission is to make sports accessible, trusted, and fun for everyone. We focus on quality, verified venues, and real-time updates for an unmatched user experience.
        </p>
      </section>

      <Separator className="my-12" />

      {/* Values Section */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        {[
          { title: "Trust & Quality", desc: "Play at admin-verified venues with the best facilities and standards." },
          { title: "Easy Management", desc: "Manage your bookings, schedules, and notifications with minimal effort." },
          { title: "Community Driven", desc: "Connect with players and venue owners to foster a vibrant sports community." }
        ].map((value, idx) => (
          <Card
            key={idx}
            className="shadow-md hover:shadow-xl transition transform hover:-translate-y-2 duration-300"
          >
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Meet the Team</h2>
        <div className="grid md:grid-cols-3 gap-8 justify-items-center">
          {teamMembers.map((member, idx) => (
            <Card
              key={idx}
              className="shadow-md hover:shadow-xl transition transform hover:scale-105 duration-300 max-w-sm w-full"
            >
              <CardContent className="flex flex-col items-center text-center p-6">
                <Avatar className="w-32 h-32 mb-4 animate-bounce hover:animate-none hover:scale-110 rounded-full object-cover transition">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.name.split(" ")[0]}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex gap-4">
                  <Link href={member.linkedin} target="_blank">
                    <Button variant="outline" size="sm" className="hover:bg-blue-50">LinkedIn</Button>
                  </Link>
                  <Link href={member.github} target="_blank">
                    <Button variant="outline" size="sm" className="hover:bg-gray-100">GitHub</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="text-center mb-16 animate-fade-up">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-700 mb-6">
          Join SportifyHub today and simplify your sports booking experience!
        </p>
        <Link href="/signup">
          <Button size="lg" className="hover:scale-105 transition-transform duration-300">
            Sign Up Now
          </Button>
        </Link>
      </section>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        .animate-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s ease forwards;
        }
        .animate-fade-up.delay-150 {
          animation-delay: 0.15s;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
