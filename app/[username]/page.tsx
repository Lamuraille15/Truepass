import Link from "next/link";
import { notFound } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { PublicActions } from "./PublicActions";
import type { Metadata } from "next";
import type { PublicProfile } from "@/lib/types";

type Params = { params: Promise<{ username: string }> };

async function loadProfile(username: string): Promise<PublicProfile | null> {
  const supabase = await createServer();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!profile) return null;
  const [skills, experiences, education, projects] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id),
    supabase.from("experiences").select("*").eq("profile_id", profile.id),
    supabase.from("education").select("*").eq("profile_id", profile.id),
    supabase.from("projects").select("*").eq("profile_id", profile.id),
  ]);
  return {
    ...(profile as PublicProfile),
    skills: skills.data ?? [],
    experiences: experiences.data ?? [],
    education: education.data ?? [],
    projects: projects.data ?? [],
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) return { title: "Profil introuvable — TruePass" };
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || profile.username;
  return { title: `${fullName} — TruePass`, description: profile.bio ?? `${fullName}` };
}

export default async function PublicProfilePage({ params }: Params) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || profile.username;
  const init = (profile.first_name ?? profile.username).charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-gelap-soft py-8 px-4">
      <PublicActions username={profile.username} fullName={fullName} />

      <article className="print-area mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white border border-gelap-line shadow-soft">
        <header className="flex flex-col gap-6 px-6 pt-8 pb-6 md:flex-row md:items-center md:px-10 md:pt-10 border-b border-gelap-line">
          <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-50 text-brand-dark">
            {profile.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl font-extrabold">{init}</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-brand-dark font-bold">TruePass · Profil public</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-gelap">{fullName}</h1>
            {profile.job_title && <p className="mt-1 text-lg font-medium text-gelap-700">{profile.job_title}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gelap-500">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.phone && <a className="hover:text-brand-dark" href={`tel:${profile.phone}`}>📞 {profile.phone}</a>}
              {profile.website && <a className="hover:text-brand-dark" href={profile.website} target="_blank" rel="noreferrer">🌐 Site</a>}
              {profile.linkedin && <a className="hover:text-brand-dark" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {profile.github && <a className="hover:text-brand-dark" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
            {profile.bio && <p className="mt-4 max-w-2xl text-[15px] text-gelap-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>}
          </div>
        </header>

        <div className="px-6 py-8 md:px-10 space-y-8">
          {profile.skills.length > 0 && (
            <Section title="Compétences" subtitle="Domaines d'expertise">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s.id} className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-dark">{s.skill}</span>
                ))}
              </div>
            </Section>
          )}

          {profile.experiences.length > 0 && (
            <Section title="Expérience" subtitle="Parcours professionnel">
              <ul className="space-y-6">
                {profile.experiences.map((e) => (
                  <li key={e.id} className="grid grid-cols-[110px_1fr] gap-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gelap-500">{fmtRange(e.start_date, e.end_date)}</div>
                    <div>
                      <div className="text-base font-bold text-gelap">{e.position}</div>
                      <div className="text-sm text-gelap-500">{e.company}</div>
                      {e.description && <p className="mt-2 text-sm text-gelap-700 whitespace-pre-line">{e.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {profile.education.length > 0 && (
            <Section title="Diplômes" subtitle="Formation académique">
              <ul className="grid gap-4 md:grid-cols-2">
                {profile.education.map((e) => (
                  <li key={e.id} className="rounded-xl bg-gelap-soft p-4">
                    <div className="text-base font-bold text-gelap">{e.degree}</div>
                    <div className="text-sm text-gelap-500">{e.school}{e.year ? ` · ${e.year}` : ""}</div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {profile.projects.length > 0 && (
            <Section title="Projets récents" subtitle="Réalisations marquantes">
              <ul className="grid gap-4 md:grid-cols-2">
                {profile.projects.map((p) => (
                  <li key={p.id} className="rounded-xl border border-gelap-line overflow-hidden bg-white">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="h-32 w-full object-cover" />
                    )}
                    <div className="p-4">
                      <div className="text-base font-bold text-gelap">{p.title}</div>
                      {p.description && <p className="mt-1 text-sm text-gelap-700 whitespace-pre-line">{p.description}</p>}
                      {p.url && <a className="mt-2 inline-block text-xs font-semibold text-brand-dark hover:underline" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <footer className="border-t border-gelap-line bg-gelap-soft px-6 py-5 text-center">
          <p className="text-xs text-gelap-500">
            Propulsé par <span className="font-bold text-brand-dark">TruePass</span> · One Link. Trusted Identity.
          </p>
        </footer>
      </article>
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gelap">{title}</h2>
        <span className="text-[10px] uppercase tracking-widest text-gelap-400">{subtitle}</span>
      </div>
      {children}
    </section>
  );
}

function fmtRange(start: string | null, end: string | null) {
  const s = start ? fmtMonth(start) : "—";
  const e = end ? fmtMonth(end) : "aujourd'hui";
  return `${s} → ${e}`;
}
function fmtMonth(v: string) {
  const [y, m] = v.split("-");
  if (!y || !m) return v;
  return `${m}/${y}`;
}
