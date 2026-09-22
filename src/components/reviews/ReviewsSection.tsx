"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Star, Trash2, Send, ShieldCheck, User as UserIcon } from "lucide-react";
import RatingStars from "./RatingStars";
import { useAuth } from "@/context/AuthContext";
import { ItemType } from "@prisma/client";
import { ReviewData } from "@/types";

interface ReviewsSectionProps {
  itemType: ItemType;
  itemId: string;
  itemName: string;
  initialReviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewsSection({
  itemType,
  itemId,
  itemName,
  initialReviews,
  averageRating: initialAvg,
  totalReviews: initialTotal,
}: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute rating breakdown
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : initialAvg;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to leave a review.");
      return;
    }

    if (comment.trim().length < 5) {
      setError("Comment must be at least 5 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      // Optimistically update reviews list
      const newReview: ReviewData = {
        id: data.id || Math.random().toString(),
        userId: user.id,
        itemType,
        itemId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
      };

      setReviews([newReview, ...reviews.filter((r) => r.userId !== user.id)]);
      setComment("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (e) {
      console.error("Delete review error:", e);
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-pink-500" />
        <h3 className="text-2xl font-bold font-serif-hero text-slate-900 dark:text-white">
          Reviews & Experiences
        </h3>
      </div>

      {/* Ratings Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft mb-8">
        {/* Big Score */}
        <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 text-center">
          <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-serif-hero">
            {avg.toFixed(1)}
          </div>
          <div className="my-2">
            <RatingStars rating={avg} size="md" />
          </div>
          <div className="text-xs text-slate-400">
            Based on {total} {total === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* 5-star distribution bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2 py-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1 shrink-0">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400 font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft mb-10">
        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Share your experience of {itemName}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Help locals and tourists discover the best vibes in the city.
        </p>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Rating
              </label>
              <RatingStars
                rating={rating}
                size="lg"
                interactive
                onRatingChange={(r) => setRating(r)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love about this place? Any tips for visitors?"
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#F3A6C8]"
              />
            </div>

            {error && (
              <div className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Posting..." : "Submit Review"}</span>
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30">
            <div className="text-xs text-slate-700 dark:text-slate-300">
              Sign in to share your thoughts and rate this spot.
            </div>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-[#F3A6C8] dark:text-slate-950 text-xs font-bold hover:opacity-90"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 text-slate-400 text-xs">
            No reviews yet. Be the first to review {itemName}!
          </div>
        ) : (
          reviews.map((rev) => {
            const isOwner = user && (user.id === rev.userId || user.role === "ADMIN");
            const formattedDate = new Date(rev.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      {rev.user.avatar ? (
                        <Image
                          src={rev.user.avatar}
                          alt={rev.user.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 m-2 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {rev.user.name}
                        </span>
                        {rev.user.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-[#F3A6C8] font-bold">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} size="sm" />
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                  {rev.comment}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
