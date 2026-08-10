import { notFound } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { PublicActions } from "./PublicActions";
import type { Metadata } from "next";
import type { PublicProfile } from "@/lib/types";

type Params = { params: Promise<{ username: string }> };

async function loadProfile(username: string): Promise<PublicProfile | null> {
  const supabase = await createServer();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!profile) return null;
  const [skills, experiences, education, projects] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("experiences").select("*").eq("profile_id", profile.id).order("start_date", { ascending: false }),
    supabase.from("education").select("*").eq("profile_id", profile.id).order("year", { ascending: false }),
    supabase.from("projects").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false }),
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
  return {
    title: `${fullName} — TruePass`,
    description: profile.bio ?? `${fullName} · ${profile.job_title ?? "Passeport professionnel"}`,
  };
}

export default async function PublicProfilePage({ params }: Params) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || profile.username;
  const contactMail = `mailto:?subject=${encodeURIComponent(`Contact depuis TruePass — ${fullName}`)}`;
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PublicActions username={profile.username} emailFallback={contactMail} />
      <div className="print-area card mt-2">
        <header className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-navy/10 text-navy/40">
            {profile.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold">{profile.username.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-navy">{fullName}</h1>
            {profile.job_title && <p className="mt-1 text-base font-medium text-gold-dark">{profile.job_title}</p>}
            {profile.location && <p className="mt-1 text-sm text-navy/60">📍 {profile.location}</p>}
            {profile.bio && <p className="mt-3 max-w-2xl text-[15px] text-navy/80 whitespace-pre-line">{profile.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-navy/70">
              {profile.phone && <a className="hover:underline" href={`tel:${profile.phone}`}>📞 {profile.phone}</a>}
              {profile.website && <a className="hover:underline" href={profile.website} target="_blank" rel="noreferrer">🌐 Site</a>}
              {profile.linkedin && <a className="hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {profile.github && <a className="hover:underline" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
          </div>
        </header>

        {profile.skills.length > 0 && (
          <Section title="Compétences">
            <ul className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <li key={s.id} className="inline-flex items-center rounded-full border border-navy/15 bg-navy/5 px-3 py-1 text-sm text-navy">{s.skill}</li>
              ))}
            </ul>
          </Section>
        )}

        {profile.experiences.length > 0 && (
          <Section title="Expériences">
            <ul className="space-y-4">
              {profile.experiences.map((e) => (
                <li key={e.id}>
                  <div className="text-base font-semibold text-navy">{e.position} <span className="text-navy/40">·</span> {e.company}</div>
                  <div className="text-xs text-navy/60">{fmtRange(e.start_date, e.end_date)}</div>
                  {e.description && <p className="mt-2 text-sm text-navy/80 whitespace-pre-line">{e.description}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {profile.education.length > 0 && (
          <Section title="Diplômes">
            <ul className="space-y-3">
              {profile.education.map((e) => (
                <li key={e.id}>
                  <div className="text-base font-semibold text-navy">{e.degree}</div>
                  <div className="text-xs text-navy/60">{e.school}{e.year ? ` · ${e.year}` : ""}</div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {profile.projects.length > 0 && (
          <Section title="Projets">
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {profile.projects.map((p) => (
                <li key={p.id} className="rounded-lg border border-navy/10 p-4">
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" className="mb-3 h-32 w-full rounded-md object-cover" />
                  )}
                  <div className="text-base font-semibold text-navy">{p.title}</div>
                  {p.description && <p className="mt-1 text-sm text-navy/80 whitespace-pre-line">{p.description}</p>}
                  {p.url && <a className="mt-2 inline-block text-xs font-semibold text-gold-dark hover:underline" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <footer className="mt-8 border-t border-navy/10 pt-4 text-center text-xs text-navy/50">
          Créé avec <a href="/" className="font-semibold text-gold-dark hover:underline">TruePass</a> · One Link. Trusted Identity.
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">{title}</h2>
      <div className="mt-3">{children}</div>
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
