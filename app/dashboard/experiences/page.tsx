import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { ExperiencesClient } from "./ExperiencesClient";

export default async function ExperiencesPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/dashboard/profile");
  const { data: exp } = await supabase.from("experiences").select("*").eq("profile_id", profile.id).order("start_date", { ascending: false });
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 bg-gelap-soft min-h-screen">
      <a href="/dashboard" className="text-sm text-brand-dark font-bold hover:underline">← Tableau de bord</a>
      <h1 className="mt-2 text-3xl font-extrabold text-gelap">Expériences</h1>
      <p className="mt-1 text-sm text-gelap-500">Ton parcours professionnel.</p>
      <div className="mt-8"><ExperiencesClient profileId={profile.id} initial={exp ?? []} /></div>
    </main>
  );
}
