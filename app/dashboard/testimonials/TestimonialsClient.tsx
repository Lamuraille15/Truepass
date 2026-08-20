"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
type Review = { id: string; profile_id: string; author: string; content: string; rating: number };

export function TestimonialsClient({ profileId, initial }: { profileId: string; initial: Review[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initial);
  const [d, setD] = useState({ author: "", content: "", rating: 5 });
  const [busy, setBusy] = useState(false);

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
            <div className="text-accent">{"★".repeat(r.rating)}<span className="text-gelap-200">{"★".repeat(5 - r.rating)}</span></div>
            <p className="mt-2 text-sm text-gelap-700">&ldquo;{r.content}&rdquo;</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs font-bold text-gelap">{r.author}</div>
              <button onClick={() => remove(r.id)} className="btn-danger">×</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
