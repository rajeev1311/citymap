import React from "react";
import Link from "next/link";
import { Compass, Heart, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B0F17] transition-colors pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F3A6C8] flex items-center justify-center text-slate-900 font-black text-base shadow-pink">
                M
              </div>
              <span className="text-xl font-bold font-serif-hero text-slate-900 dark:text-white">
                MUSKAN
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Your City • Your Vibe. Discover premier landmarks, authentic dining, top educational institutions, rejuvenating salons, and blockbuster cinema halls across vibrant Indian destinations.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              <span>Crafted for Jaipur and beyond</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/tourist-places" className="hover:text-pink-600 transition-colors">Tourist Places</Link></li>
              <li><Link href="/businesses" className="hover:text-pink-600 transition-colors">Cafes & Restaurants</Link></li>
              <li><Link href="/colleges" className="hover:text-pink-600 transition-colors">Colleges & Universities</Link></li>
              <li><Link href="/salons" className="hover:text-pink-600 transition-colors">Salons & Spas</Link></li>
              <li><Link href="/cinemas" className="hover:text-pink-600 transition-colors">Cinema Halls</Link></li>
            </ul>
          </div>

          {/* Featured Cities */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Destinations
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/cities" className="hover:text-pink-600 transition-colors">Jaipur (Pink City)</Link></li>
              <li><Link href="/cities" className="hover:text-pink-600 transition-colors">Delhi NCR</Link></li>
              <li><Link href="/cities" className="hover:text-pink-600 transition-colors">Mumbai</Link></li>
              <li><Link href="/cities" className="hover:text-pink-600 transition-colors">Bengaluru</Link></li>
              <li><Link href="/cities" className="hover:text-pink-600 transition-colors">Udaipur (City of Lakes)</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/saved" className="hover:text-pink-600 transition-colors">Saved Places</Link></li>
              <li><Link href="/profile" className="hover:text-pink-600 transition-colors">User Profile</Link></li>
              <li><Link href="/settings" className="hover:text-pink-600 transition-colors">Preferences & Theme</Link></li>
              <li><Link href="/login" className="hover:text-pink-600 transition-colors">Member Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} MUSKAN. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for discovering India&apos;s best cities.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
