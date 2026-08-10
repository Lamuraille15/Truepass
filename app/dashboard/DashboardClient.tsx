"use client";

import Link from "next/link";
import type {
  Education,
  Experience,
  Project,
  Skill,
} from "@/lib/types";

type Props = {
  profileId: string;
  username: string;
  initial: {
    skills: Skill[];
    experiences: Experience[];
    education: Education[];
    projects: Project[];
  };
};

export function DashboardClient({ profileId, username, initial }: Props) {
  const trustUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/${username}`;

  return (
    <div className="space-y-8">
      <section className="card">
        <h2 className="text-lg font-semibold text-navy">Mon TrustLink</h2>
        <p className="mt-1 text-sm text-navy/60">
          Lien unique et public de ton passeport numérique.
        </p>
        <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 truncate rounded-md bg-navy/5 px-3 py-2 font-mono text-sm text-navy">
            /{username}
          </code>
          <Link href={`/${username}`} target="_blank" className="btn-gold py-2 text-xs">
            Ouvrir la page publique
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Compétences"
          count={initial.skills.length}
          href="/dashboard/skills"
          hint="Marketing, dev, design..."
        />
        <SummaryCard
          label="Expériences"
          count={initial.experiences.length}
          href="/dashboard/experiences"
          hint="Poste, entreprise, dates"
        />
        <SummaryCard
          label="Diplômes"
          count={initial.education.length}
          href="/dashboard/education"
          hint="École, diplôme, année"
        />
        <SummaryCard
          label="Projets"
          count={initial.projects.length}
          href="/dashboard/projects"
          hint="Réalisations et liens"
        />
      </section>

      <section className="card">
        <h3 className="text-base font-semibold text-navy">Conseil</h3>
        <p className="mt-2 text-sm text-navy/70">
          Plus ton profil est renseigné, plus ton TrustLink inspire confiance. Commence par
          la photo, le titre et la bio dans « Mon Profil », puis ajoute au moins une
          expérience et trois compétences.
        </p>
      </section>
      {/* silence unused */}
      <span className="hidden">{profileId}{trustUrl}</span>
    </div>
  );
}

function SummaryCard({
  label,
  count,
  href,
  hint,
}: {
  label: string;
  count: number;
  href: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="card flex flex-col gap-1 transition hover:border-gold/40 hover:shadow-md"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
        {label}
      </span>
      <span className="text-2xl font-bold text-navy">{count}</span>
      <span className="text-xs text-navy/60">{hint}</span>
    </Link>
  );
}
