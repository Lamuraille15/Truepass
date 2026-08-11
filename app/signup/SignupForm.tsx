"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // État pour afficher le message de succès

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Si tout s'est bien passé, on affiche le message de confirmation d'email
    setIsSubmitted(true);
  }

  // Si l'inscription a réussi, on affiche ce bloc à la place du formulaire
  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-gold/20 bg-navy/5 p-6 text-center">
        <h2 className="text-xl font-bold text-navy mb-3">Vérifie ta boîte mail ! ✉️</h2>
        <p className="text-sm text-navy/80 leading-relaxed mb-4">
          Un lien de confirmation vient de t'être envoyé à l'adresse : <br />
          <strong className="text-navy">{email}</strong>.
        </p>
        <p className="text-xs text-navy/60">
          Pense à vérifier tes courriers indésirables (spams) si tu ne vois rien arriver d'ici quelques minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="confirm">Confirmation</label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
