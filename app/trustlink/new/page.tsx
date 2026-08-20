import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { TrustLinkConfigurator } from "./TrustLinkConfigurator";

export default async function NewTrustLinkPage() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id, username, first_name, job_title, photo_url").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/dashboard/profile");
  return <TrustLinkConfigurator username={profile.username} fullName={profile.first_name ?? profile.username} photoUrl={profile.photo_url} jobTitle={profile.job_title} />;
}
