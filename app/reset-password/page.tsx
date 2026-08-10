import Link from "next/link";
import { ResetForm } from "./ResetForm";

export default function ResetPage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-gold font-serif text-lg">
          T
        </span>
        <span className="text-lg font-semibold text-navy">TruePass</span>
      </Link>
      <div className="card">
        <h1 className="text-2xl font-semibold text-navy">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-navy/60">
          Nous t&apos;enverrons un lien sécurisé par email.
        </p>
        <div className="mt-6"><ResetForm /></div>
      </div>
    </main>
  );
}
