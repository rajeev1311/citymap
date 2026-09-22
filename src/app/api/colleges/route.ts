import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CollegeSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "rating";

    const where: Prisma.CollegeWhereInput = {};
    if (cityId) where.cityId = cityId;
    if (type && type !== "All") where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: "desc" };
    if (sort === "reviews") orderBy = { reviewCount: "desc" };
    if (sort === "name") orderBy = { name: "asc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const colleges = await prisma.college.findMany({
      where,
      orderBy,
      include: { city: true },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Colleges fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const result = CollegeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const college = await prisma.college.create({
      data: result.data,
      include: { city: true },
    });
    return NextResponse.json(college, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create college" }, { status: 500 });
  }
}
