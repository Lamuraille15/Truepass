import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export default async function SettingsPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 bg-gelap-soft min-h-screen">
      <a href="/dashboard" className="text-sm text-brand-dark font-bold hover:underline">← Tableau de bord</a>
      <h1 className="mt-2 text-3xl font-extrabold text-gelap">Paramètres</h1>
      <div className="card-light mt-8 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gelap">Déconnexion</div>
          <div className="text-xs text-gelap-500">Ferme ta session actuelle.</div>
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
