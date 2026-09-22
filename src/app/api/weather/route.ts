import { NextResponse } from "next/server";
import { fetchCityWeather } from "@/lib/weather";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Jaipur";
    const lat = parseFloat(searchParams.get("lat") || "26.9124");
    const lon = parseFloat(searchParams.get("lon") || "75.7873");

    const weather = await fetchCityWeather(city, lat, lon);
    return NextResponse.json(weather);
  } catch (error) {
    console.error("Weather route error:", error);
    return NextResponse.json(
      {
        temperature: 32,
        condition: "Clear Sky",
        icon: "☀",
        city: "Jaipur",
      },
      { status: 200 }
    );
  }
}
