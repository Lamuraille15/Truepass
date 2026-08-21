"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

export function ProjectsClient({ profileId, initial }: { profileId: string; initial: Project[] }) {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial);
  const [d, setD] = useState({ title: "", description: "", url: "" });
  const [busy, setBusy] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ title: "", description: "", url: "" });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!d.title || busy) return;
    setBusy(true);
    const { data, error } = await supabase.from("projects").insert({
      profile_id: profileId, title: d.title,
      description: d.description || null, url: d.url || null, image_url: null,
    }).select().single();
    setBusy(false);
    if (error) return;
    setItems([data, ...items]); setD({ title: "", description: "", url: "" });
  }

  function pickImage(id: string) {
    setUploadTarget(id);          // ← FIX : mémorise la cible AVANT de click()
    fileRef.current?.click();
  }

  async function uploadCover(file: File) {
    if (!uploadTarget) return;
    const target = uploadTarget;
    const ext = file.name.split(".").pop();
    const path = `${profileId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (error) { setUploadTarget(null); return; }
    const { data: pub } = supabase.storage.from("project-images").getPublicUrl(path);
    await supabase.from("projects").update({ image_url: pub.publicUrl }).eq("id", target);
    setItems((prev) => prev.map((x) => x.id === target ? { ...x, image_url: pub.publicUrl } : x));
    setUploadTarget(null);
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setEdit({ title: p.title, description: p.description ?? "", url: p.url ?? "" });
  }
  async function saveEdit(id: string) {
    setBusy(true);
    const payload = { title: edit.title, description: edit.description || null, url: edit.url || null };
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    setBusy(false);
    if (error) return;
    setItems((prev) => prev.map((x) => x.id === id ? { ...x, ...payload } : x));
    setEditingId(null);
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("projects").delete().eq("id", id);
  }

  return (
    <>
      <form onSubmit={add} className="card-light space-y-4">
        <div><label className="label-light">Titre</label><input className="input-light" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} /></div>
        <div><label className="label-light">Description</label><textarea className="input-light min-h-[100px]" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} /></div>
        <div><label className="label-light">Lien (optionnel)</label><input className="input-light" value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} /></div>
        <div className="flex justify-end"><button type="submit" disabled={busy} className="btn-primary">{busy ? "..." : "Ajouter"}</button></div>
      </form>

      {/* UN SEUL input file caché — lit uploadTarget au moment du onChange */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }} />

      <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((p) => (
          <li key={p.id} className="card-light">
            <div className="h-32 -mx-6 -mt-6 mb-3 rounded-t-2xl bg-gradient-to-br from-brand to-accent overflow-hidden">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            {editingId === p.id ? (
              <div className="space-y-2">
                <input className="input-light text-sm" placeholder="Titre" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
                <textarea className="input-light text-xs min-h-[70px]" placeholder="Description" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
                <input className="input-light text-sm" placeholder="Lien" value={edit.url} onChange={(e) => setEdit({ ...edit, url: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="btn-ghost text-xs">Annuler</button>
                  <button onClick={() => saveEdit(p.id)} disabled={busy} className="btn-primary text-xs">Enregistrer</button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm font-bold text-gelap">{p.title}</div>
                {p.description && <p className="mt-1 text-xs text-gelap-600 line-clamp-3">{p.description}</p>}
                {p.url && <a href={p.url} target="_blank" className="mt-1 inline-block text-[11px] text-brand-dark hover:underline truncate max-w-full">{p.url}</a>}
                <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs">
                  <button type="button" onClick={() => pickImage(p.id)} className="btn-soft text-[11px]">{p.image_url ? "Changer l'image" : "Ajouter une image"}</button>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(p)} className="text-gelap-700 font-bold hover:text-brand-dark">Modifier</button>
                    <button onClick={() => remove(p.id)} className="text-red-600 font-bold">Supprimer</button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
