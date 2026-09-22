import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="text-center py-24 px-4 max-w-lg mx-auto space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] flex items-center justify-center mx-auto shadow-soft">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold font-serif-hero text-slate-900 dark:text-white">
        404 • Destination Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        The palace, cafe, or experience you are looking for has moved or does not exist. Let&apos;s guide you back to the city hub.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Return to Jaipur Home</span>
        </Link>
      </div>
    </div>
  );
}
