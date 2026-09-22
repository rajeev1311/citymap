"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { availableCities, currentCity } = useCity();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cityId, setCityId] = useState(currentCity.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await register({
      name,
      email,
      password,
      confirmPassword,
      cityId,
    });

    setIsSubmitting(false);

    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F3A6C8] flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-pink">
            M
          </div>
          <h1 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join Muskan to review, save places, and personalize your city vibe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Rohan Sharma"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

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
                placeholder="rohan@example.com"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Home City
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                {availableCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
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
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
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
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-pink-600 dark:text-[#F3A6C8] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
