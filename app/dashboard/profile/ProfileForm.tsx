"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { normalizeUsername, isReservedUsername } from "@/lib/username";

type Props = { profile: Profile; email: string };

export function ProfileForm({ profile, email }: Props) {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    username: profile.username,
    job_title: profile.job_title ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    phone: profile.phone ?? "",
    website: profile.website ?? "",
    linkedin: profile.linkedin ?? "",
    github: profile.github ?? "",
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(profile.photo_url);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadPhoto(file: File) {
    const ext = file.name.split(".").pop();
    const path = `${profile.user_id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setError("Échec upload : " + upErr.message); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    await supabase.from("profiles").update({ photo_url: data.publicUrl }).eq("id", profile.id);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null); setError(null);
    const cleanUsername = normalizeUsername(form.username);
    if (!cleanUsername || cleanUsername.length < 3) { setError("Le nom d'utilisateur doit contenir au moins 3 caractères."); return; }
    if (isReservedUsername(cleanUsername)) { setError("Ce nom d'utilisateur est réservé."); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      username: cleanUsername,
      job_title: form.job_title || null,
      bio: form.bio || null,
      location: form.location || null,
      phone: form.phone || null,
      website: form.website || null,
      linkedin: form.linkedin || null,
      github: form.github || null,
    }).eq("id", profile.id);
    setSaving(false);
    if (error) {
      setError(error.message.includes("duplicate") ? "Ce nom d'utilisateur est déjà pris." : error.message);
      return;
    }
    setMessage("Profil mis à jour.");
  }

  const labelCls = "label-light";
  const inputCls = "input-light";

  return (
    <form onSubmit={onSubmit} className="card-light space-y-7">
      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        <div>
          <label className={labelCls}>Photo</label>
          <div className="flex items-center gap-4">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-gelap-200 text-gelap-500">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : ("Pas de photo")}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} />
            <button type="button" className="btn-ghost text-xs" onClick={() => fileRef.current?.click()}>Changer la photo</button>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelCls}>Prénom</label><input className={inputCls} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
          <div><label className={labelCls}>Nom</label><input className={inputCls} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
          <div className="md:col-span-2">
            <label className={labelCls}>Nom d'utilisateur (TrustLink)</label>
            <input className={inputCls} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <p className="mt-1 text-xs text-gelap-400">Sera publié sur /{normalizeUsername(form.username) || "..."}</p>
          </div>
          <div><label className={labelCls}>Titre professionnel</label><input className={inputCls} value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} /></div>
          <div><label className={labelCls}>Localisation</label><input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div><label className={labelCls}>Téléphone</label><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className={labelCls}>Site web</label><input className={inputCls} value={form.website} placeholder="https://" onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
          <div><label className={labelCls}>LinkedIn</label><input className={inputCls} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
          <div><label className={labelCls}>GitHub</label><input className={inputCls} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="bio">Bio</label>
        <textarea id="bio" className={inputCls + " min-h-[140px] resize-y leading-relaxed"} value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>

      <div className="text-xs text-gelap-500">Email du compte : {email}</div>
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
