"use client";

import { useState } from "react";

export function PublicActions({ username, emailFallback }: { username: string; emailFallback: string }) {
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
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: { title: string; text: string; url: string }) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (data: { title: string; text: string; url: string }) => Promise<void> }).share({
          title: "Mon TrustLink",
          text: "Découvre mon profil TruePass",
          url,
        });
        return;
      } catch { /* user-cancelled */ }
    }
    copy();
  }

  function downloadCV() {
    window.print();
  }

  return (
    <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-white p-3 shadow-sm">
      <div className="text-sm text-navy/70">
        TrustLink : <code className="rounded bg-navy/5 px-1.5 py-0.5 font-mono text-navy">/{username}</code>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={copy} className="btn-ghost py-2 text-xs">{copied ? "Lien copié ✓" : "Copier le lien"}</button>
        <button onClick={share} className="btn-ghost py-2 text-xs">Partager</button>
        <button onClick={downloadCV} className="btn-gold py-2 text-xs">Télécharger le CV (PDF)</button>
        <a href={emailFallback} className="btn-primary py-2 text-xs">Contacter</a>
      </div>
    </div>
  );
}
