"use client";

import React, { useEffect } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
      <div className="w-14 h-14 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-soft">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        An error occurred while rendering this page. You can try refreshing or returning to the home screen.
      </p>
      <div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#101827] text-white font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
