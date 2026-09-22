import React from "react";

export default function Loading() {
  return (
    <div className="w-full space-y-8 animate-pulse py-6">
      {/* Hero Skeleton */}
      <div className="w-full h-80 sm:h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}
