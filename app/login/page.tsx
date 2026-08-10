import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-gold font-serif text-lg">
          T
        </span>
        <span className="text-lg font-semibold text-navy">TruePass</span>
      </Link>
      <div className="card">
        <h1 className="text-2xl font-semibold text-navy">Connexion</h1>
        <p className="mt-1 text-sm text-navy/60">
          Accède à ton tableau de bord pour gérer ton TrustLink.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-navy/70">
          Pas de compte ?{" "}
          <Link href="/signup" className="font-semibold text-gold-dark hover:underline">
            Crée un compte
          </Link>
        </p>
        <p className="mt-1 text-sm text-navy/70">
          <Link
            href="/reset-password"
            className="font-semibold text-gold-dark hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </main>
  );
}
