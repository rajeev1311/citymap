"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Compass, Sparkles } from "lucide-react";
import FilterBar from "@/components/search/FilterBar";
import TouristPlaceCard from "@/components/cards/TouristPlaceCard";
import { TouristPlaceData } from "@/types";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";

export default function TouristPlacesPage() {
  const { currentCity, availableCities } = useCity();
  const { user } = useAuth();

  const [places, setPlaces] = useState<TouristPlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [sort, setSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const categories = ["All", "Fort", "Palace", "Heritage Site", "Museum", "Garden"];

  // Fetch tourist places
  useEffect(() => {
    async function loadPlaces() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCityId) queryParams.set("cityId", selectedCityId);
        if (selectedCategory && selectedCategory !== "All") queryParams.set("category", selectedCategory);
        if (sort) queryParams.set("sort", sort);

        const res = await fetch(`/api/tourist-places?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPlaces(data);
        }
      } catch (e) {
        console.error("Failed to load tourist places:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPlaces();
  }, [selectedCityId, selectedCategory, sort]);

  // Load saved places for current user
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

  // Client-side search and rating filter
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase());

      const matchRating = selectedRating === 0 || p.rating >= selectedRating;

      return matchSearch && matchRating;
    });
  }, [places, search, selectedRating]);

  return (
    <div className="space-y-6">
      {/* Heading Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-xs font-bold text-pink-700 dark:text-[#F3A6C8]">
          <Compass className="w-3.5 h-3.5" />
          <span>City Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Tourist Places & Heritage Gems
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Immerse yourself in regal forts, breathtaking palaces, vibrant bazaars, and historic monuments.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={setSelectedCategory}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        selectedCityId={selectedCityId}
        cities={availableCities}
        onCityChange={setSelectedCityId}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        placeholder="Search monuments, forts, palaces..."
      />

      {/* Results Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-hero">
            No tourist places found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, changing the city filter, or clearing the rating requirements.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
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
          {filteredPlaces.map((place) => (
            <TouristPlaceCard
              key={place.id}
              place={place}
              initialSaved={savedIds.has(place.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
