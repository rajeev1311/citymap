import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalCities,
      totalBusinesses,
      totalColleges,
      totalSalons,
      totalCinemas,
      totalTouristPlaces,
      totalReviews,
      recentUsers,
      recentReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.city.count(),
      prisma.business.count(),
      prisma.college.count(),
      prisma.salon.count(),
      prisma.cinema.count(),
      prisma.touristPlace.count(),
      prisma.review.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, avatar: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalCities,
      totalBusinesses,
      totalColleges,
      totalSalons,
      totalCinemas,
      totalTouristPlaces,
      totalReviews,
      recentUsers,
      recentReviews,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load admin stats" }, { status: 500 });
  }
}
