"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Trash2, ArrowRight, MapPin } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import { useAuth } from "@/context/AuthContext";
import { SavedPlaceData } from "@/types";

export default function SavedPlacesPage() {
  const { user, loading: authLoading } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedPlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    async function loadSaved() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          setSavedItems(data);
        }
      } catch (e) {
        console.error("Failed to load saved items:", e);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadSaved();
    }
  }, [user, authLoading]);

  const handleRemove = async (itemType: string, itemId: string) => {
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId }),
      });
      if (res.ok) {
        setSavedItems((prev) => prev.filter((i) => i.itemId !== itemId));
      }
    } catch (e) {
      console.error("Failed to remove saved item:", e);
    }
  };

  const filtered = savedItems.filter(
    (i) => filterType === "ALL" || i.itemType === filterType
  );

  const filterTabs = [
    { id: "ALL", label: "All Saved" },
    { id: "TOURIST_PLACE", label: "Landmarks" },
    { id: "BUSINESS", label: "Cafes & Dining" },
    { id: "COLLEGE", label: "Colleges" },
    { id: "SALON", label: "Salons" },
    { id: "CINEMA", label: "Cinemas" },
  ];

  if (!authLoading && !user) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
          <Bookmark className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
          Saved Places
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to view and organize your favorite city spots, cafes, and attractions.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-2xl bg-[#101827] text-white font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors"
        >
          Sign In to Muskan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-xs font-bold text-pink-700 dark:text-[#F3A6C8]">
          <Bookmark className="w-3.5 h-3.5" />
          <span>My Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Saved Places & Favourites
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Quickly access your bookmarked destinations, tea lounges, and landmarks.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === tab.id
                ? "bg-[#101827] dark:bg-[#F3A6C8] text-white dark:text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-hero">
            No saved places yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse through landmarks, cafes, and entertainment in Jaipur, then tap the heart icon to save them here.
          </p>
          <Link
            href="/tourist-places"
            className="inline-block px-5 py-2.5 rounded-2xl bg-[#F3A6C8] text-slate-950 font-bold text-xs hover:bg-[#e995bb] transition-colors"
          >
            Explore Tourist Places
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((record) => {
            const item = record.item;
            if (!item) return null;
            return (
              <div
                key={record.id}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {item.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-sm">
                      {item.category}
                    </span>
                  )}

                  <button
                    onClick={() => handleRemove(record.itemType, record.itemId)}
                    title="Remove from saved"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center shadow-md transition-colors cursor-pointer z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <RatingStars rating={item.rating} reviewCount={item.reviewCount} showScore size="sm" />
                  </div>

                  <Link href={item.url}>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-[65%]">
                      <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>

                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors"
                    >
                      View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
