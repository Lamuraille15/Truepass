"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Education } from "@/lib/types";

export function EducationClient({ profileId, initial }: { profileId: string; initial: Education[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initial);
  const [d, setD] = useState({ school: "", degree: "", year: "" });
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ school: "", degree: "", year: "" });

  async function add() {
    if (!d.school || !d.degree || busy) return;
    setBusy(true);
    const { data, error } = await supabase.from("education").insert({ profile_id: profileId, ...d, year: d.year || null }).select().single();
    setBusy(false);
    if (error) return;
    setItems([data, ...items]); setD({ school: "", degree: "", year: "" });
  }
  async function remove(id: string) {
    setItems(items.filter((x) => x.id !== id));
    await supabase.from("education").delete().eq("id", id);
  }
  function startEdit(e: Education) { setEditingId(e.id); setEdit({ school: e.school, degree: e.degree, year: e.year ?? "" }); }
  async function saveEdit(id: string) {
    setBusy(true);
    const payload = { school: edit.school, degree: edit.degree, year: edit.year || null };
    const { error } = await supabase.from("education").update(payload).eq("id", id);
    setBusy(false);
    if (error) return;
    setItems(items.map((x) => x.id === id ? { ...x, ...payload } : x));
    setEditingId(null);
  }

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); add(); }} className="card-light grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="label-light">École</label><input className="input-light" value={d.school} onChange={(e) => setD({ ...d, school: e.target.value })} /></div>
        <div><label className="label-light">Diplôme</label><input className="input-light" value={d.degree} onChange={(e) => setD({ ...d, degree: e.target.value })} /></div>
        <div><label className="label-light">Année</label><input className="input-light" placeholder="2024" value={d.year} onChange={(e) => setD({ ...d, year: e.target.value })} /></div>
        <div className="md:col-span-3 flex justify-end"><button type="submit" disabled={busy} className="btn-primary">{busy ? "..." : "Ajouter"}</button></div>
      </form>
      <ul className="mt-6 grid gap-3">
        {items.map((e) => (
          <li key={e.id} className="card-light">
            {editingId === e.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className="label-light">École</label><input className="input-light" value={edit.school} onChange={(ev) => setEdit({ ...edit, school: ev.target.value })} /></div>
                <div><label className="label-light">Diplôme</label><input className="input-light" value={edit.degree} onChange={(ev) => setEdit({ ...edit, degree: ev.target.value })} /></div>
                <div><label className="label-light">Année</label><input className="input-light" value={edit.year} onChange={(ev) => setEdit({ ...edit, year: ev.target.value })} /></div>
                <div className="md:col-span-3 flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="btn-ghost text-xs">Annuler</button>
                  <button onClick={() => saveEdit(e.id)} disabled={busy} className="btn-primary text-xs">Enregistrer</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-gelap">{e.degree} <span className="text-gelap-500 font-normal">· {e.school}</span></div>
                  {e.year && <div className="text-[11px] uppercase tracking-widest text-gelap-500 font-bold mt-1">{e.year}</div>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
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
