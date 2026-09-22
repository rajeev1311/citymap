"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ItemType } from "@prisma/client";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  itemType: ItemType;
  itemId: string;
  initialSaved?: boolean;
  className?: string;
  showText?: boolean;
}

export default function SaveButton({
  itemType,
  itemId,
  initialSaved = false,
  className = "",
  showText = false,
}: SaveButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    const nextSaved = !saved;
    setSaved(nextSaved); // optimistic update

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId }),
      });

      if (!res.ok) {
        setSaved(!nextSaved); // rollback
      }
    } catch {
      setSaved(!nextSaved); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      title={saved ? "Remove from saved places" : "Save this place"}
      className={`group/btn flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${className} ${
        saved
          ? "text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40"
          : "text-slate-600 hover:text-rose-500 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:text-slate-200"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110 ${
          saved ? "fill-rose-500 text-rose-500" : "fill-none"
        }`}
      />
      {showText && (
        <span className="text-xs font-semibold">
          {saved ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
