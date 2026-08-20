import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { TestimonialsClient } from "./TestimonialsClient";

export default async function TestimonialsPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/dashboard/profile");
  const { data: items } = await supabase.from("testimonials").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false });
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 bg-gelap-soft min-h-screen">
      <a href="/dashboard" className="text-sm text-brand-dark font-bold hover:underline">← Tableau de bord</a>
      <h1 className="mt-2 text-3xl font-extrabold text-gelap">Avis et recommandations</h1>
      <p className="mt-1 text-sm text-gelap-500">Les retours de tes clients s&apos;affichent sur ton TrustLink.</p>
      <div className="mt-8"><TestimonialsClient profileId={profile.id} initial={items ?? []} /></div>
    </main>
  );
}
