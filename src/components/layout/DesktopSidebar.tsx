"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MapPin,
  Store,
  GraduationCap,
  Sparkles,
  Clapperboard,
  Compass,
  User,
  Settings,
  ShieldCheck,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { currentCity } = useCity();

  const mainNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "City", href: "/cities", icon: MapPin },
    { name: "Business", href: "/businesses", icon: Store },
    { name: "Colleges", href: "/colleges", icon: GraduationCap },
    { name: "Saloon & Beauty Parlour", href: "/salons", icon: Sparkles },
    { name: "Cinema Halls", href: "/cinemas", icon: Clapperboard },
    { name: "Tourist Places", href: "/tourist-places", icon: Compass },
  ];

  const secondaryNavItems = [
    { name: "Saved Places", href: "/saved", icon: Bookmark },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (user?.role === "ADMIN") {
    secondaryNavItems.push({ name: "Admin Portal", href: "/admin", icon: ShieldCheck });
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 shrink-0 bg-[#101827] text-white border-r border-slate-800/80 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-5">
        <Link href="/" className="group block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F3A6C8] to-[#f9cbdc] flex items-center justify-center text-slate-950 font-black text-xl shadow-pink transition-transform duration-300 group-hover:scale-105">
              M
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight font-serif-hero text-white group-hover:text-[#F3A6C8] transition-colors">
                MUSKAN
              </div>
              <div className="text-[11px] font-medium tracking-widest text-[#F3A6C8]/90 uppercase">
                Your City • Your Vibe
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Discovery
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#F3A6C8] text-[#101827] shadow-pink font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      active ? "text-[#101827] stroke-[2.5]" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/80 mx-2" />

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Account & Preferences
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#F3A6C8] text-[#101827] shadow-pink font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active ? "text-[#101827] stroke-[2.5]" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Jaipur Decorative Heritage Branding */}
      <div className="p-4 m-3 mt-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/50 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-[#F3A6C8]/40 flex items-center justify-center shrink-0">
            <span className="text-base">🏰</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white tracking-wide truncate">
              {currentCity.name} Edition
            </div>
            <div className="text-[10px] text-[#F3A6C8] font-medium">
              Vibrant Heritage & Modern Vibes
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
