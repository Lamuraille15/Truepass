"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    const { error } = await createClient().auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/login?signup=1");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="label-light">Email</label>
        <input id="email" type="email" autoComplete="email" required placeholder="vous@exemple.com"
          className="input-light" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password" className="label-light">Mot de passe</label>
        <input id="password" type="password" autoComplete="new-password" required placeholder="Au moins 8 caractères"
          className="input-light" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="confirm" className="label-light">Confirmation</label>
        <input id="confirm" type="password" autoComplete="new-password" required placeholder="Retape ton mot de passe"
          className="input-light" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="w-full btn-primary py-3">
        {loading ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
