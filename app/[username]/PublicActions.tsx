"use client";
import { useState } from "react";
import Link from "next/link";

export function PublicActions({ username, fullName }: { username: string; fullName: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    const url = `${window.location.origin}/${username}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt("Copie ce lien :", url); }
  }
  async function share() {
    const url = `${window.location.origin}/${username}`;
    const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> };
    if (nav.share) {
      try { await nav.share({ title: `${fullName} — truepass`, text: "Découvre mon profil truepass", url }); return; } catch {}
    }
    copy();
  }
  return (
    <div className="no-print mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-gelap-line px-5 py-4 shadow-card mt-6">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand"><span className="font-extrabold text-xl text-gelap">T</span></span>
        <div className="leading-tight">
          <div className="font-bold text-gelap text-sm">truepass</div>
          <code className="rounded bg-gelap-soft px-1.5 py-0.5 font-mono text-[10px] text-gelap-500">/{username}</code>
        </div>
      </Link>
      <div className="flex flex-wrap gap-2">
        <button onClick={copy} className="btn-ghost text-xs">{copied ? "✓ Copié" : "Copier"}</button>
        <button onClick={share} className="btn-ghost text-xs">Partager</button>
        <button onClick={() => window.print()} className="btn-soft text-xs">Télécharger le CV (PDF)</button>
        <a href={`mailto:?subject=${encodeURIComponent("Contact depuis truepass — " + fullName)}`} className="btn-primary text-xs">Contacter</a>
      </div>
    </div>
  );
}
