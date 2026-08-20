import Link from "next/link";
import { ResetForm } from "./ResetForm";

export default function ResetPage() {
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
        <h1 className="text-3xl font-bold text-gelap">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-gelap-500">Nous t&apos;enverrons un lien sécurisé par email.</p>
        <div className="mt-7"><ResetForm /></div>
      </div>
    </main>
  );
}
