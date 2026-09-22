import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CinemaSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "rating";

    const where: Prisma.CinemaWhereInput = {};
    if (cityId) where.cityId = cityId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { facilities: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.CinemaOrderByWithRelationInput = { rating: "desc" };
    if (sort === "reviews") orderBy = { reviewCount: "desc" };
    if (sort === "name") orderBy = { name: "asc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const cinemas = await prisma.cinema.findMany({
      where,
      orderBy,
      include: { city: true },
    });

    return NextResponse.json(cinemas);
  } catch (error) {
    console.error("Cinemas fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cinemas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const result = CinemaSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const cinema = await prisma.cinema.create({
      data: result.data,
      include: { city: true },
    });
    return NextResponse.json(cinema, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create cinema" }, { status: 500 });
  }
}
