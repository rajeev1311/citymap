import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation required"),
    cityId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ReviewSchema = z.object({
  itemType: z.enum(["BUSINESS", "COLLEGE", "SALON", "CINEMA", "TOURIST_PLACE"]),
  itemId: z.string().min(1, "Item ID is required"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
});

export const SavedPlaceSchema = z.object({
  itemType: z.enum(["BUSINESS", "COLLEGE", "SALON", "CINEMA", "TOURIST_PLACE"]),
  itemId: z.string().min(1, "Item ID is required"),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.string().url().or(z.string().length(0)).optional(),
  currentCityId: z.string().optional(),
});

export const CitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("India"),
  description: z.string().min(10, "Description is required"),
  image: z.string().url("Must be a valid image URL"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export const BusinessSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  name: z.string().min(2, "Name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  image: z.string().url("Must be a valid image URL"),
  openingHours: z.string().optional(),
});

export const CollegeSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  name: z.string().min(2, "Name is required"),
  type: z.string().min(2, "Type is required"),
  description: z.string().min(10, "Description is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  image: z.string().url("Must be a valid image URL"),
});

export const SalonSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  services: z.string().min(3, "Services list is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  image: z.string().url("Must be a valid image URL"),
  openingHours: z.string().optional(),
});

export const CinemaSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  image: z.string().url("Must be a valid image URL"),
  facilities: z.string().optional(),
});

export const TouristPlaceSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  name: z.string().min(2, "Name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description is required"),
  address: z.string().min(5, "Address is required"),
  image: z.string().url("Must be a valid image URL"),
  openingHours: z.string().optional(),
  entryFee: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});
