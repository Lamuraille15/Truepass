import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { SkillsClient } from "./SkillsClient";

export default async function SkillsPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/dashboard/profile");
  const { data: skills } = await supabase.from("skills").select("*").eq("profile_id", profile.id).order("created_at");
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 bg-gelap-soft min-h-screen">
      <a href="/dashboard" className="text-sm text-brand-dark font-bold hover:underline">← Tableau de bord</a>
      <h1 className="mt-2 text-3xl font-extrabold text-gelap">Compétences</h1>
      <p className="mt-1 text-sm text-gelap-500">Liste des savoir-faire affichés sur ton TrustLink.</p>
      <div className="mt-8"><SkillsClient profileId={profile.id} initial={skills ?? []} /></div>
    </main>
  );
}
