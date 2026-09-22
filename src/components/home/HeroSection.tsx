"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { useCity } from "@/context/CityContext";

export default function HeroSection() {
  const { currentCity, setIsLocationModalOpen } = useCity();

  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-soft-lg mb-10 group">
      {/* Background Image with subtle zoom on hover */}
      <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] w-full flex items-center">
        <Image
          src={currentCity.image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=85"}
          alt={`${currentCity.name} Hero`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Sophisticated Multi-Layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl text-white space-y-4 md:space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F3A6C8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore • Discover • Experience</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-300">
              WELCOME TO
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-serif-hero text-white tracking-tight leading-[1.05]">
              {currentCity.name}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200/90 leading-relaxed font-normal max-w-lg">
            &ldquo;From vibrant markets to peaceful spots, find everything you need in your city.&rdquo;
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/tourist-places"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F3A6C8] hover:bg-[#eb8ab4] text-slate-950 font-bold text-sm shadow-pink hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Explore {currentCity.name}
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#F3A6C8]" />
              <span>Current Location: <strong>{currentCity.name}</strong></span>
              <span className="text-[#F3A6C8]">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
