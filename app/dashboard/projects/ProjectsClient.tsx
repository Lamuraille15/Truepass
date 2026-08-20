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
  async function uploadCover(id: string, file: File) {
    const ext = file.name.split(".").pop();
    const path = `${profileId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (error) return;
    const { data: pub } = supabase.storage.from("project-images").getPublicUrl(path);
    await supabase.from("projects").update({ image_url: pub.publicUrl }).eq("id", id);
    setItems(items.map((x) => x.id === id ? { ...x, image_url: pub.publicUrl } : x));
  }
  async function remove(id: string) {
    setItems(items.filter((x) => x.id !== id));
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
      <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((p) => (
          <li key={p.id} className="card-light">
            <div className="h-32 -mx-6 -mt-6 mb-3 rounded-t-2xl bg-gradient-to-br from-brand to-accent overflow-hidden">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="text-sm font-bold text-gelap">{p.title}</div>
            {p.description && <p className="mt-1 text-xs text-gelap-600 line-clamp-3">{p.description}</p>}
            <div className="mt-3 flex justify-between text-xs">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(p.id, f); }} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-soft text-[11px]">Ajouter une image</button>
              <button onClick={() => remove(p.id)} className="text-red-600 font-bold">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
