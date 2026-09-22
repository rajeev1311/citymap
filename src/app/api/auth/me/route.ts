import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      currentCityId: true,
      createdAt: true,
      currentCity: {
        select: {
          id: true,
          name: true,
          state: true,
        },
      },
    },
  });

  return NextResponse.json({ user });
}
