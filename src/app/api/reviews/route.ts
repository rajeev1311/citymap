import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ReviewSchema } from "@/lib/validations";
import { ItemType } from "@prisma/client";

async function recalculateItemRating(itemType: ItemType, itemId: string) {
  const reviews = await prisma.review.findMany({
    where: { itemType, itemId },
    select: { rating: true },
  });

  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const roundedAvg = Math.round(avg * 10) / 10;

  if (itemType === "BUSINESS") {
    await prisma.business.update({
      where: { id: itemId },
      data: { rating: roundedAvg, reviewCount: count },
    });
  } else if (itemType === "COLLEGE") {
    await prisma.college.update({
      where: { id: itemId },
      data: { rating: roundedAvg, reviewCount: count },
    });
  } else if (itemType === "SALON") {
    await prisma.salon.update({
      where: { id: itemId },
      data: { rating: roundedAvg, reviewCount: count },
    });
  } else if (itemType === "CINEMA") {
    await prisma.cinema.update({
      where: { id: itemId },
      data: { rating: roundedAvg, reviewCount: count },
    });
  } else if (itemType === "TOURIST_PLACE") {
    await prisma.touristPlace.update({
      where: { id: itemId },
      data: { rating: roundedAvg, reviewCount: count },
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get("itemType") as ItemType | null;
    const itemId = searchParams.get("itemId");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (itemType) where.itemType = itemType;
    if (itemId) where.itemId = itemId;
    if (userId) where.userId = userId;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const result = ReviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const { itemType, itemId, rating, comment } = result.data;

    // Check if user already reviewed this item
    const existing = await prisma.review.findFirst({
      where: { userId: user.id, itemType, itemId },
    });

    let review;
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment },
        include: {
          user: { select: { id: true, name: true, avatar: true, role: true } },
        },
      });
    } else {
      review = await prisma.review.create({
        data: {
          userId: user.id,
          itemType,
          itemId,
          rating,
          comment,
        },
        include: {
          user: { select: { id: true, name: true, avatar: true, role: true } },
        },
      });
    }

    // Recalculate rating
    await recalculateItemRating(itemType, itemId);

    return NextResponse.json(review, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in to leave a review" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
