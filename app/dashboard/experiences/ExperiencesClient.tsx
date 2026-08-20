"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/types";

type Draft = { position: string; company: string; description: string; start_date: string; end_date: string; ongoing: boolean };
const empty: Draft = { position: "", company: "", description: "", start_date: "", end_date: "", ongoing: false };

export function ExperiencesClient({ profileId, initial }: { profileId: string; initial: Experience[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState<Draft>(empty);
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!draft.position || !draft.company || busy) return;
    setBusy(true);
    const payload = { profile_id: profileId, position: draft.position, company: draft.company, description: draft.description || null,
      start_date: draft.start_date || null, end_date: draft.ongoing ? null : (draft.end_date || null) };
    const { data, error } = await supabase.from("experiences").insert(payload).select().single();
    setBusy(false);
    if (error) return;
    setItems([data, ...items]); setDraft(empty);
  }
  async function remove(id: string) {
    setItems(items.filter((x) => x.id !== id));
    await supabase.from("experiences").delete().eq("id", id);
  }

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); add(); }} className="card-light space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label-light">Poste</label><input className="input-light" value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} placeholder="Frontend Developer" /></div>
          <div><label className="label-light">Entreprise</label><input className="input-light" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} placeholder="TechCorp" /></div>
          <div><label className="label-light">Date de début</label><input type="date" className="input-light" value={draft.start_date} onChange={(e) => setDraft({ ...draft, start_date: e.target.value })} /></div>
          <div><label className="label-light">Date de fin</label><input type="date" className="input-light" disabled={draft.ongoing} value={draft.end_date} onChange={(e) => setDraft({ ...draft, end_date: e.target.value })} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gelap-700"><input type="checkbox" className="checkbox-brand" checked={draft.ongoing} onChange={(e) => setDraft({ ...draft, ongoing: e.target.checked })} /> En cours</label>
        <div><label className="label-light">Description</label><textarea className="input-light min-h-[100px]" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
        <div className="flex justify-end"><button type="submit" disabled={busy} className="btn-primary">{busy ? "Ajout..." : "Ajouter"}</button></div>
      </form>
      <ul className="mt-6 space-y-3">
        {items.map((e) => (
          <li key={e.id} className="card-light flex justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-gelap">{e.position} <span className="text-gelap-500 font-normal">· {e.company}</span></div>
              <div className="text-[11px] uppercase tracking-widest text-gelap-500 font-bold mt-1">
                {(e.start_date ?? "—").slice(0, 7)} → {e.end_date ? e.end_date.slice(0, 7) : "aujourd'hui"}
              </div>
              {e.description && <p className="mt-2 text-sm text-gelap-700 whitespace-pre-line">{e.description}</p>}
            </div>
            <button onClick={() => remove(e.id)} className="btn-danger self-start">Supprimer</button>
          </li>
        ))}
      </ul>
    </>
  );
}
