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
    <div className="min-h-screen bg-gelap-soft flex flex-col md:flex-row">
      
      {/* 📱 ACCÈS RAPIDE MOBILE (S'affiche uniquement sur téléphone en haut) */}
      <div className="flex items-center justify-between border-b border-gelap-200 bg-gelap-100 px-6 py-4 md:hidden w-full sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-extrabold text-sm text-gelap">T</span>
          <span className="font-bold text-sm tracking-tight text-white">TrustOne</span>
        </Link>
        {/* Petit badge discret indiquant le profil connecté en haut sur mobile */}
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand">
          {profile.first_name ?? "Menu"}
        </span>
      </div>

      {/* 💻 SIDEBAR ORDINATEUR (Masquée par défaut sur mobile, s'affiche dès l'écran de l'ordinateur) */}
      <div className="hidden md:block md:w-64 md:shrink-0 bg-gelap border-r border-gelap-200">
        <DashboardSidebar
          username={profile.username}
          fullName={fullName}
          firstName={profile.first_name ?? "Vous"}
        />
      </div>

      {/* 🟢 CONTENU CENTRAL PRINCIPAL (Prend désormais 100 % de l'espace sur téléphone !) */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10 w-full bg-gelap-soft">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
}
