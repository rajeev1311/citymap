import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CitySchema } from "@/lib/validations";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            businesses: true,
            colleges: true,
            salons: true,
            cinemas: true,
            touristPlaces: true,
          },
        },
      },
    });
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const result = CitySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const city = await prisma.city.create({
      data: result.data,
    });
    return NextResponse.json(city, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create city" }, { status: 500 });
  }
}
