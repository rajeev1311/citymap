"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Store,
  GraduationCap,
  Sparkles,
  Clapperboard,
  Compass,
  MessageSquare,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Cities", href: "/admin/cities", icon: MapPin },
    { name: "Businesses", href: "/admin/businesses", icon: Store },
    { name: "Colleges", href: "/admin/colleges", icon: GraduationCap },
    { name: "Salons", href: "/admin/salons", icon: Sparkles },
    { name: "Cinemas", href: "/admin/cinemas", icon: Clapperboard },
    { name: "Tourist Places", href: "/admin/tourist-places", icon: Compass },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar mb-6">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? "bg-[#101827] dark:bg-[#F3A6C8] text-white dark:text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
