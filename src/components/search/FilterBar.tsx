"use client";

import React from "react";
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { CityData } from "@/types";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (cat: string) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  selectedCityId: string;
  cities: CityData[];
  onCityChange: (cityId: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  placeholder?: string;
}

export default function FilterBar({
  search,
  onSearchChange,
  selectedCategory,
  categories,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  selectedCityId,
  cities,
  onCityChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  placeholder = "Search listings...",
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft mb-8 space-y-4">
      {/* Top row: Search input, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* City Filter */}
        <select
          value={selectedCityId}
          onChange={(e) => onCityChange(e.target.value)}
          className="px-3.5 py-2.5 text-xs font-semibold rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-[#F3A6C8]"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(Number(e.target.value))}
          className="px-3.5 py-2.5 text-xs font-semibold rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-[#F3A6C8]"
        >
          <option value={0}>Any Rating</option>
          <option value={4.5}>★ 4.5+ (Exceptional)</option>
          <option value={4.0}>★ 4.0+ (Very Good)</option>
          <option value={3.5}>★ 3.5+ (Good)</option>
        </select>

        {/* Sort Select */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3.5 py-2.5 text-xs font-semibold rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-[#F3A6C8]"
        >
          <option value="rating">Top Rated</option>
          <option value="reviews">Most Reviews</option>
          <option value="name">Name (A-Z)</option>
          <option value="newest">Recently Added</option>
        </select>

        {/* Grid/List toggle */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills (if provided) */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#101827] dark:bg-[#F3A6C8] text-white dark:text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
