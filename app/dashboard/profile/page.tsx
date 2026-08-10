import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ProfileEditPage() {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-navy">Profil introuvable.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <a href="/dashboard" className="text-sm text-navy/60 hover:underline">
        ← Tableau de bord
      </a>
      <h1 className="mt-2 text-2xl font-semibold text-navy">Mon Profil</h1>
      <p className="mt-1 text-sm text-navy/60">
        Ces informations s&apos;affichent sur ta page publique.
      </p>
      <div className="mt-8">
        <ProfileForm profile={profile} email={user.email ?? ""} />
      </div>
    </main>
  );
}
