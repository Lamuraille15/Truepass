import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { enabled, expires_in_days, password_protected } = await request.json();
  const { data: profile } = await supabase.from("profiles").select("id, username").eq("user_id", user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  const payload = {
    user_id: user.id,
    username: profile.username,
    expires_in_days,
    password_protected,
    show_info: !!enabled.info,
    show_skills: !!enabled.skills,
    show_projects: !!enabled.projects,
    show_experiences: !!enabled.experiences,
    show_documents: !!enabled.documents,
    show_testimonials: !!enabled.reviews,
  };
  const { error } = await supabase.from("trustlink_config").upsert(payload, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
