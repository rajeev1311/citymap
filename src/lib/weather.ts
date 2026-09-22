import { WeatherInfo } from "@/types";

const weatherCodeMap: Record<number, { text: string; icon: string }> = {
  0: { text: "Clear Sky", icon: "☀" },
  1: { text: "Mainly Clear", icon: "🌤" },
  2: { text: "Partly Cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁" },
  45: { text: "Foggy", icon: "🌫" },
  48: { text: "Depositing Rime Fog", icon: "🌫" },
  51: { text: "Light Drizzle", icon: "🌦" },
  53: { text: "Moderate Drizzle", icon: "🌦" },
  55: { text: "Dense Drizzle", icon: "🌧" },
  61: { text: "Slight Rain", icon: "🌧" },
  63: { text: "Moderate Rain", icon: "🌧" },
  65: { text: "Heavy Rain", icon: "⛈" },
  80: { text: "Rain Showers", icon: "🌦" },
  95: { text: "Thunderstorm", icon: "⚡" },
};

export async function fetchCityWeather(
  cityName = "Jaipur",
  lat = 26.9124,
  lon = 75.7873
): Promise<WeatherInfo> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      { next: { revalidate: 1800 } } // cache for 30 minutes
    );

    if (!res.ok) throw new Error("Weather fetch failed");

    const data = await res.json();
    const current = data.current_weather;
    const weather = weatherCodeMap[current.weathercode] || { text: "Clear Sky", icon: "☀" };

    return {
      temperature: Math.round(current.temperature),
      condition: weather.text,
      icon: weather.icon,
      city: cityName,
    };
  } catch {
    // Graceful fallback for demo
    return {
      temperature: 32,
      condition: "Clear Sky",
      icon: "☀",
      city: cityName,
    };
  }
}
