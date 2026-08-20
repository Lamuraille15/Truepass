import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12 bg-gelap-soft">
      <Link href="/" className="mb-10 inline-flex items-center gap-3 self-center">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand shadow-card">
          <span className="font-extrabold text-2xl text-gelap">T</span>
        </span>
        <div>
          <div className="text-xl font-bold tracking-tight text-gelap">truepass</div>
          <div className="text-[10px] uppercase tracking-widest text-gelap-500">Votre identité. Votre confiance.</div>
        </div>
      </Link>

      <div className="rounded-2xl border-2 border-brand/30 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-bold text-gelap">Inscription</h1>
        <p className="mt-2 text-sm text-gelap-500">Crée ton compte pour générer ton TrustLink unique.</p>
        <div className="mt-7"><SignupForm /></div>
        <p className="mt-7 pt-6 border-t border-gelap-line text-sm text-gelap-700">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-bold text-brand-dark hover:underline">Connecte-toi</Link>
        </p>
      </div>
    </main>
  );
}
