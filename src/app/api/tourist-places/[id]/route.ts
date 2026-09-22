import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { TouristPlaceSchema } from "@/lib/validations";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const touristPlace = await prisma.touristPlace.findUnique({
      where: { id },
      include: { city: true },
    });

    if (!touristPlace) {
      return NextResponse.json({ error: "Tourist place not found" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { itemType: "TOURIST_PLACE", itemId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    return NextResponse.json({ ...touristPlace, reviews });
  } catch (error) {
    console.error("Tourist place fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch tourist place" }, { status: 500 });
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
    const result = TouristPlaceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const touristPlace = await prisma.touristPlace.update({
      where: { id },
      data: result.data,
      include: { city: true },
    });
    return NextResponse.json(touristPlace);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update tourist place" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.touristPlace.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete tourist place" }, { status: 500 });
  }
}
