"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push(redirect);
    } else {
      setError(res.error || "Invalid credentials");
    }
  };

  const handleQuickDemo = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F3A6C8] flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-pink">
            M
          </div>
          <h1 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
            Welcome to Muskan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to explore your city vibes and saved collections
          </p>
        </div>

        {/* Quick Demo Login Pills */}
        <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-pink-700 dark:text-[#F3A6C8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Instant Demo Accounts:
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("demo@muskan.city", "demo123")}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-900 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:bg-pink-100 dark:hover:bg-pink-950/60 transition-colors"
            >
              👤 Demo User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin@muskan.city", "admin123")}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-900 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:bg-pink-100 dark:hover:bg-pink-950/60 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-pink-600" /> Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold text-xs sm:text-sm hover:bg-[#F3A6C8] hover:text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-pink-600 dark:text-[#F3A6C8] hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
