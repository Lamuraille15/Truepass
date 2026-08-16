"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard",            label: "Vue d'ensemble",     icon: "🏠" },
  { href: "/dashboard/profile",    label: "Profil",             icon: "👤" },
  { href: "/dashboard/skills",     label: "Compétences",        icon: "🧠" },
  { href: "/dashboard/projects",   label: "Projets",            icon: "💼" },
  { href: "/dashboard/experiences",label: "Expériences",        icon: "📈" },
  { href: "/dashboard/education",  label: "Diplômes",           icon: "🎓" },
];

export function DashboardSidebar({ username, fullName, firstName }: { username: string; fullName: string; firstName: string }) {
  const path = usePathname();
  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-gelap-line bg-white p-6">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand">
          <span className="font-extrabold text-xl text-white">T</span>
        </span>
        <div>
          <div className="text-base font-bold tracking-tight text-gelap">TRUEPASS</div>
          <div className="text-[10px] text-gelap-500">Votre identité. Votre confiance.</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {items.map((it) => {
          const active = path === it.href;
          return (
            <Link key={it.href} href={it.href} className={active ? "nav-item-active" : "nav-item"}>
              <span className="text-base">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl bg-gelap-soft p-4">
        <p className="text-xs text-gelap-500">Ton TrustLink</p>
        <Link href={`/${username}`} target="_blank" className="mt-1 block font-mono text-sm text-gelap hover:text-brand truncate">
          /{username}
        </Link>
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 rounded-xl bg-brand-50 px-3 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white font-bold">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className="text-xs">
            <div className="font-bold text-gelap">{fullName}</div>
            <div className="text-gelap-500">Profil validé ✓</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
