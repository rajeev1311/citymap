"use client";

import React, { useState } from "react";
import { useCity } from "@/context/CityContext";
import { MapPin, Search, Navigation, X, Check, Compass } from "lucide-react";
import Image from "next/image";

export default function CitySelectorModal() {
  const {
    currentCity,
    availableCities,
    selectCity,
    isLocationModalOpen,
    setIsLocationModalOpen,
    detectBrowserLocation,
    isLocating,
  } = useCity();

  const [search, setSearch] = useState("");
  const [geoMsg, setGeoMsg] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  const filtered = availableCities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleAutoDetect = async () => {
    setGeoMsg("Detecting your location...");
    const res = await detectBrowserLocation();
    setGeoMsg(res.message);
    setTimeout(() => {
      setGeoMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-[#F3A6C8] flex items-center justify-center border border-pink-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif-hero tracking-wide">Choose Your City</h3>
              <p className="text-xs text-slate-300">Discover handpicked vibes and local hotspots</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* GPS Auto-detect button */}
          <button
            onClick={handleAutoDetect}
            disabled={isLocating}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-[#F3A6C8]/60 bg-pink-50/50 dark:bg-pink-950/20 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F3A6C8] text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Navigation className={`w-5 h-5 ${isLocating ? "animate-spin" : ""}`} />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  Detect My Current Location
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F3A6C8]/30 text-pink-700 dark:text-pink-300">
                    GPS
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Find closest attractions and experiences automatically
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-pink-600 dark:text-pink-400 group-hover:translate-x-0.5 transition-transform">
              Detect &rarr;
            </span>
          </button>

          {geoMsg && (
            <div className="text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F3A6C8]" />
              {geoMsg}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city or state name..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Cities Grid */}
          <div className="max-h-72 overflow-y-auto pr-1 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Available Cities ({filtered.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filtered.map((city) => {
                const isSelected = currentCity.id === city.id || currentCity.name === city.name;
                return (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F3A6C8] bg-pink-50/70 dark:bg-pink-950/30 ring-1 ring-[#F3A6C8]"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {city.state}, {city.country}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#F3A6C8] text-slate-900 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-400">
                No cities found matching &quot;{search}&quot;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
