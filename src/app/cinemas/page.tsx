"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clapperboard } from "lucide-react";
import FilterBar from "@/components/search/FilterBar";
import CinemaCard from "@/components/cards/CinemaCard";
import { CinemaData } from "@/types";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";

export default function CinemasPage() {
  const { availableCities } = useCity();
  const { user } = useAuth();

  const [cinemas, setCinemas] = useState<CinemaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [sort, setSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadCinemas() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCityId) queryParams.set("cityId", selectedCityId);
        if (sort) queryParams.set("sort", sort);

        const res = await fetch(`/api/cinemas?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCinemas(data);
        }
      } catch (e) {
        console.error("Failed to load cinemas:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCinemas();
  }, [selectedCityId, sort]);

  useEffect(() => {
    if (!user) return;
    async function loadSaved() {
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          setSavedIds(new Set(data.map((item: any) => item.itemId)));
        }
      } catch {}
    }
    loadSaved();
  }, [user]);

  const filtered = useMemo(() => {
    return cinemas.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        (c.facilities && c.facilities.toLowerCase().includes(search.toLowerCase())) ||
        c.address.toLowerCase().includes(search.toLowerCase());

      const matchRating = selectedRating === 0 || c.rating >= selectedRating;

      return matchSearch && matchRating;
    });
  }, [cinemas, search, selectedRating]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-xs font-bold text-red-800 dark:text-red-300">
          <Clapperboard className="w-3.5 h-3.5" />
          <span>Cinematic Experiences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Cinema Halls & Theatres
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          From legendary royal single-screen auditoriums to modern Dolby Atmos 4K multiplexes.
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedCategory="All"
        categories={[]}
        onCategoryChange={() => {}}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        selectedCityId={selectedCityId}
        cities={availableCities}
        onCityChange={setSelectedCityId}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        placeholder="Search IMAX, Raj Mandir, Cinepolis, Dolby..."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Clapperboard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-hero">
            No cinemas found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different city.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedRating(0);
              setSelectedCityId("");
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filtered.map((cinema) => (
            <CinemaCard
              key={cinema.id}
              cinema={cinema}
              initialSaved={savedIds.has(cinema.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
