"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
type Review = { id: string; profile_id: string; author: string; content: string; rating: number };

export function TestimonialsClient({ profileId, initial }: { profileId: string; initial: Review[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initial);
  const [d, setD] = useState({ author: "", content: "", rating: 5 });
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ author: "", content: "", rating: 5 });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!d.author || !d.content || busy) return;
    setBusy(true);
    const { data, error } = await supabase.from("testimonials").insert({ profile_id: profileId, ...d }).select().single();
    setBusy(false);
    if (error) return;
    setItems([data, ...items]); setD({ author: "", content: "", rating: 5 });
  }
  async function remove(id: string) {
    setItems(items.filter((x) => x.id !== id));
    await supabase.from("testimonials").delete().eq("id", id);
  }
  function startEdit(r: Review) { setEditingId(r.id); setEdit({ author: r.author, content: r.content, rating: r.rating }); }
  async function saveEdit(id: string) {
    setBusy(true);
    const { error } = await supabase.from("testimonials").update(edit).eq("id", id);
    setBusy(false);
    if (error) return;
    setItems(items.map((x) => x.id === id ? { ...x, ...edit } : x));
    setEditingId(null);
  }

  return (
    <>
      <form onSubmit={add} className="card-light space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label-light">Auteur</label><input className="input-light" value={d.author} onChange={(e) => setD({ ...d, author: e.target.value })} /></div>
          <div>
            <label className="label-light">Note</label>
            <select className="input-light" value={d.rating} onChange={(e) => setD({ ...d, rating: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
        </div>
        <div><label className="label-light">Témoignage</label><textarea className="input-light min-h-[100px]" value={d.content} onChange={(e) => setD({ ...d, content: e.target.value })} /></div>
        <div className="flex justify-end"><button type="submit" disabled={busy} className="btn-primary">{busy ? "..." : "Ajouter"}</button></div>
      </form>
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((r) => (
          <li key={r.id} className="card-light">
            {editingId === r.id ? (
              <div className="space-y-2">
                <input className="input-light text-sm" placeholder="Auteur" value={edit.author} onChange={(e) => setEdit({ ...edit, author: e.target.value })} />
                <select className="input-light" value={edit.rating} onChange={(e) => setEdit({ ...edit, rating: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
                </select>
                <textarea className="input-light text-xs min-h-[60px]" placeholder="Témoignage" value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="btn-ghost text-xs">Annuler</button>
                  <button onClick={() => saveEdit(r.id)} disabled={busy} className="btn-primary text-xs">Enregistrer</button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-accent">{"★".repeat(r.rating)}<span className="text-gelap-200">{"★".repeat(5 - r.rating)}</span></div>
                <p className="mt-2 text-sm text-gelap-700">&ldquo;{r.content}&rdquo;</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs font-bold text-gelap">{r.author}</div>
                  <div className="flex gap-2">
                    <button title="Modifier" onClick={() => startEdit(r)} className="font-bold text-gelap-500 hover:text-brand-dark">✎</button>
                    <button onClick={() => remove(r.id)} className="btn-danger">×</button>
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
