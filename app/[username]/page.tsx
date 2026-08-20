import { notFound } from "next/navigation";
import Link from "next/link";
import { createServer } from "@/lib/supabase/server";
import { PublicActions } from "./PublicActions";
import { PrintButton } from "./PrintButton";
import type { Metadata } from "next";
import type { PublicProfile } from "@/lib/types";

type Params = { params: Promise<{ username: string }> };

async function loadProfile(username: string): Promise<PublicProfile | null> {
  const supabase = await createServer();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!profile) return null;
  const [skills, experiences, education, projects, reviews] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id),
    supabase.from("experiences").select("*").eq("profile_id", profile.id),
    supabase.from("education").select("*").eq("profile_id", profile.id),
    supabase.from("projects").select("*").eq("profile_id", profile.id),
    supabase.from("testimonials").select("*").eq("profile_id", profile.id),
  ]);
  return {
    ...(profile as PublicProfile),
    skills: skills.data ?? [],
    experiences: experiences.data ?? [],
    education: education.data ?? [],
    projects: projects.data ?? [],
    reviews: reviews.data ?? [],
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) return { title: "Profil introuvable — truepass" };
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || profile.username;
  return { title: `${fullName} — truepass`, description: profile.bio ?? fullName };
}

export default async function PublicProfilePage({ params }: Params) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || profile.username;
  const init = (profile.first_name ?? profile.username).charAt(0).toUpperCase();
  const reviews = profile.reviews ?? [];

  return (
    <main className="min-h-screen bg-gelap-soft">
      <PublicActions username={profile.username} fullName={fullName} />

      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white border border-gelap-line shadow-card mt-4">
        {/* Cadran supérieur Premium Sombre */}
        <header className="bg-gelap-surface text-white px-6 pt-8 pb-6 md:px-10 border-b border-brand/30">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-gelap font-extrabold">T</span>
              <span className="font-bold text-sm">truepass</span>
              <span className="ml-2 text-[10px] uppercase tracking-widest text-gelap-400">· Profil public</span>
            </Link>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-brand/20 border-2 border-brand text-white text-4xl font-extrabold">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (init)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{fullName}</h1>
              {profile.job_title && <p className="mt-1 text-lg font-medium text-gelap-300">{profile.job_title}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gelap-300">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.linkedin && <Link href={profile.linkedin} target="_blank" className="hover:text-brand transition">in/LinkedIn</Link>}
                {profile.github && <Link href={profile.github} target="_blank" className="hover:text-brand transition">GitHub</Link>}
              </div>
              {profile.bio && <p className="mt-4 max-w-2xl text-[15px] text-gelap-200 leading-relaxed whitespace-pre-line">{profile.bio}</p>}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`mailto:?subject=${encodeURIComponent("Contact truepass — " + fullName)}`}
               className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark">
              Contacter
            </a>
            <PrintButton />
          </div>
        </header>

        {/* Cadran inférieur Clair */}
        <div className="px-6 py-10 md:px-10 space-y-10 bg-white">
          {/* Compétences */}
          {profile.skills.length > 0 && (
            <Section title="Compétences" subtitle="Domaines d'expertise">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s.id} className="inline-flex items-center rounded-xl bg-gelap-soft px-3 py-1.5 text-sm font-bold text-gelap">
                    {s.skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Expérience condensée */}
          {profile.experiences.length > 0 && (
            <Section title="Expérience" subtitle="Parcours">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-gelap-soft p-4">
                  <div className="text-2xl font-extrabold text-gelap">{profile.experiences.length}+</div>
                  <div className="text-xs uppercase tracking-widest text-gelap-500 font-bold mt-1">Années d'expérience</div>
                </div>
                <div className="rounded-xl bg-gelap-soft p-4">
                  <div className="text-2xl font-extrabold text-gelap">{profile.projects.length}</div>
                  <div className="text-xs uppercase tracking-widest text-gelap-500 font-bold mt-1">Projets menés</div>
                </div>
                <div className="rounded-xl bg-gelap-soft p-4">
                  <div className="text-sm font-bold text-gelap">Disponible pour de nouvelles missions</div>
                  <div className="text-xs text-gelap-500 mt-1">Réponse en moins de 24h</div>
                </div>
              </div>
              <ul className="mt-6 space-y-4">
                {profile.experiences.map((e) => (
                  <li key={e.id} className="grid grid-cols-[120px_1fr] gap-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-gelap-500">{fmtRange(e.start_date, e.end_date)}</div>
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

          {/* Projets récents */}
          {profile.projects.length > 0 && (
            <Section title="Projets récents" subtitle="Réalisations">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {profile.projects.map((p) => (
                  <li key={p.id} className="rounded-2xl border border-gelap-line overflow-hidden bg-white shadow-soft">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="h-28 w-full object-cover" />
                    ) : (
                      <div className="h-28 w-full bg-gradient-to-br from-brand to-accent" />
                    )}
                    <div className="p-4">
                      <div className="text-sm font-extrabold text-gelap">{p.title}</div>
                      {p.description && <p className="mt-1 text-xs text-gelap-600 line-clamp-2">{p.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Avis des clients */}
          {reviews.length > 0 && (
            <Section title="Avis des clients" subtitle="Recommandations vérifiées">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-2xl border border-gelap-line p-5 bg-white">
                    <div className="text-accent">{"★".repeat(r.rating)}<span className="text-gelap-200">{"★".repeat(5 - r.rating)}</span></div>
                    <p className="mt-2 text-sm text-gelap-700 leading-relaxed">&ldquo;{r.content}&rdquo;</p>
                    <div className="mt-3 text-xs font-bold text-gelap">{r.author}</div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <footer className="border-t border-gelap-line bg-gelap-soft px-6 py-5 text-center">
          <p className="text-xs text-gelap-500">
            Propulsé par <span className="font-bold text-brand-dark">truepass</span> · One Link. Trusted Identity.
          </p>
        </footer>
      </article>
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-extrabold uppercase tracking-widest text-gelap">{title}</h2>
        <span className="text-[10px] uppercase tracking-widest text-gelap-400 font-bold">{subtitle}</span>
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
