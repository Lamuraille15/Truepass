"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

type Form = { title: string; description: string; url: string };
const empty = (): Form => ({ title: "", description: "", url: "" });

export function ProjectsClient({ profileId, initial }: { profileId: string; initial: Project[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Project[]>(initial);
  const [form, setForm] = useState<Form>(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function uploadImage(file: File) {
    const ext = file.name.split(".").pop();
    const path = `${profileId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (upErr) { setError("Échec upload : " + upErr.message); return; }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
  }

  async function save() {
    if (!form.title.trim()) { setError("Le nom du projet est requis."); return; }
    setSaving(true); setError(null);
    const payload = {
      profile_id: profileId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      url: form.url.trim() || null,
      image_url: imageUrl,
    };
    if (editing) {
      const { data, error } = await supabase.from("projects").update(payload).eq("id", editing).select().single();
      setSaving(false);
      if (error) { setError(error.message); return; }
      if (data) setItems(items.map((i) => (i.id === editing ? data : i)));
      setEditing(null);
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      setSaving(false);
      if (error) { setError(error.message); return; }
      if (data) setItems([data, ...items]);
    }
    setForm(empty()); setImageUrl(null);
  }

  async function remove(id: string) {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("projects").delete().eq("id", id);
  }

  function startEdit(p: Project) {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description ?? "", url: p.url ?? "" });
    setImageUrl(p.image_url ?? null);
  }

  return (
    <div className="space-y-8">
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-navy">{editing ? "Modifier" : "Ajouter"} un projet</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><label className="label">Nom</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Lien (optionnel)</label><input className="input" placeholder="https://" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="label">Image (optionnel)</label>
          <div className="flex items-center gap-3">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
            <button type="button" className="btn-ghost py-2 text-xs" onClick={() => fileRef.current?.click()}>Choisir une image</button>
            {imageUrl && <button type="button" className="btn-ghost py-2 text-xs" onClick={() => setImageUrl(null)}>Retirer</button>}
          </div>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-2">
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty()); setImageUrl(null); }} className="btn-ghost">Annuler</button>}
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Ajouter"}</button>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.length === 0 && <li className="text-sm text-navy/50">Aucun projet.</li>}
        {items.map((p) => (
          <li key={p.id} className="card space-y-2">
            {p.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt="" className="h-32 w-full rounded-md object-cover" />
            )}
            <div className="text-base font-semibold text-navy">{p.title}</div>
            {p.description && <p className="text-sm text-navy/80 whitespace-pre-line">{p.description}</p>}
            {p.url && <a className="text-xs font-semibold text-gold-dark hover:underline" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
            <div className="flex gap-2 pt-2">
              <button onClick={() => startEdit(p)} className="btn-ghost py-1.5 text-xs">Modifier</button>
              <button onClick={() => remove(p.id)} className="btn-ghost py-1.5 text-xs hover:border-red-300 hover:text-red-700">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
