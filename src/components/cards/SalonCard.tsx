import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";
import RatingStars from "@/components/reviews/RatingStars";
import SaveButton from "@/components/common/SaveButton";
import { SalonData } from "@/types";

interface SalonCardProps {
  salon: SalonData;
  initialSaved?: boolean;
}

export default function SalonCard({ salon, initialSaved }: SalonCardProps) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={salon.image}
          alt={salon.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          Salon & Spa
        </span>

        <div className="absolute top-3 right-3 z-10">
          <SaveButton
            itemType="SALON"
            itemId={salon.id}
            initialSaved={initialSaved}
            className="w-8 h-8 rounded-full shadow-md"
          />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <RatingStars rating={salon.rating} reviewCount={salon.reviewCount} showScore size="sm" />
          {salon.city && (
            <span className="text-[11px] font-medium text-slate-400">
              {salon.city.name}
            </span>
          )}
        </div>

        <Link href={`/salons/${salon.id}`}>
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
            {salon.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 flex-1">
          {salon.services}
        </p>

        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="truncate">{salon.address}</span>
          </div>

          <Link
            href={`/salons/${salon.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors"
          >
            Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
