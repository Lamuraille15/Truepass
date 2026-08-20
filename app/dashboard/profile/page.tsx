import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ProfileEditPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (!profile) return <main className="p-12">Profil introuvable.</main>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 bg-white min-h-screen">
      <a href="/dashboard" className="text-sm text-brand-dark hover:underline font-bold">← Tableau de bord</a>
      <h1 className="mt-2 text-3xl font-extrabold text-gelap">Mon Profil</h1>
      <p className="mt-1 text-sm text-gelap-500">Ces informations s&apos;affichent sur ton TrustLink.</p>
      <div className="mt-8"><ProfileForm profile={profile} email={user.email ?? ""} /></div>
    </main>
  );
}
