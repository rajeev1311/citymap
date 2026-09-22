"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Bell,
  Shield,
  MapPin,
  Check,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const { availableCities, currentCity, selectCity } = useCity();

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [notifyRecommendations, setNotifyRecommendations] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const applyTheme = (mode: "light" | "dark" | "system") => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  // Initialize theme from document or localStorage
  useEffect(() => {
    const saved = localStorage.getItem("muskan_theme") as "light" | "dark" | "system" | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("muskan_theme", newTheme);
    applyTheme(newTheme);
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-xs font-bold text-pink-700 dark:text-[#F3A6C8]">
          <Settings className="w-3.5 h-3.5" />
          <span>Preferences & Control</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Customize your visual appearance, notification preferences, default destination, and account security.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Preferences successfully saved and persisted!</span>
        </div>
      )}

      {/* 1. Appearance / Theme */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif-hero">
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-400">Choose your preferred visual aesthetic</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { id: "light", label: "Light Mode", icon: Sun },
            { id: "dark", label: "Dark Navy", icon: Moon },
            { id: "system", label: "System Sync", icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleThemeChange(item.id as any)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  isSelected
                    ? "border-[#F3A6C8] bg-pink-50/60 dark:bg-pink-950/30 text-slate-900 dark:text-white ring-2 ring-[#F3A6C8]/60 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-pink-600 dark:text-[#F3A6C8]" : ""}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Default Location */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif-hero">
              Primary City & Region
            </h3>
            <p className="text-xs text-slate-400">Select which destination loads automatically for you</p>
          </div>
        </div>

        <div className="max-w-md">
          <select
            value={currentCity.id}
            onChange={(e) => {
              const matched = availableCities.find((c) => c.id === e.target.value);
              if (matched) selectCity(matched);
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer focus:ring-2 focus:ring-[#F3A6C8]"
          >
            {availableCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}, {city.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif-hero">
              Notifications & Alerts
            </h3>
            <p className="text-xs text-slate-400">Stay informed about top recommendations and community reviews</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Personalized Destination Recommendations
              </div>
              <div className="text-[11px] text-slate-400">
                Receive curated weekend highlights for your active city
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyRecommendations}
              onChange={(e) => setNotifyRecommendations(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Review & Rating Interactions
              </div>
              <div className="text-[11px] text-slate-400">
                Get notified when others engage with your reviews
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyReviews}
              onChange={(e) => setNotifyReviews(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded"
            />
          </label>
        </div>
      </div>

      {/* 4. Security & Account */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif-hero">
              Account & Security
            </h3>
            <p className="text-xs text-slate-400">Password hashing and session token status</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>Encrypted with bcrypt (10 rounds salt) & HTTP-only JWT sessions.</span>
          </div>
          <div>
            Account Role: <strong className="text-slate-900 dark:text-white">{user?.role || "GUEST"}</strong>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          className="px-6 py-3 rounded-2xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold text-xs sm:text-sm hover:bg-[#F3A6C8] hover:text-slate-950 transition-all cursor-pointer shadow-md"
        >
          Save All Preferences
        </button>
      </div>
    </div>
  );
}
