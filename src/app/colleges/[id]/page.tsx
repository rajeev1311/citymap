import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Globe,
  GraduationCap,
  ArrowLeft,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import RatingStars from "@/components/reviews/RatingStars";
import SaveButton from "@/components/common/SaveButton";
import ShareButton from "@/components/common/ShareButton";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import CollegeCard from "@/components/cards/CollegeCard";
import { getSessionUser } from "@/lib/auth";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  const [college, reviews] = await Promise.all([
    prisma.college.findUnique({
      where: { id },
      include: { city: true },
    }),
    prisma.review.findMany({
      where: { itemType: "COLLEGE", itemId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    }),
  ]);

  if (!college) {
    notFound();
  }

  let isSaved = false;
  if (user) {
    const saved = await prisma.savedPlace.findUnique({
      where: {
        userId_itemType_itemId: {
          userId: user.id,
          itemType: "COLLEGE",
          itemId: college.id,
        },
      },
    });
    isSaved = !!saved;
  }

  const related = await prisma.college.findMany({
    where: {
      cityId: college.cityId,
      id: { not: college.id },
    },
    take: 3,
    include: { city: true },
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${college.name} ${college.address}`
  )}`;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/colleges" className="hover:text-pink-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Colleges
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{college.name}</span>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft-lg">
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-slate-950">
          <Image
            src={college.image}
            alt={college.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <SaveButton
              itemType="COLLEGE"
              itemId={college.id}
              initialSaved={isSaved}
              showText
              className="px-3.5 py-2 rounded-2xl shadow-lg backdrop-blur-md"
            />
            <ShareButton title={college.name} className="shadow-lg backdrop-blur-md" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3A6C8] text-slate-950 shadow-sm">
                {college.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                {college.city.name}, {college.city.state}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif-hero tracking-tight">
              {college.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <RatingStars rating={college.rating} reviewCount={college.reviewCount} showScore size="md" />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif-hero text-slate-900 dark:text-white mb-2">
                About this institution
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {college.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {college.phone && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Admission Office
                    </div>
                    <a
                      href={`tel:${college.phone}`}
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-pink-600 mt-0.5 block"
                    >
                      {college.phone}
                    </a>
                  </div>
                </div>
              )}

              {college.website && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Official Portal
                    </div>
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-pink-600 dark:text-[#F3A6C8] hover:underline mt-0.5 flex items-center gap-1"
                    >
                      Visit Campus Portal <ExternalLink className="w-3 h-3" />
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
                <span>Campus Location</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                {college.address}
              </p>

              <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-center p-3">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                    {college.city.name}, Rajasthan
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
                <span>Get Campus Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection
        itemType="COLLEGE"
        itemId={college.id}
        itemName={college.name}
        initialReviews={reviews as any}
        averageRating={college.rating}
        totalReviews={college.reviewCount}
      />

      {related.length > 0 && (
        <div className="pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
                More Colleges in {college.city.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore higher learning options across the region
              </p>
            </div>
            <Link href="/colleges" className="text-xs font-bold text-pink-600 dark:text-[#F3A6C8]">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rc) => (
              <CollegeCard key={rc.id} college={rc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
