"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/lib/types";

export function SkillsClient({ profileId, initial }: { profileId: string; initial: Skill[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initial);
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  async function add() {
    const v = val.trim(); if (!v || busy) return;
    setBusy(true);
    const { data, error } = await supabase.from("skills").insert({ profile_id: profileId, skill: v }).select().single();
    setBusy(false);
    if (error) return;
    setItems([...items, data]);
    setVal("");
  }
  async function remove(id: string) {
    setItems(items.filter((x) => x.id !== id));
    await supabase.from("skills").delete().eq("id", id);
  }
  function startEdit(s: Skill) { setEditingId(s.id); setEditVal(s.skill); }
  async function saveEdit(id: string) {
    const v = editVal.trim(); if (!v) return;
    setBusy(true);
    const { error } = await supabase.from("skills").update({ skill: v }).eq("id", id);
    setBusy(false);
    if (error) return;
    setItems(items.map((x) => x.id === id ? { ...x, skill: v } : x));
    setEditingId(null);
  }

  return (
    <div className="card-light">
      <div className="flex gap-2">
        <input className="input-light" placeholder="ex: React, Figma, Marketing" value={val}
          onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button onClick={add} disabled={busy || !val.trim()} className="btn-primary">Ajouter</button>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {items.length === 0 ? <li className="text-sm text-gelap-400">Aucune compétence ajoutée.</li> :
          items.map((s) => (
            <li key={s.id} className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-dark">
              {editingId === s.id ? (
                <>
                  <input autoFocus className="rounded-md bg-white px-2 py-0.5 text-sm font-bold text-gelap outline-none ring-2 ring-brand" value={editVal} onChange={(e) => setEditVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(s.id)} />
                  <button onClick={() => saveEdit(s.id)} className="text-brand-dark">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-gelap-500">×</button>
                </>
              ) : (
                <>
                  {s.skill}
                  <button title="Modifier" onClick={() => startEdit(s)} className="font-bold text-gelap-500 hover:text-brand-dark">✎</button>
                  <button onClick={() => remove(s.id)} className="font-bold text-gelap-500 hover:text-red-600">×</button>
                </>
              )}
            </li>
          ))
        }
      </ul>
    </div>
  );
}
