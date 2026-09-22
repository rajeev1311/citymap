import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const cityId = searchParams.get("cityId") || undefined;
    const typeFilter = searchParams.get("type") || "ALL";

    if (!query) {
      return NextResponse.json({
        total: 0,
        cities: [],
        touristPlaces: [],
        businesses: [],
        colleges: [],
        salons: [],
        cinemas: [],
      });
    }

    const cityCondition = cityId ? { cityId } : {};

    const [cities, touristPlaces, businesses, colleges, salons, cinemas] = await Promise.all([
      typeFilter === "ALL" || typeFilter === "CITY"
        ? prisma.city.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { state: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            take: 6,
          })
        : [],

      typeFilter === "ALL" || typeFilter === "TOURIST_PLACE"
        ? prisma.touristPlace.findMany({
            where: {
              ...cityCondition,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { category: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
              ],
            },
            include: { city: true },
            take: 10,
          })
        : [],

      typeFilter === "ALL" || typeFilter === "BUSINESS"
        ? prisma.business.findMany({
            where: {
              ...cityCondition,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { category: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
              ],
            },
            include: { city: true },
            take: 10,
          })
        : [],

      typeFilter === "ALL" || typeFilter === "COLLEGE"
        ? prisma.college.findMany({
            where: {
              ...cityCondition,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { type: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
              ],
            },
            include: { city: true },
            take: 10,
          })
        : [],

      typeFilter === "ALL" || typeFilter === "SALON"
        ? prisma.salon.findMany({
            where: {
              ...cityCondition,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { services: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
              ],
            },
            include: { city: true },
            take: 10,
          })
        : [],

      typeFilter === "ALL" || typeFilter === "CINEMA"
        ? prisma.cinema.findMany({
            where: {
              ...cityCondition,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { facilities: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
              ],
            },
            include: { city: true },
            take: 10,
          })
        : [],
    ]);

    const total =
      cities.length +
      touristPlaces.length +
      businesses.length +
      colleges.length +
      salons.length +
      cinemas.length;

    return NextResponse.json({
      total,
      query,
      cities,
      touristPlaces,
      businesses,
      colleges,
      salons,
      cinemas,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search query failed" }, { status: 500 });
  }
}
