import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CityData } from "@/types";

interface CityCardProps {
  city: CityData;
}

export default function CityCard({ city }: CityCardProps) {
  const totalSpots =
    (city._count?.touristPlaces || 0) +
    (city._count?.businesses || 0) +
    (city._count?.colleges || 0) +
    (city._count?.salons || 0) +
    (city._count?.cinemas || 0);

  return (
    <Link
      href={`/cities/${city.id}`}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={city.image}
          alt={city.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md">
          {city.state}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold font-serif-hero tracking-wide group-hover:text-[#F3A6C8] transition-colors">
            {city.name}
          </h3>
          <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
            {city.description}
          </p>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>{totalSpots > 0 ? `${totalSpots} Places & Services` : "Explore Highlights"}</span>
        </div>

        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 flex items-center gap-1 transition-colors">
          Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
