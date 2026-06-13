import { defaultSettings, getFallbackProducts, getFallbackProjects } from "./fallback-data";
import { isSupabaseConfigured, serviceSupabase } from "./supabase";
import type { Product, Project, SiteSettings } from "./types";

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return getFallbackProducts();
  const { data } = await serviceSupabase().from("products").select("*").eq("published", true).order("sort_order");
  return data?.length ? data : getFallbackProducts();
}
export async function getProduct(slug: string) { return (await getProducts()).find((p) => p.slug === slug); }
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return getFallbackProjects();
  const { data } = await serviceSupabase().from("projects").select("*").eq("published", true).order("year", { ascending: false });
  return data?.length ? data : getFallbackProjects();
}
export async function getProject(slug: string) { return (await getProjects()).find((p) => p.slug === slug); }
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return defaultSettings;
  const { data } = await serviceSupabase().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? defaultSettings;
}
