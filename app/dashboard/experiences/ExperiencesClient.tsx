"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/types";

type Form = { position: string; company: string; description: string; start_date: string; end_date: string };
const empty = (): Form => ({ position: "", company: "", description: "", start_date: "", end_date: "" });

export function ExperiencesClient({ profileId, initial }: { profileId: string; initial: Experience[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Experience[]>(initial);
  const [form, setForm] = useState<Form>(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!form.position.trim() || !form.company.trim()) {
      setError("Poste et entreprise sont requis.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      profile_id: profileId,
      position: form.position.trim(),
      company: form.company.trim(),
      description: form.description.trim() || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };
    if (editing) {
      const { data, error } = await supabase.from("experiences").update(payload).eq("id", editing).select().single();
      setSaving(false);
      if (error) { setError(error.message); return; }
      if (data) setItems(items.map((i) => (i.id === editing ? data : i)));
      setEditing(null);
    } else {
      const { data, error } = await supabase.from("experiences").insert(payload).select().single();
      setSaving(false);
      if (error) { setError(error.message); return; }
      if (data) setItems([data, ...items]);
    }
    setForm(empty());
  }

  async function remove(id: string) {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("experiences").delete().eq("id", id);
  }

  function startEdit(e: Experience) {
    setEditing(e.id);
    setForm({
      position: e.position,
      company: e.company,
      description: e.description ?? "",
      start_date: e.start_date ?? "",
      end_date: e.end_date ?? "",
    });
  }

  return (
    <div className="space-y-8">
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-navy">{editing ? "Modifier" : "Ajouter"} une expérience</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><label className="label">Poste</label><input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
          <div><label className="label">Entreprise</label><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          <div><label className="label">Début</label><input type="month" className="input" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
          <div><label className="label">Fin (vide si en poste)</label><input type="month" className="input" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-2">
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty()); }} className="btn-ghost">Annuler</button>}
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Ajouter"}</button>
        </div>
      </div>

      <ul className="space-y-3">
        {items.length === 0 && <li className="text-sm text-navy/50">Aucune expérience.</li>}
        {items.map((e) => (
          <li key={e.id} className="card flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-base font-semibold text-navy">{e.position} <span className="text-navy/40">·</span> {e.company}</div>
              <div className="text-xs text-navy/60">{fmtRange(e.start_date, e.end_date)}</div>
              {e.description && <p className="mt-2 text-sm text-navy/80 whitespace-pre-line">{e.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(e)} className="btn-ghost py-1.5 text-xs">Modifier</button>
              <button onClick={() => remove(e.id)} className="btn-ghost py-1.5 text-xs hover:border-red-300 hover:text-red-700">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function fmtRange(start: string | null, end: string | null) {
  const s = start ? fmtMonth(start) : "—";
  const e = end ? fmtMonth(end) : "aujourd'hui";
  return `${s} → ${e}`;
}
function fmtMonth(v: string) {
  const [y, m] = v.split("-");
  if (!y || !m) return v;
  return `${m}/${y}`;
}
