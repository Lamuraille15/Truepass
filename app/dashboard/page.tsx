import Link from "next/link";
import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, first_name, last_name, job_title, photo_url, phone, website, linkedin, github, bio, location, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) {
    return <main className="p-12">Profil introuvable.</main>;
  }

  const [skills, experiences, education, projects] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id),
    supabase.from("experiences").select("*").eq("profile_id", profile.id),
    supabase.from("education").select("*").eq("profile_id", profile.id),
    supabase.from("projects").select("*").eq("profile_id", profile.id),
  ]);

  // Calcul du pourcentage de complétude (juste indicatif)
  const fields = [
    profile.first_name, profile.last_name, profile.job_title, profile.bio,
    profile.location, profile.photo_url, profile.phone, profile.website,
  ];
  const filled = fields.filter(Boolean).length;
  const completeness = Math.round((filled / fields.length) * 100);

  return (
    <div className="flex min-h-screen bg-gelap-soft">
      <DashboardSidebar username={profile.username} fullName={profile.first_name ?? "Vous"} firstName={profile.first_name ?? "—"} />

      <main className="flex-1 p-6 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-gelap-400 font-semibold">Tableau de bord</p>
            <h1 className="text-3xl font-bold text-gelap">
              Bonjour {profile.first_name ?? "à toi"} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${profile.username}`} target="_blank" className="btn-ghost text-xs">
              Voir mon TrustLink ↗
            </Link>
            <LogoutButton />
          </div>
        </header>

        <DashboardClient
          username={profile.username}
          profile={profile}
          completeness={completeness}
          initial={{
            skills: skills.data ?? [],
            experiences: experiences.data ?? [],
            education: education.data ?? [],
            projects: projects.data ?? [],
          }}
        />
      </main>
    </div>
  );
}
