"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MapPin,
  Store,
  GraduationCap,
  Sparkles,
  Clapperboard,
  Compass,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Admin stats error:", e);
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === "ADMIN") {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!authLoading && user?.role !== "ADMIN") {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 max-w-lg mx-auto space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
          Admin Access Required
        </h2>
        <p className="text-xs text-slate-500">
          This portal is restricted to authorized administrators of Muskan. Please log in with an administrator account (e.g., admin@muskan.city).
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-2xl bg-[#101827] text-white text-xs font-bold hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors"
        >
          Sign in as Admin
        </Link>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", count: stats?.totalUsers || 0, icon: Users, href: "/admin/users", color: "bg-blue-500/10 text-blue-600" },
    { label: "Total Cities", count: stats?.totalCities || 0, icon: MapPin, href: "/admin/cities", color: "bg-pink-500/10 text-pink-600" },
    { label: "Tourist Places", count: stats?.totalTouristPlaces || 0, icon: Compass, href: "/admin/tourist-places", color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Businesses", count: stats?.totalBusinesses || 0, icon: Store, href: "/admin/businesses", color: "bg-amber-500/10 text-amber-600" },
    { label: "Colleges", count: stats?.totalColleges || 0, icon: GraduationCap, href: "/admin/colleges", color: "bg-indigo-500/10 text-indigo-600" },
    { label: "Salons & Spas", count: stats?.totalSalons || 0, icon: Sparkles, href: "/admin/salons", color: "bg-purple-500/10 text-purple-600" },
    { label: "Cinemas", count: stats?.totalCinemas || 0, icon: Clapperboard, href: "/admin/cinemas", color: "bg-red-500/10 text-red-600" },
    { label: "Total Reviews", count: stats?.totalReviews || 0, icon: MessageSquare, href: "/admin/reviews", color: "bg-cyan-500/10 text-cyan-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-xs font-bold text-pink-700 dark:text-[#F3A6C8]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white mt-1">
            System Overview & Metrics
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <TrendingUp className="w-4 h-4" />
          <span>System Healthy • DB Live</span>
        </div>
      </div>

      <AdminNav />

      {/* KPI Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                href={c.href}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${c.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-pink-600 transition-colors">
                    Manage &rarr;
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white">
                  {c.count}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Recent Registered Users */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Recent Members
            </h3>
            <Link href="/admin/users" className="text-xs font-bold text-pink-600 hover:underline">
              View All Users &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats?.recentUsers?.map((u: any) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                  <div className="text-slate-400">{u.email}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  u.role === "ADMIN" ? "bg-pink-100 text-pink-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews for moderation */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-serif-hero text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-pink-500" /> Recent User Reviews
            </h3>
            <Link href="/admin/reviews" className="text-xs font-bold text-pink-600 hover:underline">
              Moderate &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats?.recentReviews?.map((r: any) => (
              <div key={r.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{r.user?.name}</span>
                  <span className="text-amber-500 font-bold">★ {r.rating}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
