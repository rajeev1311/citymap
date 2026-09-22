import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CityProvider } from "@/context/CityContext";
import AppShell from "@/components/layout/AppShell";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MUSKAN • Your City • Your Vibe | Discover Jaipur & Top Destinations",
  description:
    "Discover Jaipur's majestic palaces, popular cafes, top colleges, luxury salons, and cinema halls. Your ultimate city discovery companion.",
  keywords: [
    "Jaipur",
    "Pink City",
    "Tourist Places",
    "Amber Fort",
    "Hawa Mahal",
    "City Discovery",
    "Muskan",
  ],
  openGraph: {
    title: "MUSKAN • Your City • Your Vibe",
    description: "Explore Jaipur's finest landmarks, cafes, colleges, and entertainment.",
    siteName: "Muskan City Discovery",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Jaipur - Amber Fort",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${playfairFont.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased bg-[#FAF8F8] dark:bg-[#0B0F17]">
        <AuthProvider>
          <CityProvider>
            <AppShell>{children}</AppShell>
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
