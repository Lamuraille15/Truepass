"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Education } from "@/lib/types";

type Form = { school: string; degree: string; year: string };
const empty = (): Form => ({ school: "", degree: "", year: "" });

export function EducationClient({ profileId, initial }: { profileId: string; initial: Education[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Education[]>(initial);
  const [form, setForm] = useState<Form>(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!form.school.trim() || !form.degree.trim()) { setError("École et diplôme sont requis."); return; }
    setSaving(true);
    setError(null);
    const payload = { profile_id: profileId, school: form.school.trim(), degree: form.degree.trim(), year: form.year.trim() || null };
    if (editing) {
      const { data, error } = await supabase.from("education").update(payload).eq("id", editing).select().single();
      setSaving(false);
      if (error) { setError(error.message); return; }
      if (data) setItems(items.map((i) => (i.id === editing ? data : i)));
      setEditing(null);
    } else {
      const { data, error } = await supabase.from("education").insert(payload).select().single();
      setSaving(false);
      if (error) { setError(error.message); return; }
      if (data) setItems([data, ...items]);
    }
    setForm(empty());
  }

  async function remove(id: string) {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("education").delete().eq("id", id);
  }

  function startEdit(e: Education) {
    setEditing(e.id);
    setForm({ school: e.school, degree: e.degree, year: e.year ?? "" });
  }

  return (
    <div className="space-y-8">
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-navy">{editing ? "Modifier" : "Ajouter"} un diplôme</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div><label className="label">Établissement</label><input className="input" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} /></div>
          <div><label className="label">Diplôme</label><input className="input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
          <div><label className="label">Année</label><input className="input" placeholder="ex. 2022" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></div>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-2">
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty()); }} className="btn-ghost">Annuler</button>}
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Ajouter"}</button>
        </div>
      </div>
      <ul className="space-y-3">
        {items.length === 0 && <li className="text-sm text-navy/50">Aucun diplôme.</li>}
        {items.map((e) => (
          <li key={e.id} className="card flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-navy">{e.degree}</div>
              <div className="text-xs text-navy/60">{e.school}{e.year ? ` · ${e.year}` : ""}</div>
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
