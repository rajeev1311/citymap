"use client";

import React, { useState } from "react";
import { MapPin, Navigation, RefreshCw, Compass } from "lucide-react";
import { useCity } from "@/context/CityContext";

export default function LocationBanner() {
  const {
    currentCity,
    setIsLocationModalOpen,
    detectBrowserLocation,
    isLocating,
  } = useCity();

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleRefresh = async () => {
    setStatusMsg("Detecting location...");
    const res = await detectBrowserLocation();
    setStatusMsg(res.message);
    setTimeout(() => {
      setStatusMsg(null);
    }, 4500);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-[#101827] text-white shadow-soft-lg mb-14 border border-slate-800">
      {/* Decorative accent glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F3A6C8]">
            <MapPin className="w-3.5 h-3.5 fill-[#F3A6C8]/20" />
            <span>Your Current Location</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-hero tracking-wide">
            {currentCity.name}, <span className="text-slate-300 font-normal">{currentCity.state}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Enjoy personalized recommendations, live weather, curated cafes, and verified attractions based on your location.
          </p>

          {statusMsg && (
            <div className="inline-flex items-center gap-2 text-xs py-1.5 px-3 rounded-xl bg-white/15 text-pink-200 mt-2 animate-in fade-in">
              <Navigation className="w-3.5 h-3.5 animate-spin" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isLocating}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 ${isLocating ? "animate-spin text-[#F3A6C8]" : ""}`} />
            <span>Refresh Location</span>
          </button>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F3A6C8] hover:bg-[#eb8ab4] text-slate-950 font-bold text-xs sm:text-sm shadow-pink transition-all cursor-pointer hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Choose Your City</span>
          </button>
        </div>
      </div>
    </div>
  );
}
