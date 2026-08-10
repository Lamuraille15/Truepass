"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/lib/types";

export function SkillsClient({ profileId, initial }: { profileId: string; initial: Skill[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Skill[]>(initial);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add() {
    const v = value.trim();
    if (!v) return;
    setError(null);
    setSaving(true);
    const { data, error } = await supabase
      .from("skills").insert({ profile_id: profileId, skill: v }).select().single();
    setSaving(false);
    if (error) { setError(error.message); return; }
    if (data) setItems([data, ...items]);
    setValue("");
  }

  async function remove(id: string) {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("skills").delete().eq("id", id);
  }

  return (
    <div className="card space-y-6">
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="ex. Marketing, Développement web..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        />
        <button onClick={add} disabled={saving} className="btn-primary">Ajouter</button>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <ul className="flex flex-wrap gap-2">
        {items.length === 0 && <li className="text-sm text-navy/50">Aucune compétence pour l'instant.</li>}
        {items.map((s) => (
          <li key={s.id} className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-navy/5 px-3 py-1 text-sm text-navy">
            {s.skill}
            <button onClick={() => remove(s.id)} className="text-navy/40 hover:text-red-600" aria-label="Supprimer">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
