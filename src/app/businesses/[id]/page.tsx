import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Store,
  ArrowLeft,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import RatingStars from "@/components/reviews/RatingStars";
import SaveButton from "@/components/common/SaveButton";
import ShareButton from "@/components/common/ShareButton";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import BusinessCard from "@/components/cards/BusinessCard";
import { getSessionUser } from "@/lib/auth";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  const [business, reviews] = await Promise.all([
    prisma.business.findUnique({
      where: { id },
      include: { city: true },
    }),
    prisma.review.findMany({
      where: { itemType: "BUSINESS", itemId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    }),
  ]);

  if (!business) {
    notFound();
  }

  let isSaved = false;
  if (user) {
    const saved = await prisma.savedPlace.findUnique({
      where: {
        userId_itemType_itemId: {
          userId: user.id,
          itemType: "BUSINESS",
          itemId: business.id,
        },
      },
    });
    isSaved = !!saved;
  }

  const related = await prisma.business.findMany({
    where: {
      cityId: business.cityId,
      id: { not: business.id },
    },
    take: 3,
    include: { city: true },
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name} ${business.address}`
  )}`;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/businesses" className="hover:text-pink-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Businesses
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{business.name}</span>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft-lg">
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-slate-950">
          <Image
            src={business.image}
            alt={business.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <SaveButton
              itemType="BUSINESS"
              itemId={business.id}
              initialSaved={isSaved}
              showText
              className="px-3.5 py-2 rounded-2xl shadow-lg backdrop-blur-md"
            />
            <ShareButton title={business.name} className="shadow-lg backdrop-blur-md" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3A6C8] text-slate-950 shadow-sm">
                {business.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                {business.city.name}, {business.city.state}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif-hero tracking-tight">
              {business.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <RatingStars rating={business.rating} reviewCount={business.reviewCount} showScore size="md" />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif-hero text-slate-900 dark:text-white mb-2">
                About this business
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {business.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {business.openingHours && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-[#F3A6C8] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Operating Hours
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {business.openingHours}
                    </div>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Phone Contact
                    </div>
                    <a
                      href={`tel:${business.phone}`}
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-pink-600 mt-0.5 block"
                    >
                      {business.phone}
                    </a>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Website
                    </div>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-pink-600 dark:text-[#F3A6C8] hover:underline mt-0.5 flex items-center gap-1"
                    >
                      Visit Official Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {business.email && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </div>
                    <a
                      href={`mailto:${business.email}`}
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-pink-600 mt-0.5 block"
                    >
                      {business.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span>Location & Address</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                {business.address}
              </p>

              <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-center p-3">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                    {business.latitude && business.longitude
                      ? `${business.latitude.toFixed(4)}° N, ${business.longitude.toFixed(4)}° E`
                      : `${business.city.name}, India`}
                  </div>
                </div>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#101827] hover:bg-slate-800 text-white dark:bg-[#F3A6C8] dark:hover:bg-[#e694b7] dark:text-slate-950 font-bold text-xs transition-all shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection
        itemType="BUSINESS"
        itemId={business.id}
        itemName={business.name}
        initialReviews={reviews as any}
        averageRating={business.rating}
        totalReviews={business.reviewCount}
      />

      {related.length > 0 && (
        <div className="pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
                More Businesses in {business.city.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check out other popular dining and shopping spots
              </p>
            </div>
            <Link href="/businesses" className="text-xs font-bold text-pink-600 dark:text-[#F3A6C8]">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rb) => (
              <BusinessCard key={rb.id} business={rb} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
