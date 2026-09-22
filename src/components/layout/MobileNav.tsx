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
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { currentCity } = useCity();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "City", href: "/cities", icon: MapPin },
    { name: "Business", href: "/businesses", icon: Store },
    { name: "Colleges", href: "/colleges", icon: GraduationCap },
    { name: "Saloon & Beauty Parlour", href: "/salons", icon: Sparkles },
    { name: "Cinema Halls", href: "/cinemas", icon: Clapperboard },
    { name: "Tourist Places", href: "/tourist-places", icon: Compass },
  ];

  const bottomItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/tourist-places", icon: Compass },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#101827] text-white p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F3A6C8] flex items-center justify-center text-slate-950 font-black text-lg shadow-pink">
                M
              </div>
              <div>
                <div className="text-xl font-bold font-serif-hero text-white tracking-tight">
                  MUSKAN
                </div>
                <div className="text-[10px] text-[#F3A6C8] font-medium tracking-wider uppercase">
                  Your City • Your Vibe
                </div>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1">
              Explore {currentCity.name}
            </div>
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#F3A6C8] text-[#101827] font-bold shadow-pink"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#101827]" : "text-slate-400"}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-800 my-3" />

            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1">
              Account
            </div>
            <Link
              href="/profile"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                isActive("/profile") ? "bg-[#F3A6C8] text-[#101827] font-bold" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </Link>

            <Link
              href="/saved"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                isActive("/saved") ? "bg-[#F3A6C8] text-[#101827] font-bold" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>Saved Places</span>
            </Link>

            <Link
              href="/settings"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                isActive("/settings") ? "bg-[#F3A6C8] text-[#101827] font-bold" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-pink-400 bg-pink-950/30 border border-pink-500/20"
              >
                <ShieldCheck className="w-4 h-4 text-[#F3A6C8]" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          <div>Currently in <strong className="text-white">{currentCity.name}</strong></div>
          <div className="text-[10px] text-slate-500 mt-0.5">Muskan © 2026</div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#101827]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                active
                  ? "text-pink-600 dark:text-[#F3A6C8]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
