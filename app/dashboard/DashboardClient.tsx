"use client";

import Link from "next/link";
import type { Education, Experience, Project, Skill } from "@/lib/types";
import { CompletenessDonut } from "@/components/CompletenessDonut";

type Props = {
  username: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    job_title: string | null;
    bio: string | null;
    location: string | null;
    photo_url: string | null;
  };
  completeness: number;
  initial: {
    skills: Skill[];
    experiences: Experience[];
    education: Education[];
    projects: Project[];
  };
};

export function DashboardClient({ username, profile, completeness, initial }: Props) {
  const stats = [
    { label: "Projets réalisés", value: initial.projects.length },
    { label: "Années d'expérience", value: "+" + Math.max(0, initial.experiences.length - 1) },
    { label: "Compétences", value: initial.skills.length },
    { label: "Diplômes", value: initial.education.length },
  ];

  const sections = [
    { key: "info_base",      label: "Informations de base",  done: !!(profile.first_name && profile.job_title && profile.bio && profile.location) },
    { key: "skills",         label: "Compétences",           done: initial.skills.length > 0 },
    { key: "experiences",    label: "Expériences",           done: initial.experiences.length > 0 },
    { key: "projects",       label: "Projets",               done: initial.projects.length > 0 },
    { key: "education",      label: "Diplômes",              done: initial.education.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <section className="card-light flex flex-col md:flex-row gap-6 md:items-center">
        <CompletenessDonut value={completeness} />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-gelap-400 font-semibold">Complétude du profil</p>
          <h2 className="mt-1 text-2xl font-bold text-gelap">
            {profile.first_name ?? "Complète ton"} {profile.last_name ?? "profil"}
          </h2>
          {profile.job_title && <p className="mt-1 text-gelap-500">{profile.job_title}{profile.location ? ` · 📍 ${profile.location}` : ""}</p>}
          {profile.bio && <p className="mt-3 text-sm text-gelap-700 leading-relaxed line-clamp-3">{profile.bio}</p>}
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/profile" className="btn-primary text-xs">Modifier le profil</Link>
            <Link href={`/${username}`} target="_blank" className="btn-ghost text-xs">Aperçu du lien</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card-light text-center">
            <div className="text-3xl font-extrabold text-gelap">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-gelap-500 font-semibold">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="card-light">
        <p className="text-xs uppercase tracking-widest text-gelap-400 font-semibold mb-3">Sections complétées</p>
        <ul className="space-y-2">
          {sections.map((s) => (
            <li key={s.key} className="flex items-center justify-between rounded-xl bg-gelap-soft px-4 py-3">
              <span className="flex items-center gap-3">
                <span className={"grid h-6 w-6 place-items-center rounded-full " + (s.done ? "bg-brand text-white" : "bg-gelap-line text-gelap-400")}>
                  {s.done ? "✓" : ""}
                </span>
                <span className="text-sm font-semibold text-gelap">{s.label}</span>
              </span>
              <Link href={`/dashboard/${s.key === "info_base" ? "profile" : s.key}`} className="text-xs font-semibold text-brand-dark hover:underline">
                {s.done ? "Modifier" : "Compléter →"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
