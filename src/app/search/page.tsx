"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Compass, Store, GraduationCap, Sparkles, Clapperboard, MapPin, X } from "lucide-react";
import TouristPlaceCard from "@/components/cards/TouristPlaceCard";
import BusinessCard from "@/components/cards/BusinessCard";
import CollegeCard from "@/components/cards/CollegeCard";
import SalonCard from "@/components/cards/SalonCard";
import CinemaCard from "@/components/cards/CinemaCard";
import CityCard from "@/components/cards/CityCard";
import { useCity } from "@/context/CityContext";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const { currentCity } = useCity();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [results, setResults] = useState<any>({
    total: 0,
    cities: [],
    touristPlaces: [],
    businesses: [],
    colleges: [],
    salons: [],
    cinemas: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({
        total: 0,
        cities: [],
        touristPlaces: [],
        businesses: [],
        colleges: [],
        salons: [],
        cinemas: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&type=${activeTab}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    router.replace(`/search?q=${encodeURIComponent(val)}`);
  };

  const tabs = [
    { id: "ALL", label: "All Results", icon: Search },
    { id: "TOURIST_PLACE", label: "Places", icon: Compass },
    { id: "BUSINESS", label: "Businesses", icon: Store },
    { id: "COLLEGE", label: "Colleges", icon: GraduationCap },
    { id: "SALON", label: "Salons", icon: Sparkles },
    { id: "CINEMA", label: "Cinemas", icon: Clapperboard },
    { id: "CITY", label: "Cities", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Search Discovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Find landmarks, cafes, campuses, and entertainment across all cities.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search for forts, cafes, colleges, salons, movies, cities..."
          className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100 placeholder-slate-400"
          autoFocus
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              router.replace("/search");
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#101827] dark:bg-[#F3A6C8] text-white dark:text-slate-950 shadow-sm"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Suggestions if empty query */}
      {!query.trim() && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto my-10">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-hero">
              Popular Search Suggestions
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click any suggestion to instantly discover matching hotspots.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "Amber Fort",
              "Tapri Central",
              "Hawa Mahal",
              "Raj Mandir",
              "MNIT",
              "Toni & Guy",
              "City Palace",
              "Handi Restaurant",
              "LMB Sweets",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  router.replace(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#F3A6C8] hover:text-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Container */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : query.trim() && results.total === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-hero">
            No results found for &ldquo;{query}&rdquo;
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn&apos;t find any places matching your search. Try different keywords or check spelling.
          </p>
        </div>
      ) : (
        <div className="space-y-10 pt-2">
          {/* Tourist Places Results */}
          {results.touristPlaces?.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-pink-500" />
                  Tourist Places ({results.touristPlaces.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.touristPlaces.map((p: any) => (
                  <TouristPlaceCard key={p.id} place={p} />
                ))}
              </div>
            </section>
          )}

          {/* Businesses Results */}
          {results.businesses?.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-500" />
                  Businesses & Dining ({results.businesses.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.businesses.map((b: any) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </section>
          )}

          {/* Colleges Results */}
          {results.colleges?.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  Colleges & Universities ({results.colleges.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.colleges.map((c: any) => (
                  <CollegeCard key={c.id} college={c} />
                ))}
              </div>
            </section>
          )}

          {/* Salons Results */}
          {results.salons?.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Salons & Spas ({results.salons.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.salons.map((s: any) => (
                  <SalonCard key={s.id} salon={s} />
                ))}
              </div>
            </section>
          )}

          {/* Cinemas Results */}
          {results.cinemas?.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-red-500" />
                  Cinema Halls ({results.cinemas.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.cinemas.map((cin: any) => (
                  <CinemaCard key={cin.id} cinema={cin} />
                ))}
              </div>
            </section>
          )}

          {/* Cities Results */}
          {results.cities?.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Cities ({results.cities.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.cities.map((city: any) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
