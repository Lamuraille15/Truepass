import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/[0.04] via-white to-white" />
      <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark">
          TruePass MVP
        </span>
        <h1 className="font-serif text-5xl font-bold tracking-tight text-navy md:text-6xl">
          One Link.{" "}
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Trusted Identity.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-navy/70">
          Ton identité professionnelle en un seul lien. Crée ton TrustLink,
          partage-le, et présente ton passeport numérique à un recruteur,
          un client ou un partenaire.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/signup" className="btn-gold text-base">
            Créer mon TrustLink
          </Link>
          <Link href="/login" className="btn-ghost text-base">
            Se connecter
          </Link>
        </div>
        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            { t: "1. Crée ton profil", d: "Photo, titre, bio, localisation en quelques secondes." },
            { t: "2. Ajoute ton parcours", d: "Compétences, expériences, diplômes, projets." },
            { t: "3. Partage ton TrustLink", d: "Un lien unique, public, copiable et imprimable." },
          ].map((s) => (
            <div key={s.t} className="card">
              <div className="text-sm font-semibold text-gold-dark">{s.t}</div>
              <div className="mt-2 text-navy/80">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
