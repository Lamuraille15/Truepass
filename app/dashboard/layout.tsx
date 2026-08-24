import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) redirect("/dashboard/profile");

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() ||
    profile.username;

  return (
    <div className="flex min-h-screen bg-gelap-soft">
      <DashboardSidebar
        username={profile.username}
        fullName={fullName}
        firstName={profile.first_name ?? "Vous"}
      />
      <main className="min-w-0 flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
