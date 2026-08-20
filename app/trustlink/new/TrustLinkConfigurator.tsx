"use client";
import { useState } from "react";
import Link from "next/link";

type Props = { username: string; fullName: string; photoUrl: string | null; jobTitle: string | null };

const MODULES = [
  { key: "info",        label: "Informations de base",  desc: "Nom, photo, titre, localisation" },
  { key: "skills",      label: "Compétences",           desc: "Liste de vos savoir-faire" },
  { key: "projects",    label: "Projets",               desc: "Vos projets et réalisations" },
  { key: "experiences", label: "Expériences",           desc: "Votre parcours professionnel" },
  { key: "documents",   label: "Documents",             desc: "Diplômes, certificats, etc." },
  { key: "reviews",     label: "Avis et recommandations", desc: "Retours de vos clients" },
] as const;
type ModuleKey = typeof MODULES[number]["key"];

export function TrustLinkConfigurator({ username, fullName, photoUrl, jobTitle }: Props) {
  const [enabled, setEnabled] = useState<Record<ModuleKey, boolean>>({
    info: true, skills: true, projects: true, experiences: true, documents: false, reviews: false,
  });
  const [days, setDays] = useState<number>(30);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${username}`;

  async function generate() {
    setLoading(true);
    await fetch("/api/trustlink/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled, expires_in_days: days, password_protected: !!password }),
    });
    setLoading(false);
    setGenerated(true);
  }

  return (
    <div className="min-h-screen bg-gelap-soft p-6 lg:p-10">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gelap-400 font-bold">Configuration</p>
          <h1 className="text-3xl font-extrabold text-gelap">Créer mon TrustLink</h1>
          <p className="text-sm text-gelap-500 mt-1">Choisissez les informations que vous souhaitez partager.</p>
        </div>
        <Link href="/dashboard" className="btn-ghost text-xs">← Retour</Link>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche : configuration */}
        <section className="card-light space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-dark">Inclure dans le lien</h2>
            <ul className="mt-3 space-y-2">
              {MODULES.map((m) => (
                <li key={m.key} className="flex items-start gap-3 rounded-xl border border-gelap-line px-4 py-3 hover:border-brand/40 transition">
                  <input
                    type="checkbox"
                    className="checkbox-brand mt-1"
                    checked={enabled[m.key]}
                    onChange={(e) => setEnabled({ ...enabled, [m.key]: e.target.checked })}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gelap">{m.label}</div>
                    <div className="text-xs text-gelap-500">{m.desc}</div>
                  </div>
                  {enabled[m.key] && <span className="text-xs font-bold text-brand-dark">✓</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gelap-line pt-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-dark">Paramètres du lien</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-light">Expiration</label>
                <select className="input-light" value={days} onChange={(e) => setDays(Number(e.target.value))}>
                  <option value={7}>7 jours</option>
                  <option value={30}>30 jours</option>
                  <option value={90}>90 jours</option>
                  <option value={365}>1 an</option>
                  <option value={0}>Jamais</option>
                </select>
              </div>
              <div>
                <label className="label-light">Mot de passe (optionnel)</label>
                <input className="input-light" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </div>

          <button onClick={generate} disabled={loading || generated} className="btn-primary w-full py-3.5 text-base">
            {loading ? "Génération..." : generated ? "✓ TrustLink généré" : "Générer mon TrustLink"}
          </button>
        </section>

        {/* Colonne droite : aperçu smartphone */}
        <section className="card-light">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-4">Aperçu du lien</h2>
          <PhoneMockup fullName={fullName} jobTitle={jobTitle} photoUrl={photoUrl} enabled={enabled} url={url} />
        </section>
      </div>
    </div>
  );
}

function PhoneMockup({ fullName, jobTitle, photoUrl, enabled, url }: { fullName: string; jobTitle: string | null; photoUrl: string | null; enabled: Record<ModuleKey, boolean>; url: string }) {
  return (
    <div className="mx-auto max-w-[260px]">
      <div className="rounded-[32px] border-2 border-gelap-200 bg-gelap overflow-hidden shadow-card">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-[10px] text-gelap-400">
          <span className="font-bold">9:41</span>
          <span className="flex gap-1"><span>◐</span><span>▮▮▮</span></span>
        </div>
        <div className="px-4 pb-4 pt-2">
          <p className="text-[9px] uppercase tracking-widest text-brand font-bold">truepass · Aperçu</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-brand-50 text-brand-dark font-extrabold border-2 border-brand">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (fullName.charAt(0).toUpperCase())}
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">{fullName}</div>
              {jobTitle && <div className="text-[10px] text-gelap-300">{jobTitle}</div>}
            </div>
          </div>
          <ul className="mt-4 space-y-1">
            {MODULES.filter((m) => enabled[m.key]).map((m) => (
              <li key={m.key} className="text-[10px] text-gelap-300 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-brand" /> {m.label}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg bg-brand-50 px-2.5 py-1.5 text-center text-[10px] font-bold text-brand-dark">
            Voir mon profil public
          </div>
          <div className="mt-2 text-center text-[8px] text-gelap-500 truncate">{url}</div>
        </div>
      </div>
    </div>
  );
}
