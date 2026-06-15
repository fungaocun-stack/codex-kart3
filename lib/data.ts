import { defaultSettings, getFallbackNavigation, getFallbackPages, getFallbackProducts, getFallbackProjects } from "./fallback-data";
import { isSupabaseConfigured, serviceSupabase } from "./supabase";
import type { Product, Project, SiteNavigation, SiteSettings, VisualPageRecord } from "./types";

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

export async function getNavigation(): Promise<SiteNavigation> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return getFallbackNavigation();
  const { data } = await serviceSupabase().from("navigation").select("*").eq("id", 1).maybeSingle();
  if (!data) return getFallbackNavigation();
  return {
    header: Array.isArray(data.header) ? data.header : getFallbackNavigation().header,
    footer: Array.isArray(data.footer) ? data.footer : getFallbackNavigation().footer
  };
}

export async function getPages(includeUnpublished = false): Promise<VisualPageRecord[]> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return includeUnpublished ? getFallbackPages() : getFallbackPages().filter((page) => page.published !== false);
  const query = serviceSupabase().from("pages").select("*").order("updated_at", { ascending: false });
  const { data } = includeUnpublished ? await query : await query.eq("published", true);
  return data?.length ? data : getFallbackPages();
}

export async function getPage(slug: string): Promise<VisualPageRecord | undefined> {
  const pages = await getPages(false);
  return pages.find((page) => page.slug === slug);
}
