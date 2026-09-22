"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CityData } from "@/types";

interface CityContextType {
  currentCity: CityData;
  availableCities: CityData[];
  selectCity: (city: CityData) => void;
  selectCityById: (id: string) => void;
  detectBrowserLocation: () => Promise<{ success: boolean; message: string }>;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLocating: boolean;
}

const defaultJaipur: CityData = {
  id: "jaipur",
  name: "Jaipur",
  state: "Rajasthan",
  country: "India",
  description:
    "The Pink City of India, world-renowned for its majestic palaces, iconic forts, lively bazaars, and rich cultural heritage.",
  image:
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
  latitude: 26.9124,
  longitude: 75.7873,
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [currentCity, setCurrentCity] = useState<CityData>(defaultJaipur);
  const [availableCities, setAvailableCities] = useState<CityData[]>([defaultJaipur]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch("/api/cities");
        if (res.ok) {
          const cities: CityData[] = await res.json();
          if (cities && cities.length > 0) {
            setAvailableCities(cities);
            const savedCityId = typeof window !== "undefined" ? localStorage.getItem("muskan_city_id") : null;
            if (savedCityId) {
              const matched = cities.find((c) => c.id === savedCityId);
              if (matched) setCurrentCity(matched);
            } else {
              const jaipurFound = cities.find((c) => c.name.toLowerCase() === "jaipur");
              if (jaipurFound) setCurrentCity(jaipurFound);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    }
    loadCities();
  }, []);

  const selectCity = (city: CityData) => {
    setCurrentCity(city);
    if (typeof window !== "undefined") {
      localStorage.setItem("muskan_city_id", city.id);
      localStorage.setItem("muskan_city_name", city.name);
    }
    setIsLocationModalOpen(false);
  };

  const selectCityById = (id: string) => {
    const found = availableCities.find((c) => c.id === id);
    if (found) selectCity(found);
  };

  const detectBrowserLocation = async (): Promise<{ success: boolean; message: string }> => {
    if (!navigator.geolocation) {
      return { success: false, message: "Geolocation is not supported by your browser." };
    }

    setIsLocating(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          // Find nearest city among availableCities using Euclidean/haversine approximation
          let nearest = availableCities[0] || defaultJaipur;
          let minDistance = Infinity;

          for (const city of availableCities) {
            const dLat = city.latitude - userLat;
            const dLon = city.longitude - userLon;
            const dist = Math.sqrt(dLat * dLat + dLon * dLon);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = city;
            }
          }

          selectCity(nearest);
          resolve({
            success: true,
            message: `Detected nearest city: ${nearest.name} (${nearest.state})`,
          });
        },
        (error) => {
          setIsLocating(false);
          let msg = "Could not access location.";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "Location permission was denied. Please choose your city manually.";
          }
          resolve({ success: false, message: msg });
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  };

  return (
    <CityContext.Provider
      value={{
        currentCity,
        availableCities,
        selectCity,
        selectCityById,
        detectBrowserLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isLocating,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
