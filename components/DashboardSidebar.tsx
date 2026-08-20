"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Les 8 onglets du sidebar (symétrie avec la maquette truepass)
const items = [
  { href: "/dashboard",           label: "Vue d'ensemble",       icon: "🏠" },
  { href: "/dashboard/profile",   label: "Profil",               icon: "👤" },
  { href: "/dashboard/skills",    label: "Compétences",          icon: "🧠" },
  { href: "/dashboard/projects",  label: "Projets",              icon: "💼" },
  { href: "/dashboard/experiences",label: "Expériences",         icon: "📈" },
  { href: "/dashboard/education", label: "Documents",            icon: "📄" },
  { href: "/dashboard/testimonials",label: "Avis et recommandations", icon: "⭐" },
  { href: "/dashboard/settings",  label: "Paramètres",           icon: "⚙️" },
];

export function DashboardSidebar({ username, fullName, firstName }: { username: string; fullName: string; firstName: string }) {
  const path = usePathname();
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-gelap p-6 text-white">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand">
          <span className="font-extrabold text-xl text-gelap">T</span>
        </span>
        <div>
          <div className="text-base font-bold tracking-tight">truepass</div>
          <div className="text-[10px] text-gelap-400">Votre identité.</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {items.map((it) => {
          const active = path === it.href;
          return (
            <Link key={it.href} href={it.href} className={
              active
                ? "flex items-center gap-3 rounded-xl bg-brand/15 px-4 py-2.5 text-sm font-bold text-brand ring-1 ring-brand/30"
                : "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gelap-300 transition hover:bg-gelap-50 hover:text-white"
            }>
              <span className="text-base">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl bg-gelap-50 p-4 border border-gelap-100">
        <p className="text-[10px] uppercase tracking-widest text-gelap-400 font-bold">Ton TrustLink</p>
        <Link href={`/${username}`} target="_blank" className="mt-1 block font-mono text-sm text-white hover:text-brand truncate">
          /{username}
        </Link>
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 rounded-xl bg-gelap-50 px-3 py-2.5 border border-gelap-100">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-gelap font-bold">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className="text-xs">
            <div className="font-bold text-white">{fullName}</div>
            <div className="text-gelap-400">Profil validé ✓</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
