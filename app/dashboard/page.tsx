import Link from "next/link";
import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, first_name, job_title, photo_url")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-navy">Profil introuvable. Reconnecte-toi.</p>
      </main>
    );
  }

  const [skills, experiences, education, projects] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("experiences").select("*").eq("profile_id", profile.id).order("start_date", { ascending: false }),
    supabase.from("education").select("*").eq("profile_id", profile.id).order("year", { ascending: false }),
    supabase.from("projects").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-gold font-serif text-lg">
              T
            </span>
            <span className="text-lg font-semibold text-navy">TruePass</span>
          </Link>
          <span className="text-navy/30">·</span>
          <span className="text-sm text-navy/60">
            Bonjour {profile.first_name ?? "à toi"} 👋
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${profile.username}`} target="_blank" className="btn-ghost py-2 text-xs">
            Voir mon TrustLink ↗
          </Link>
          <LogoutButton />
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2">
        {[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/profile", label: "Mon Profil" },
          { href: "/dashboard/skills", label: "Compétences" },
          { href: "/dashboard/experiences", label: "Expériences" },
          { href: "/dashboard/education", label: "Diplômes" },
          { href: "/dashboard/projects", label: "Projets" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-medium text-navy/80 hover:bg-navy/5">
            {l.label}
          </Link>
        ))}
      </nav>

      <main className="mt-8">
        <DashboardClient
          profileId={profile.id}
          username={profile.username}
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
