import Link from "next/link";
import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DonutProgress } from "@/components/DonutProgress";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return <main className="p-12">Profil introuvable.</main>;

  const [skills, experiences, education, projects, recent] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id),
    supabase.from("experiences").select("*").eq("profile_id", profile.id),
    supabase.from("education").select("*").eq("profile_id", profile.id),
    supabase.from("projects").select("*").eq("profile_id", profile.id),
    supabase.from("activity_log").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const fields = [profile.first_name, profile.job_title, profile.bio, profile.location, profile.photo_url, profile.phone];
  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || profile.username;

  return (
    <div className="flex min-h-screen bg-gelap-soft">
      <DashboardSidebar username={profile.username} fullName={fullName} firstName={profile.first_name ?? "Vous"} />

      <main className="flex-1 p-6 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gelap-400 font-bold">Tableau de bord</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gelap">Bonjour {profile.first_name ?? "à toi"} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${profile.username}`} target="_blank" className="btn-primary text-xs">Voir mon TrustLink ↗</Link>
            <LogoutButton />
          </div>
        </header>

        {/* Carte Complétude : Donut à droite, photo à gauche */}
        <section className="card-light flex flex-col md:flex-row items-center gap-8 mb-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-gelap-200 text-white text-3xl font-extrabold border-4 border-white shadow-soft">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                (profile.first_name ?? profile.username).charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-brand-dark font-bold">Complétude du profil</p>
              <h2 className="mt-1 text-2xl font-extrabold text-gelap">{fullName}</h2>
              {profile.job_title && <p className="mt-1 text-gelap-500">{profile.job_title}</p>}
              {profile.location && <p className="text-xs text-gelap-400">📍 {profile.location}</p>}
              {profile.bio && <p className="mt-3 text-sm text-gelap-700 leading-relaxed line-clamp-2">{profile.bio}</p>}
              <div className="mt-4 flex gap-2 flex-wrap">
                <Link href="/dashboard/profile" className="btn-primary text-xs">Modifier le profil</Link>
                <Link href="/trustlink/new" className="btn-soft text-xs">Configurer mon TrustLink</Link>
              </div>
            </div>
          </div>
          <DonutProgress value={completeness} />
        </section>

        {/* 4 cartes statistiques */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Projets réalisés", value: projects.data?.length ?? 0 },
            { label: "Années d'expérience", value: experiences.data?.length ?? 0 },
            { label: "Compétences", value: skills.data?.length ?? 0 },
            { label: "Diplômes", value: education.data?.length ?? 0 },
          ].map((s) => (
            <div key={s.label} className="card-light text-center">
              <div className="text-3xl font-extrabold text-gelap">{s.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-gelap-500 font-bold">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Activité récente */}
        <section className="card-light">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest text-gelap-500 font-bold">Activité récente</h3>
            <Link href="#" className="text-xs font-bold text-brand-dark hover:underline">Voir toute l'activité</Link>
          </div>
          <ul className="divide-y divide-gelap-line">
            {(recent.data ?? []).length === 0 ? (
              <li className="py-6 text-center text-sm text-gelap-400">Aucune activité récente.</li>
            ) : (
              recent.data!.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between">
                  <span className="text-sm text-gelap-700">{a.label ?? "Action"}</span>
                  <span className="text-xs text-gelap-400">{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
