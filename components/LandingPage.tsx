import Link from "next/link";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-gelap text-white">
      {/* TOP BAR */}
      <header className="border-b border-gelap-100 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand shadow-card">
              <span className="font-extrabold text-2xl text-gelap">T</span>
            </span>
            <div>
              <div className="text-xl font-bold tracking-tight">truepass</div>
              <div className="text-[11px] text-gelap-400">Votre identité. Votre confiance.</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:inline-flex btn-ghost text-xs border-gelap-300 text-white hover:border-brand hover:text-brand">
              Se connecter
            </Link>
            <Link href="/signup" className="btn-primary text-xs">
              Créer mon TrustLink
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 pt-24 pb-20 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
          One Link.{" "}
          <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
            Trusted Identity.
          </span>
        </h1>
        <p className="mt-10 text-base md:text-xl text-gelap-300 leading-relaxed">
          Ton identité professionnelle en un seul lien. Crée ton TrustLink,
          partage-le, et présente ton passeport numérique à un recruteur,
          un client ou un partenaire.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary text-base px-7 py-3.5">
            Créer mon TrustLink
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-xl border-2 border-gelap-300 bg-transparent px-7 py-3.5 text-base font-bold text-white transition hover:border-brand hover:text-brand">
            Se connecter
          </Link>
        </div>
      </section>

      {/* NOTRE MISSION */}
      <section className="px-6 py-14 max-w-4xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-bold">Notre mission</div>
        <p className="mt-4 text-2xl md:text-3xl font-semibold text-white/95 leading-snug">
          « Permettre à chacun de prouver qui il est, ce qu&apos;il sait faire
          et ce qu&apos;il a accompli, en gardant le contrôle total de ses
          données. »
        </p>
      </section>

      {/* POURQUOI truepass */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-bold text-center">Pourquoi truepass ?</div>
        <h2 className="mt-3 text-center text-3xl md:text-4xl font-extrabold text-white">4 piliers, 1 seul lien</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "✅", title: "Contrôle total",   desc: "Vous décidez exactement ce que les autres voient." },
            { icon: "🔒", title: "Partage sécurisé", desc: "Vos liens sont sécurisés et peuvent expirer à tout moment." },
            { icon: "🌟", title: "Gagnez la confiance", desc: "Montrez vos compétences et réalisations de manière professionnelle." },
            { icon: "🔗", title: "Un seul lien",     desc: "Remplacez des dizaines de fichiers et d'e-mails." },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl border border-gelap-100 bg-gelap-50 p-6 text-left">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/15 text-2xl">{p.icon}</span>
              <div className="mt-4 font-bold text-white">{p.title}</div>
              <p className="mt-1 text-sm text-gelap-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SÉCURITÉ */}
      <footer className="border-t border-gelap-100 px-6 py-12 flex justify-center">
        <div className="rounded-2xl bg-gelap-50 border border-gelap-100 p-6 flex items-center gap-4 max-w-2xl">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-gelap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <div>
            <div className="font-bold text-white">Sécurisé. Vérifié. Contrôle par vous.</div>
            <div className="text-sm text-gelap-400">
              Vos données vous appartiennent et vous décidez qui peut les voir.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
