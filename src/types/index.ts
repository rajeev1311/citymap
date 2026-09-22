import { Role, ItemType } from "@prisma/client";

export type { Role, ItemType };

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  currentCityId?: string | null;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  country: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  _count?: {
    businesses: number;
    colleges: number;
    salons: number;
    cinemas: number;
    touristPlaces: number;
  };
}

export interface BusinessData {
  id: string;
  cityId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  image: string;
  rating: number;
  reviewCount: number;
  latitude?: number | null;
  longitude?: number | null;
  openingHours?: string | null;
  city?: CityData;
}

export interface CollegeData {
  id: string;
  cityId: string;
  name: string;
  type: string;
  description: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  image: string;
  rating: number;
  reviewCount: number;
  city?: CityData;
}

export interface SalonData {
  id: string;
  cityId: string;
  name: string;
  description: string;
  services: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  image: string;
  rating: number;
  reviewCount: number;
  openingHours?: string | null;
  city?: CityData;
}

export interface CinemaData {
  id: string;
  cityId: string;
  name: string;
  description: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  image: string;
  rating: number;
  reviewCount: number;
  facilities?: string | null;
  city?: CityData;
}

export interface TouristPlaceData {
  id: string;
  cityId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  rating: number;
  reviewCount: number;
  openingHours?: string | null;
  entryFee?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  city?: CityData;
}

export interface ReviewData {
  id: string;
  userId: string;
  itemType: ItemType;
  itemId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    role: Role;
  };
}

export interface SavedPlaceData {
  id: string;
  userId: string;
  itemType: ItemType;
  itemId: string;
  createdAt: string | Date;
  item?: {
    id: string;
    name: string;
    category?: string;
    type?: string;
    image: string;
    address: string;
    rating: number;
    reviewCount: number;
    url: string;
  };
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  city: string;
}
