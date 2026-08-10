import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/dashboard");
  const { data: rows } = await supabase.from("projects").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false });
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <a href="/dashboard" className="text-sm text-navy/60 hover:underline">← Tableau de bord</a>
      <h1 className="mt-2 text-2xl font-semibold text-navy">Projets</h1>
      <p className="mt-1 text-sm text-navy/60">Tes réalisations ou contributions clés.</p>
      <div className="mt-8"><ProjectsClient profileId={profile.id} initial={rows ?? []} /></div>
    </main>
  );
}
