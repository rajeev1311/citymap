import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SavedPlaceSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await requireUser();

    const savedRecords = await prisma.savedPlace.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const populatedItems = await Promise.all(
      savedRecords.map(async (record) => {
        let item = null;

        if (record.itemType === "BUSINESS") {
          const biz = await prisma.business.findUnique({
            where: { id: record.itemId },
            include: { city: true },
          });
          if (biz) {
            item = {
              id: biz.id,
              name: biz.name,
              category: biz.category,
              image: biz.image,
              address: biz.address,
              rating: biz.rating,
              reviewCount: biz.reviewCount,
              url: `/businesses/${biz.id}`,
            };
          }
        } else if (record.itemType === "COLLEGE") {
          const col = await prisma.college.findUnique({
            where: { id: record.itemId },
            include: { city: true },
          });
          if (col) {
            item = {
              id: col.id,
              name: col.name,
              category: col.type,
              image: col.image,
              address: col.address,
              rating: col.rating,
              reviewCount: col.reviewCount,
              url: `/colleges/${col.id}`,
            };
          }
        } else if (record.itemType === "SALON") {
          const sal = await prisma.salon.findUnique({
            where: { id: record.itemId },
            include: { city: true },
          });
          if (sal) {
            item = {
              id: sal.id,
              name: sal.name,
              category: "Salon & Spa",
              image: sal.image,
              address: sal.address,
              rating: sal.rating,
              reviewCount: sal.reviewCount,
              url: `/salons/${sal.id}`,
            };
          }
        } else if (record.itemType === "CINEMA") {
          const cin = await prisma.cinema.findUnique({
            where: { id: record.itemId },
            include: { city: true },
          });
          if (cin) {
            item = {
              id: cin.id,
              name: cin.name,
              category: "Cinema Hall",
              image: cin.image,
              address: cin.address,
              rating: cin.rating,
              reviewCount: cin.reviewCount,
              url: `/cinemas/${cin.id}`,
            };
          }
        } else if (record.itemType === "TOURIST_PLACE") {
          const tour = await prisma.touristPlace.findUnique({
            where: { id: record.itemId },
            include: { city: true },
          });
          if (tour) {
            item = {
              id: tour.id,
              name: tour.name,
              category: tour.category,
              image: tour.image,
              address: tour.address,
              rating: tour.rating,
              reviewCount: tour.reviewCount,
              url: `/tourist-places/${tour.id}`,
            };
          }
        }

        return {
          id: record.id,
          userId: record.userId,
          itemType: record.itemType,
          itemId: record.itemId,
          createdAt: record.createdAt,
          item,
        };
      })
    );

    // Filter out any items that were deleted from db
    const valid = populatedItems.filter((i) => i.item !== null);
    return NextResponse.json(valid);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in to view saved places" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch saved places" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const result = SavedPlaceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const { itemType, itemId } = result.data;

    // Toggle behavior: if already saved, remove it; if not saved, add it.
    const existing = await prisma.savedPlace.findUnique({
      where: {
        userId_itemType_itemId: {
          userId: user.id,
          itemType,
          itemId,
        },
      },
    });

    if (existing) {
      await prisma.savedPlace.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: "Removed from saved places" });
    } else {
      await prisma.savedPlace.create({
        data: {
          userId: user.id,
          itemType,
          itemId,
        },
      });
      return NextResponse.json({ saved: true, message: "Added to saved places" }, { status: 201 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in to save places" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update saved places" }, { status: 500 });
  }
}
