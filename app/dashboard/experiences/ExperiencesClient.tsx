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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft>(empty);

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
  function startEdit(ex: Experience) {
    setEditingId(ex.id);
    setEdit({
      position: ex.position, company: ex.company, description: ex.description ?? "",
      start_date: ex.start_date ?? "", end_date: ex.end_date ?? "",
      ongoing: !ex.end_date && !!ex.start_date,
    });
  }
  async function saveEdit(id: string) {
    setBusy(true);
    const payload = {
      position: edit.position, company: edit.company, description: edit.description || null,
      start_date: edit.start_date || null, end_date: edit.ongoing ? null : (edit.end_date || null),
    };
    const { error } = await supabase.from("experiences").update(payload).eq("id", id);
    setBusy(false);
    if (error) return;
    setItems(items.map((x) => x.id === id ? { ...x, ...payload } : x));
    setEditingId(null);
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
          <li key={e.id} className="card-light">
            {editingId === e.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="label-light">Poste</label><input className="input-light" value={edit.position} onChange={(ev) => setEdit({ ...edit, position: ev.target.value })} /></div>
                  <div><label className="label-light">Entreprise</label><input className="input-light" value={edit.company} onChange={(ev) => setEdit({ ...edit, company: ev.target.value })} /></div>
                  <div><label className="label-light">Date de début</label><input type="date" className="input-light" value={edit.start_date} onChange={(ev) => setEdit({ ...edit, start_date: ev.target.value })} /></div>
                  <div><label className="label-light">Date de fin</label><input type="date" className="input-light" disabled={edit.ongoing} value={edit.end_date} onChange={(ev) => setEdit({ ...edit, end_date: ev.target.value })} /></div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gelap-700"><input type="checkbox" className="checkbox-brand" checked={edit.ongoing} onChange={(ev) => setEdit({ ...edit, ongoing: ev.target.checked })} /> En cours</label>
                <div><label className="label-light">Description</label><textarea className="input-light min-h-[100px]" value={edit.description} onChange={(ev) => setEdit({ ...edit, description: ev.target.value })} /></div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="btn-ghost text-xs">Annuler</button>
                  <button onClick={() => saveEdit(e.id)} disabled={busy} className="btn-primary text-xs">Enregistrer</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gelap">{e.position} <span className="text-gelap-500 font-normal">· {e.company}</span></div>
                  <div className="text-[11px] uppercase tracking-widest text-gelap-500 font-bold mt-1">
                    {(e.start_date ?? "—").slice(0, 7)} → {e.end_date ? e.end_date.slice(0, 7) : "aujourd'hui"}
                  </div>
                  {e.description && <p className="mt-2 text-sm text-gelap-700 whitespace-pre-line">{e.description}</p>}
                </div>
                <div className="flex flex-col gap-2 self-start">
                  <button onClick={() => startEdit(e)} className="btn-ghost text-xs">Modifier</button>
                  <button onClick={() => remove(e.id)} className="btn-danger">Supprimer</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
