import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ProfileUpdateSchema } from "@/lib/validations";

export async function PUT(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const result = ProfileUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
    }

    const { name, avatar, currentCityId } = result.data;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        avatar: avatar || null,
        currentCityId: currentCityId || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        currentCityId: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
