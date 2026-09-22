"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Bookmark,
  MessageSquare,
  Compass,
  Edit3,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";
import RatingStars from "@/components/reviews/RatingStars";
import { SavedPlaceData, ReviewData } from "@/types";

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { availableCities } = useCity();

  const [activeTab, setActiveTab] = useState<"SAVED" | "REVIEWS">("SAVED");
  const [savedItems, setSavedItems] = useState<SavedPlaceData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Edit profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editCityId, setEditCityId] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;
    setEditName(currentUser.name);
    setEditAvatar(currentUser.avatar || "");
    setEditCityId(currentUser.currentCityId || "");

    async function loadUserData() {
      setLoadingData(true);
      try {
        const [savedRes, reviewsRes] = await Promise.all([
          fetch("/api/saved"),
          fetch(`/api/reviews?userId=${currentUser.id}`),
        ]);

        if (savedRes.ok) {
          const sData = await savedRes.json();
          setSavedItems(sData);
        }

        if (reviewsRes.ok) {
          const rData = await reviewsRes.json();
          setReviews(rData);
        }
      } catch (e) {
        console.error("Error loading user profile data:", e);
      } finally {
        setLoadingData(false);
      }
    }

    loadUserData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          avatar: editAvatar,
          currentCityId: editCityId,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setIsEditing(false);
        setStatusMsg("Profile updated successfully!");
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        const data = await res.json();
        setStatusMsg(data.error || "Failed to update profile");
      }
    } catch {
      setStatusMsg("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
          Member Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to view your reviews, bookmarks, and account statistics.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-2xl bg-[#101827] text-white font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userCity = availableCities.find((c) => c.id === user?.currentCityId);

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-[#F3A6C8]/40 shadow-soft shrink-0 bg-slate-100">
              <Image
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`
                }
                alt={user?.name || "Avatar"}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                {user?.role === "ADMIN" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-[#F3A6C8]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  {userCity ? `${userCity.name}, ${userCity.state}` : "Jaipur, Rajasthan"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since 2026
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {statusMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Stats Counters */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif-hero">
              {savedItems.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Saved Places
            </div>
          </div>

          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif-hero">
              {reviews.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Reviews
            </div>
          </div>

          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif-hero">
              {availableCities.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Cities Explored
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("SAVED")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "SAVED"
              ? "bg-[#101827] dark:bg-[#F3A6C8] text-white dark:text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Places ({savedItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("REVIEWS")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "REVIEWS"
              ? "bg-[#101827] dark:bg-[#F3A6C8] text-white dark:text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loadingData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : activeTab === "SAVED" ? (
        savedItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-base font-bold text-slate-900 dark:text-white">
              No saved places in your collection
            </div>
            <p className="text-xs text-slate-400">
              Explore places in Jaipur and click the heart icon to save them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((rec) => {
              if (!rec.item) return null;
              return (
                <div
                  key={rec.id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft p-4 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                      <Image
                        src={rec.item.image}
                        alt={rec.item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-pink-600 dark:text-[#F3A6C8] uppercase tracking-wider">
                        {rec.itemType.replace("_", " ")}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {rec.item.name}
                      </h4>
                      <div className="mt-1">
                        <RatingStars rating={rec.item.rating} size="sm" showScore />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-[150px]">
                      {rec.item.address}
                    </span>
                    <Link
                      href={rec.item.url}
                      className="font-bold text-pink-600 dark:text-[#F3A6C8] hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-base font-bold text-slate-900 dark:text-white">
            You haven&apos;t written any reviews yet
          </div>
          <p className="text-xs text-slate-400">
            Share your experiences on tourist places and restaurants to help fellow explorers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-600 dark:text-[#F3A6C8]">
                  {rev.itemType.replace("_", " ")}
                </span>
                <RatingStars rating={rev.rating} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <div className="text-[11px] text-slate-400">
                {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white">
              Edit Your Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Home City
                </label>
                <select
                  value={editCityId}
                  onChange={(e) => setEditCityId(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                >
                  <option value="">Select a City</option>
                  {availableCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 text-xs font-bold hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
