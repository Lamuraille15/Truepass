import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gelap text-white">
      <header className="border-b border-gelap-200 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand">
            <span className="font-extrabold text-2xl text-gelap">T</span>
          </span>
          <div>
            <div className="text-xl font-bold tracking-tight">TRUEPASS</div>
            <div className="text-xs text-gelap-500">Votre identité. Votre confiance.</div>
          </div>
        </Link>
      </header>

      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-white">
          One Link.{" "}
          <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
            Trusted Identity.
          </span>
        </h1>
        <p className="mt-8 text-base md:text-lg text-gelap-400 leading-relaxed">
          Permettre à chacun de prouver qui il est, ce qu&apos;il sait faire
          et ce qui l&apos;a accompli, en gardant le contrôle total de ses
          données.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-brand px-7 py-3 text-base font-semibold text-gelap transition hover:bg-brand-light">
            Créer mon TrustLink
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-xl border border-gelap-300 bg-transparent px-7 py-3 text-base font-semibold text-white transition hover:border-brand hover:text-brand">
            Se connecter
          </Link>
        </div>
      </section>

      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          Notre mission
        </div>
        <p className="mt-4 text-xl md:text-2xl font-medium text-white/90 leading-relaxed">
          « Permettre à chacun de prouver qui il est, ce qu&apos;il sait faire
          et ce qui l&apos;a accompli, en gardant le contrôle total de ses
          données. »
        </p>
      </section>

      <section className="px-6 py-10 max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          Choisissez votre langue
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { l: "Français",  active: true },
            { l: "English",   active: false },
            { l: "Español",   active: false },
            { l: "Português", active: false },
            { l: "العربية",   active: false },
          ].map((x) => (
            <button key={x.l} type="button"
              className={
                "px-4 py-2 rounded-full border text-sm font-semibold transition " +
                (x.active
                  ? "bg-brand text-gelap border-brand"
                  : "border-gelap-300 text-white hover:border-brand hover:text-brand")
              }
            >
              {x.l}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          Couleurs
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          {[
            { label: "Brand",   hex: "#10B981" },
            { label: "Accent",  hex: "#EC4899" },
            { label: "Dark",    hex: "#0a0a0a" },
            { label: "Light",   hex: "#F4F4F5" },
            { label: "Gray",    hex: "#737373" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <span className="h-10 w-10 rounded-lg border border-gelap-300" style={{ background: c.hex }} />
              <div className="text-xs">
                <div className="font-semibold text-white">{c.label}</div>
                <div className="text-gelap-500 font-mono">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          Typographie
        </div>
        <div className="mt-4 rounded-2xl border border-gelap-200 bg-gelap-100 p-8">
          <div className="text-7xl font-extrabold leading-none text-white">Aa</div>
          <div className="mt-4 text-3xl font-semibold text-white">Poppins</div>
          <div className="mt-2 text-xs text-gelap-500 font-mono">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789
          </div>
        </div>
      </section>

      <footer className="border-t border-gelap-200 px-6 py-10 flex justify-center">
        <div className="rounded-2xl bg-gelap-100 border border-gelap-200 p-6 flex items-center gap-4 max-w-2xl">
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
