"use client";

import React, { useState, useEffect, useMemo } from "react";
import { GraduationCap } from "lucide-react";
import FilterBar from "@/components/search/FilterBar";
import CollegeCard from "@/components/cards/CollegeCard";
import { CollegeData } from "@/types";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";

export default function CollegesPage() {
  const { availableCities } = useCity();
  const { user } = useAuth();

  const [colleges, setColleges] = useState<CollegeData[]>([]);
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
    "Engineering & Technology",
    "Medical Science",
    "Public State University",
    "Multidisciplinary Private University",
  ];

  useEffect(() => {
    async function loadColleges() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCityId) queryParams.set("cityId", selectedCityId);
        if (selectedCategory && selectedCategory !== "All") queryParams.set("type", selectedCategory);
        if (sort) queryParams.set("sort", sort);

        const res = await fetch(`/api/colleges?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setColleges(data);
        }
      } catch (e) {
        console.error("Failed to load colleges:", e);
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
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
    return colleges.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase());

      const matchRating = selectedRating === 0 || c.rating >= selectedRating;

      return matchSearch && matchRating;
    });
  }, [colleges, search, selectedRating]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-xs font-bold text-blue-800 dark:text-blue-300">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Higher Education & Campuses</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Colleges & Universities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Explore institutes of national importance, premier medical colleges, and cutting-edge universities.
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
        placeholder="Search colleges, degrees, universities..."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-hero">
            No colleges found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for engineering, medical, or another city.
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
          {filtered.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              initialSaved={savedIds.has(college.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
