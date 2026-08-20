import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { EducationClient } from "./EducationClient";

export default async function EducationPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/dashboard/profile");
  const { data: edu } = await supabase.from("education").select("*").eq("profile_id", profile.id).order("year", { ascending: false });
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 bg-gelap-soft min-h-screen">
      <a href="/dashboard" className="text-sm text-brand-dark font-bold hover:underline">← Tableau de bord</a>
      <h1 className="mt-2 text-3xl font-extrabold text-gelap">Documents & Diplômes</h1>
      <p className="mt-1 text-sm text-gelap-500">Tes certifications et diplômes.</p>
      <div className="mt-8"><EducationClient profileId={profile.id} initial={edu ?? []} /></div>
    </main>
  );
}
