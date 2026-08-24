import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) redirect("/dashboard/profile");

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() ||
    profile.username;

  return (
    <div className="min-h-screen bg-gelap-soft flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* 📱 HEADER MOBILE (S'affiche uniquement en haut sur téléphone) */}
      <div className="flex items-center justify-between border-b border-gelap-200 bg-gelap-100 px-6 py-4 md:hidden w-full sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-extrabold text-sm text-gelap">T</span>
          <span className="font-bold text-sm tracking-tight text-white">TrustOne</span>
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand">
          {profile.first_name ?? "Étudiant"}
        </span>
      </div>

      {/* 💻 SIDEBAR ORDINATEUR (Visible uniquement sur grand écran) */}
      <div className="hidden md:block md:w-64 md:shrink-0 bg-gelap border-r border-gelap-200">
        <DashboardSidebar
          username={profile.username}
          fullName={fullName}
          firstName={profile.first_name ?? "Vous"}
        />
      </div>

      {/* 🟢 CONTENU CENTRAL PRINCIPAL (Prend 100 % de l'espace sur téléphone) */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10 w-full bg-gelap-soft">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* 📱 BARRE DE NAVIGATION BASSE MOBILE (Fixée en bas de l'écran sur téléphone) */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-gelap-100 border-t border-gelap-200 py-2 px-4 flex items-center justify-around md:hidden shadow-lg backdrop-blur-md bg-opacity-95">
        
        {/* Bouton Accueil / Vue d'ensemble */}
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gelap-400 hover:text-brand transition">
          <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          <span className="text-[9px] font-bold">Accueil</span>
        </Link>

        {/* Bouton Profil */}
        <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-gelap-400 hover:text-brand transition">
          <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[9px] font-bold">Profil</span>
        </Link>

        {/* Bouton Compétences */}
        <Link href="/dashboard/skills" className="flex flex-col items-center gap-1 text-gelap-400 hover:text-brand transition">
          <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path></svg>
          <span className="text-[9px] font-bold">Compétences</span>
        </Link>

        {/* Bouton Expériences */}
        <Link href="/dashboard/experiences" className="flex flex-col items-center gap-1 text-gelap-400 hover:text-brand transition">
          <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <span className="text-[9px] font-bold">Parcours</span>
        </Link>

        {/* Bouton Projets */}
        <Link href="/dashboard/projects" className="flex flex-col items-center gap-1 text-gelap-400 hover:text-brand transition">
          <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span className="text-[9px] font-bold">Projets</span>
        </Link>

      </nav>

    </div>
  );
}
