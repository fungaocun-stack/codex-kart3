import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, serviceSupabase } from "@/lib/supabase";

const allowed = new Set(["products", "projects", "site_settings", "inquiries"]);
async function admin(request: Request) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return false;
  const auth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await auth.auth.getUser(token);
  if (!data.user) return false;
  const { data: row } = await serviceSupabase().from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  return Boolean(row);
}
export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;if (!allowed.has(resource) || !(await admin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await serviceSupabase().from(resource).select("*").order(resource === "inquiries" ? "created_at" : "updated_at", { ascending: false });
  return NextResponse.json(error ? { error: error.message } : data, { status: error ? 500 : 200 });
}
export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;if (!allowed.has(resource) || !(await admin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();const { data, error } = await serviceSupabase().from(resource).upsert(body).select().single();
  return NextResponse.json(error ? { error: error.message } : data, { status: error ? 500 : 200 });
}
export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;if (!["products","projects"].includes(resource) || !(await admin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");const { error } = await serviceSupabase().from(resource).delete().eq("id", id);
  return NextResponse.json(error ? { error: error.message } : { ok: true }, { status: error ? 500 : 200 });
}
