"use client";

import { useState } from "react";
import Link from "next/link";

export function PublicActions({ username, fullName }: { username: string; fullName: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/${username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copie ce lien :", url);
    }
  }

  async function share() {
    const url = `${window.location.origin}/${username}`;
    const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({
          title: `${fullName} — TruePass`,
          text: "Découvre mon profil TruePass",
          url,
        });
        return;
      } catch {
        /* utilisateur a annulé */
      }
    }
    copy();
  }

  const contactSubject = encodeURIComponent(`Contact depuis TruePass — ${fullName}`);

  return (
    <div className="no-print mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-gelap-line px-4 py-3 shadow-soft">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand">
          <span className="font-extrabold text-lg text-white">T</span>
        </span>
        <span className="font-bold text-gelap">TruePass</span>
        <code className="ml-3 hidden md:inline rounded bg-gelap-soft px-2 py-0.5 font-mono text-xs text-gelap-500">
          /{username}
        </code>
      </Link>
      <div className="flex flex-wrap gap-2">
        <button onClick={copy} className="btn-ghost py-2 text-xs">
          {copied ? "✓ Copié" : "Copier"}
        </button>
        <button onClick={share} className="btn-ghost py-2 text-xs">
          Partager
        </button>
        <button onClick={() => window.print()} className="btn-soft py-2 text-xs">
          Télécharger le CV (PDF)
        </button>
        <a href={`mailto:?subject=${contactSubject}`} className="btn-primary py-2 text-xs">
          Contacter
        </a>
      </div>
    </div>
  );
}
