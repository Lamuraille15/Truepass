import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { LandingPage } from "@/components/LandingPage";

export default async function HomePage() {
  // Logo dynamique : / → /dashboard si connecté
  const supabase = await createServer();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  } catch {
    /* middleware gère ce cas plus tard */
  }
  return <LandingPage />;
}
