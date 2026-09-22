"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Store,
  GraduationCap,
  Sparkles,
  Clapperboard,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useCity } from "@/context/CityContext";

export default function CategorySection() {
  const { currentCity } = useCity();

  const categories = [
    {
      title: "City",
      desc: `Explore ${currentCity.name}'s best spots, areas & more`,
      href: "/cities",
      icon: MapPin,
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      accent: "from-pink-500/20 to-rose-500/40",
    },
    {
      title: "Business",
      desc: "Shops, services, restaurants & more",
      href: "/businesses",
      icon: Store,
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      accent: "from-amber-500/20 to-orange-500/40",
    },
    {
      title: "Colleges",
      desc: `Find the best colleges in ${currentCity.name}`,
      href: "/colleges",
      icon: GraduationCap,
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      accent: "from-blue-500/20 to-indigo-500/40",
    },
    {
      title: "Saloon & Beauty Parlour",
      desc: "Look good, feel good",
      href: "/salons",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      accent: "from-purple-500/20 to-pink-500/40",
    },
    {
      title: "Cinema Halls",
      desc: "Movies, showtimes & more",
      href: "/cinemas",
      icon: Clapperboard,
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      accent: "from-red-500/20 to-rose-500/40",
    },
    {
      title: "Tourist Places",
      desc: `Discover ${currentCity.name}'s hidden gems`,
      href: "/tourist-places",
      icon: Compass,
      image:
        "https://images.unsplash.com/photo-1609137144822-26a575a7c295?auto=format&fit=crop&w=800&q=80",
      accent: "from-emerald-500/20 to-teal-500/40",
    },
  ];

  return (
    <section id="categories" className="mb-14 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-[#F3A6C8]">
            Curated Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white mt-1">
            Explore Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Find what you&apos;re looking for in {currentCity.name}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative h-48 sm:h-52 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-end p-5 text-white"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

              {/* Icon Chip */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#F3A6C8] group-hover:text-slate-950 transition-colors shadow-sm">
                <Icon className="w-5 h-5" />
              </div>

              {/* Arrow Indicator */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all duration-200">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-xl font-bold font-serif-hero tracking-wide group-hover:text-[#F3A6C8] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-1 font-normal">
                  {cat.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
