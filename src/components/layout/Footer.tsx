import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Newsletter callout */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Stay in the loop</h3>
            <p className="text-white/90 md:text-white/80 mt-1">
              Get updates on new venues, exclusive offers, and playing tips.
            </p>
          </div>
          <form className="w-full md:w-auto flex gap-3" action="#" method="post">
            <div className="relative flex-1 md:w-96">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/80" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white"
                required
              />
            </div>
            <Button type="submit" className="bg-white text-blue-700 hover:bg-white/90">
              Subscribe
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center text-xl font-bold">
              {/* Use img for consistency with Navbar */}
              <img src="/logo.png" alt="SportifyHub" className="h-8 w-8 mr-2 rounded-full" />
              Sportify<span className="text-blue-600">Hub</span>
            </Link>
            <p className="text-gray-600 mt-3 max-w-sm">
              Book your courts, connect with venues, and play more. A seamless way to discover and
              manage your sports experiences.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="p-2 rounded-md border hover:bg-gray-50 transition">
                <Facebook className="w-4 h-4 text-gray-700" />
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="p-2 rounded-md border hover:bg-gray-50 transition">
                <Instagram className="w-4 h-4 text-gray-700" />
              </Link>
              <Link href="https://twitter.com" target="_blank" aria-label="Twitter" className="p-2 rounded-md border hover:bg-gray-50 transition">
                <Twitter className="w-4 h-4 text-gray-700" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="p-2 rounded-md border hover:bg-gray-50 transition">
                <Linkedin className="w-4 h-4 text-gray-700" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/venues" className="hover:text-blue-600">Venues</Link></li>
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">For Users</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/signup" className="hover:text-blue-600">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-blue-600">Sign In</Link></li>
              <li><Link href="/player" className="hover:text-blue-600">Player Dashboard</Link></li>
              <li><Link href="/owner" className="hover:text-blue-600">Owner Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                <span>123 Sports Street, Playtown, Earth</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-gray-500" />
                <a href="tel:+1234567890" className="hover:text-blue-600">+1 (234) 567-890</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-gray-500" />
                <a href="mailto:support@sportifyhub.app" className="hover:text-blue-600">support@sportifyhub.app</a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {year} SportifyHub. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
