import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, ArrowRight, Compass, Store, GraduationCap, Sparkles, Clapperboard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import TouristPlaceCard from "@/components/cards/TouristPlaceCard";
import BusinessCard from "@/components/cards/BusinessCard";
import CollegeCard from "@/components/cards/CollegeCard";
import SalonCard from "@/components/cards/SalonCard";
import CinemaCard from "@/components/cards/CinemaCard";

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const city = await prisma.city.findUnique({
    where: { id },
    include: {
      touristPlaces: { take: 4, orderBy: { rating: "desc" } },
      businesses: { take: 4, orderBy: { rating: "desc" } },
      colleges: { take: 3, orderBy: { rating: "desc" } },
      salons: { take: 3, orderBy: { rating: "desc" } },
      cinemas: { take: 3, orderBy: { rating: "desc" } },
      _count: {
        select: {
          touristPlaces: true,
          businesses: true,
          colleges: true,
          salons: true,
          cinemas: true,
        },
      },
    },
  });

  if (!city) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/cities" className="hover:text-pink-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Cities
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">{city.name}</span>
      </div>

      {/* City Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-lg min-h-[360px] flex items-end p-8 text-white">
        <Image
          src={city.image}
          alt={city.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3A6C8] text-slate-950 shadow-sm">
            {city.state}, {city.country}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-serif-hero tracking-tight">
            {city.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
            {city.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              🏛 {city._count.touristPlaces} Attractions
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              ☕ {city._count.businesses} Cafes & Businesses
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              🎓 {city._count.colleges} Colleges
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              ✨ {city._count.salons} Salons
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              🎬 {city._count.cinemas} Cinemas
            </span>
          </div>
        </div>
      </div>

      {/* Tourist Places Section */}
      {city.touristPlaces.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
                Tourist Places in {city.name}
              </h2>
            </div>
            <Link
              href={`/tourist-places?cityId=${city.id}`}
              className="text-xs font-bold text-pink-600 dark:text-[#F3A6C8] hover:underline flex items-center gap-1"
            >
              See All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {city.touristPlaces.map((tp) => (
              <TouristPlaceCard key={tp.id} place={{ ...tp, city }} />
            ))}
          </div>
        </section>
      )}

      {/* Businesses Section */}
      {city.businesses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
                Cafes & Businesses in {city.name}
              </h2>
            </div>
            <Link
              href={`/businesses?cityId=${city.id}`}
              className="text-xs font-bold text-pink-600 dark:text-[#F3A6C8] hover:underline flex items-center gap-1"
            >
              See All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {city.businesses.map((biz) => (
              <BusinessCard key={biz.id} business={{ ...biz, city }} />
            ))}
          </div>
        </section>
      )}

      {/* Colleges, Salons, Cinemas Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {city.colleges.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <h3 className="text-lg font-bold font-serif-hero">Top Colleges</h3>
            </div>
            <div className="space-y-4">
              {city.colleges.map((col) => (
                <CollegeCard key={col.id} college={{ ...col, city }} />
              ))}
            </div>
          </div>
        )}

        {city.salons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="text-lg font-bold font-serif-hero">Salons & Spas</h3>
            </div>
            <div className="space-y-4">
              {city.salons.map((sal) => (
                <SalonCard key={sal.id} salon={{ ...sal, city }} />
              ))}
            </div>
          </div>
        )}

        {city.cinemas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-red-500" />
              <h3 className="text-lg font-bold font-serif-hero">Theatres & Multiplexes</h3>
            </div>
            <div className="space-y-4">
              {city.cinemas.map((cin) => (
                <CinemaCard key={cin.id} cinema={{ ...cin, city }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
