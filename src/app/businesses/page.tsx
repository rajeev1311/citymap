"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Store } from "lucide-react";
import FilterBar from "@/components/search/FilterBar";
import BusinessCard from "@/components/cards/BusinessCard";
import { BusinessData } from "@/types";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";

export default function BusinessesPage() {
  const { currentCity, availableCities } = useCity();
  const { user } = useAuth();

  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [sort, setSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const categories = [
    "All",
    "Cafe & Lounge",
    "Traditional Sweets & Restaurant",
    "Fine Dining",
    "Boutique & Organic Cafe",
    "Bar & Italian Ristorante",
  ];

  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCityId) queryParams.set("cityId", selectedCityId);
        if (selectedCategory && selectedCategory !== "All") queryParams.set("category", selectedCategory);
        if (sort) queryParams.set("sort", sort);

        const res = await fetch(`/api/businesses?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setBusinesses(data);
        }
      } catch (e) {
        console.error("Failed to load businesses:", e);
      } finally {
        setLoading(false);
      }
    }
    loadBusinesses();
  }, [selectedCityId, selectedCategory, sort]);

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
    return businesses.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase());

      const matchRating = selectedRating === 0 || b.rating >= selectedRating;

      return matchSearch && matchRating;
    });
  }, [businesses, search, selectedRating]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-xs font-bold text-amber-800 dark:text-amber-300">
          <Store className="w-3.5 h-3.5" />
          <span>Local Commerce & Dining</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Cafes, Restaurants & Local Businesses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Discover top-rated rooftop tea houses, heritage sweets, Michelin-grade dining, and boutique shops.
        </p>
      </div>

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
        placeholder="Search cafes, thalis, fine dining..."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-hero">
            No businesses found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters.
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
          {filtered.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              initialSaved={savedIds.has(biz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
