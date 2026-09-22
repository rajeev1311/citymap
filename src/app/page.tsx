import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, ThumbsUp, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import LocationBanner from "@/components/home/LocationBanner";
import TouristPlaceCard from "@/components/cards/TouristPlaceCard";
import BusinessCard from "@/components/cards/BusinessCard";
import CollegeCard from "@/components/cards/CollegeCard";
import SalonCard from "@/components/cards/SalonCard";
import CinemaCard from "@/components/cards/CinemaCard";
import { getSessionUser } from "@/lib/auth";

export const revalidate = 60; // revalidate every 60s

export default async function HomePage() {
  const user = await getSessionUser();

  // Find Jaipur or default first city
  let city = await prisma.city.findFirst({
    where: { name: { equals: "Jaipur", mode: "insensitive" } },
  });

  if (!city) {
    city = await prisma.city.findFirst();
  }

  const cityId = city?.id;

  // Fetch sections data in parallel
  const [
    popularTouristPlaces,
    popularBusinesses,
    recommendedColleges,
    recommendedSalons,
    recentCinemas,
    userSavedRecords,
  ] = await Promise.all([
    prisma.touristPlace.findMany({
      where: cityId ? { cityId } : {},
      orderBy: { rating: "desc" },
      take: 4,
      include: { city: true },
    }),
    prisma.business.findMany({
      where: cityId ? { cityId } : {},
      orderBy: { rating: "desc" },
      take: 4,
      include: { city: true },
    }),
    prisma.college.findMany({
      where: cityId ? { cityId } : {},
      orderBy: { rating: "desc" },
      take: 2,
      include: { city: true },
    }),
    prisma.salon.findMany({
      where: cityId ? { cityId } : {},
      orderBy: { rating: "desc" },
      take: 2,
      include: { city: true },
    }),
    prisma.cinema.findMany({
      where: cityId ? { cityId } : {},
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { city: true },
    }),
    user
      ? prisma.savedPlace.findMany({
          where: { userId: user.id },
          select: { itemId: true },
        })
      : [],
  ]);

  const savedIds = new Set(userSavedRecords.map((r) => r.itemId));

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <HeroSection />

      {/* Explore Categories */}
      <CategorySection />

      {/* Popular Tourist Places */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-[#F3A6C8]">
              <Flame className="w-3.5 h-3.5" />
              <span>Must-Visit Landmarks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white mt-1">
              Popular Places in {city?.name || "Jaipur"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Historic forts, royal palaces, and vibrant cultural destinations
            </p>
          </div>

          <Link
            href="/tourist-places"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-[#F3A6C8] transition-colors"
          >
            View All ({popularTouristPlaces.length}+)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTouristPlaces.map((place) => (
            <TouristPlaceCard
              key={place.id}
              place={place}
              initialSaved={savedIds.has(place.id)}
            />
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link
            href="/tourist-places"
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-[#F3A6C8]"
          >
            Explore all places <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Popular Businesses */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-[#F3A6C8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Top Rated Cafes & Dining</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white mt-1">
              Popular Businesses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Beloved tea lounges, royal dining, and artisan boutiques
            </p>
          </div>

          <Link
            href="/businesses"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-[#F3A6C8] transition-colors"
          >
            View All ({popularBusinesses.length}+)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularBusinesses.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              initialSaved={savedIds.has(biz.id)}
            />
          ))}
        </div>
      </section>

      {/* Location Banner with Geolocation */}
      <LocationBanner />

      {/* Recommended For You (Colleges & Salons mix) */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-[#F3A6C8]">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white mt-1">
              Recommended For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-tier educational institutions and premier self-care studios
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedColleges.map((col) => (
            <CollegeCard
              key={col.id}
              college={col}
              initialSaved={savedIds.has(col.id)}
            />
          ))}
          {recommendedSalons.map((sal) => (
            <SalonCard
              key={sal.id}
              salon={sal}
              initialSaved={savedIds.has(sal.id)}
            />
          ))}
        </div>
      </section>

      {/* Recently Added (Cinemas & Entertainment) */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-[#F3A6C8]">
              <Clock className="w-3.5 h-3.5" />
              <span>Entertainment & Culture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white mt-1">
              Iconic Cinema Halls & Theatres
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              From heritage royal theatres to cutting-edge IMAX multiplexes
            </p>
          </div>

          <Link
            href="/cinemas"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-[#F3A6C8] transition-colors"
          >
            View All Cinemas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCinemas.map((cin) => (
            <CinemaCard
              key={cin.id}
              cinema={cin}
              initialSaved={savedIds.has(cin.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
