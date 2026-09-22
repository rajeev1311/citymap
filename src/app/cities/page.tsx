"use client";

import React, { useState, useMemo } from "react";
import { MapPin, Search, Check, ArrowRight } from "lucide-react";
import CityCard from "@/components/cards/CityCard";
import { useCity } from "@/context/CityContext";

export default function CitiesPage() {
  const { availableCities, currentCity, selectCity } = useCity();
  const [search, setSearch] = useState("");

  const filteredCities = useMemo(() => {
    return availableCities.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [availableCities, search]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-xs font-bold text-pink-700 dark:text-[#F3A6C8]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Destinations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Explore Cities Across India
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Choose a destination to unlock handpicked attractions, beloved cafes, top campuses, and cinema experiences.
        </p>
      </div>

      {/* Active City Card Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#101827] text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="text-xs font-bold text-[#F3A6C8] uppercase tracking-wider mb-1">
            Current Selected City
          </div>
          <h2 className="text-2xl font-bold font-serif-hero">
            {currentCity.name}, {currentCity.state}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            All listings, hero visuals, and weather widgets are currently tailored for {currentCity.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Check className="w-3.5 h-3.5" /> Active City
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city or state name..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <div key={city.id} className="relative group">
            <CityCard city={city} />
            {currentCity.id !== city.id && (
              <button
                onClick={() => selectCity(city)}
                className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-sm hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors cursor-pointer"
              >
                Set as Active
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
