"use client";

import React, { useState } from "react";
import DesktopSidebar from "./DesktopSidebar";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import CitySelectorModal from "@/components/common/CitySelectorModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF8F8] dark:bg-[#0B0F17] transition-colors text-slate-900 dark:text-slate-100">
      {/* Desktop Left Sidebar */}
      <DesktopSidebar />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </div>

      {/* Global City Switcher Modal */}
      <CitySelectorModal />
    </div>
  );
}
