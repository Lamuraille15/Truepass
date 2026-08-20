"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Education } from "@/lib/types";

export function EducationClient({ profileId, initial }: { profileId: string; initial: Education[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initial);
  const [d, setD] = useState({ school: "", degree: "", year: "" });
  const [busy, setBusy] = useState(false);

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
          <li key={e.id} className="card-light flex justify-between">
            <div>
              <div className="text-sm font-bold text-gelap">{e.degree} <span className="text-gelap-500 font-normal">· {e.school}</span></div>
              {e.year && <div className="text-[11px] uppercase tracking-widest text-gelap-500 font-bold mt-1">{e.year}</div>}
            </div>
            <button onClick={() => remove(e.id)} className="btn-danger">Supprimer</button>
          </li>
        ))}
      </ul>
    </>
  );
}
