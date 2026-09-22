"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Search,
  ChevronDown,
  User as UserIcon,
  Bookmark,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";
import { WeatherInfo } from "@/types";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currentCity, setIsLocationModalOpen } = useCity();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherInfo>({
    temperature: 32,
    condition: "Clear Sky",
    icon: "☀",
    city: currentCity.name,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch weather for the current city
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(
          `/api/weather?city=${encodeURIComponent(currentCity.name)}&lat=${currentCity.latitude}&lon=${currentCity.longitude}`
        );
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (e) {
        console.error("Failed to load weather:", e);
      }
    }
    loadWeather();
  }, [currentCity]);

  // Handle clicking outside profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
        {/* Left: Mobile hamburger & Location trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Location button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all text-left group cursor-pointer"
            title="Click to change city"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-pink-100 dark:border-pink-900/50">
              <MapPin className="w-4 h-4 fill-pink-500/20" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {currentCity.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform group-hover:translate-y-0.5" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Your current location
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for anything in ${currentCity.name}...`}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#F3A6C8] focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F3A6C8]/40 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </form>
        </div>

        {/* Right: Weather & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Weather Widget */}
          <div
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/60 border border-amber-200/60 dark:border-slate-700 text-xs cursor-pointer hover:shadow-sm transition-all"
            title={`Live weather in ${weather.city}: ${weather.condition}`}
          >
            <span className="text-base select-none">{weather.icon}</span>
            <div>
              <div className="font-bold text-slate-900 dark:text-white leading-tight">
                {weather.temperature}°C
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-medium">
                {weather.condition}
              </div>
            </div>
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#F3A6C8]/60">
                  <Image
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div className="hidden xl:block text-left pr-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[100px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    <Link
                      href="/saved"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      Saved Places
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-pink-600 dark:text-[#F3A6C8] hover:bg-pink-50 dark:hover:bg-pink-950/40"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-[#F3A6C8] hover:text-slate-950 transition-all shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
