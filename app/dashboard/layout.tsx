"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gelap text-white antialiased md:flex">
      
      {/* 📱 HEADER MOBILE (Visible uniquement sur téléphone) */}
      <div className="flex items-center justify-between border-b border-gelap-200 bg-gelap-100 px-6 py-4 md:hidden w-full sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-extrabold text-sm text-gelap">T</span>
          <span className="font-bold text-sm tracking-tight text-white">TrustOne</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="rounded-xl border border-gelap-200 bg-gelap text-brand p-2 hover:bg-gelap-200 transition"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 💻 SIDEBAR (Ordinateur fixe + Tiroir Mobile coulissant) */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gelap transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}
      `}>
        {/* On ferme le tiroir quand on clique sur un lien sur mobile */}
        <DashboardSidebar onLinkClick={() => setIsOpen(false)} />
      </div>

      {/* 🟢 CONTENU CENTRAL PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 md:h-screen md:overflow-y-auto bg-gelap">
        {children}
      </main>

      {/* Arrière-plan semi-transparent pour fermer le menu en cliquant à côté */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
