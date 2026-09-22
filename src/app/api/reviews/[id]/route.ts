import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
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
    await prisma.business.update({ where: { id: itemId }, data: { rating: roundedAvg, reviewCount: count } });
  } else if (itemType === "COLLEGE") {
    await prisma.college.update({ where: { id: itemId }, data: { rating: roundedAvg, reviewCount: count } });
  } else if (itemType === "SALON") {
    await prisma.salon.update({ where: { id: itemId }, data: { rating: roundedAvg, reviewCount: count } });
  } else if (itemType === "CINEMA") {
    await prisma.cinema.update({ where: { id: itemId }, data: { rating: roundedAvg, reviewCount: count } });
  } else if (itemType === "TOURIST_PLACE") {
    await prisma.touristPlace.update({ where: { id: itemId }, data: { rating: roundedAvg, reviewCount: count } });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized to delete this review" }, { status: 403 });
    }

    await prisma.review.delete({ where: { id } });
    await recalculateItemRating(review.itemType, review.itemId);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
