import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CitySchema } from "@/lib/validations";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        businesses: { take: 8, orderBy: { rating: "desc" } },
        colleges: { take: 8, orderBy: { rating: "desc" } },
        salons: { take: 8, orderBy: { rating: "desc" } },
        cinemas: { take: 8, orderBy: { rating: "desc" } },
        touristPlaces: { take: 8, orderBy: { rating: "desc" } },
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

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    return NextResponse.json(city);
  } catch (error) {
    console.error("City fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch city" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const result = CitySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const city = await prisma.city.update({
      where: { id },
      data: result.data,
    });
    return NextResponse.json(city);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update city" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 });
  }
}
