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
    setError(null);
    const ext = file.name.split(".").pop();
    const path = `${profile.user_id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError("Échec upload photo : " + upErr.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    await supabase
      .from("profiles")
      .update({ photo_url: data.publicUrl })
      .eq("id", profile.id);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const cleanUsername = normalizeUsername(form.username);
    if (!cleanUsername || cleanUsername.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }
    if (isReservedUsername(cleanUsername)) {
      setError("Ce nom d'utilisateur est réservé.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
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
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      setError(error.message.includes("duplicate") || error.message.includes("unique")
        ? "Ce nom d'utilisateur est déjà pris."
        : error.message);
      return;
    }
    setMessage("Profil mis à jour.");
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="label">Photo</label>
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-navy/10 text-navy/40">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Photo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs">Pas de photo</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPhoto(f);
                }}
              />
              <button
                type="button"
                className="btn-ghost py-2 text-xs"
                onClick={() => fileRef.current?.click()}
              >
                Changer la photo
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
          <Field label="Prénom" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} />
          <Field label="Nom" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} />
          <Field
            label="Nom d'utilisateur (TrustLink)"
            value={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
            hint={`Sera publié sur /${normalizeUsername(form.username) || "..."}`}
          />
          <Field label="Titre professionnel" value={form.job_title} onChange={(v) => setForm({ ...form, job_title: v })} />
          <Field label="Localisation" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <Field label="Téléphone (optionnel)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Site web (optionnel)" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
          <Field label="LinkedIn (optionnel)" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
          <Field label="GitHub (optionnel)" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          className="input min-h-[120px]"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Présente-toi en quelques lignes."
        />
      </div>

      <div className="text-xs text-navy/60">Email du compte : {email}</div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-navy/50">{hint}</p>}
    </div>
  );
}
