import { defaultSettings, getFallbackNavigation, getFallbackPages, getFallbackProducts, getFallbackProjects } from "./fallback-data";
import { isSupabaseConfigured, serviceSupabase } from "./supabase";
import type { Product, Project, SiteNavigation, SiteSettings, VisualPageRecord } from "./types";

function mergeSettings(data: SiteSettings | null | undefined): SiteSettings {
  const fallbackTheme = defaultSettings.theme ?? { primary: "#ff5a00", secondary: "#ffffff", background: "#070707" };
  const textOrDefault = (value: string | undefined, fallback: string | undefined) =>
    typeof value === "string" && value.trim().length > 0 ? value : fallback;
  if (!data) return defaultSettings;
  return {
    logo_mode: data.logo_mode === "image" ? "image" : "text",
    logo_url: textOrDefault(data.logo_url, defaultSettings.logo_url),
    logo_text: textOrDefault(data.logo_text, defaultSettings.logo_text),
    logo_text_color: textOrDefault(data.logo_text_color, defaultSettings.logo_text_color),
    phone: textOrDefault(data.phone, defaultSettings.phone),
    email: textOrDefault(data.email, defaultSettings.email),
    social_links: {
      ...(defaultSettings.social_links ?? {}),
      ...(data.social_links ?? {})
    },
    seo_title: textOrDefault(data.seo_title, defaultSettings.seo_title),
    seo_description: textOrDefault(data.seo_description, defaultSettings.seo_description),
    hero_video_url: textOrDefault(data.hero_video_url, defaultSettings.hero_video_url),
    site_name: textOrDefault(data.site_name, defaultSettings.site_name),
    tagline: textOrDefault(data.tagline, defaultSettings.tagline),
    contact_phone: textOrDefault(data.contact_phone, data.phone ?? defaultSettings.phone),
    contact_email: textOrDefault(data.contact_email, data.email ?? defaultSettings.email),
    address: textOrDefault(data.address, defaultSettings.address),
    logo_alt: textOrDefault(data.logo_alt, defaultSettings.logo_alt),
    favicon_url: textOrDefault(data.favicon_url, defaultSettings.favicon_url),
    og_image_url: textOrDefault(data.og_image_url, defaultSettings.og_image_url),
    header_cta_label: textOrDefault(data.header_cta_label, defaultSettings.header_cta_label),
    header_cta_url: textOrDefault(data.header_cta_url, defaultSettings.header_cta_url),
    footer_note: textOrDefault(data.footer_note, defaultSettings.footer_note),
    theme: {
      primary: data.theme?.primary ?? fallbackTheme.primary,
      secondary: data.theme?.secondary ?? fallbackTheme.secondary,
      background: data.theme?.background ?? fallbackTheme.background
    }
  };
}

function mergeNavigation(data: { header?: unknown; footer?: unknown } | null | undefined): SiteNavigation {
  const fallback = getFallbackNavigation();
  if (!data) return fallback;
  return {
    header: Array.isArray(data.header) && data.header.length ? (data.header as SiteNavigation["header"]) : fallback.header,
    footer: Array.isArray(data.footer) && data.footer.length ? (data.footer as SiteNavigation["footer"]) : fallback.footer
  };
}

function hasRenderablePageContent(page: VisualPageRecord | undefined) {
  if (!page?.content || typeof page.content !== "object") return false;
  const content = (page.content as { content?: unknown }).content;
  return Array.isArray(content) && content.length > 0;
}

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
  return mergeSettings(data);
}

export async function getNavigation(): Promise<SiteNavigation> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return getFallbackNavigation();
  const { data } = await serviceSupabase().from("navigation").select("*").eq("id", 1).maybeSingle();
  return mergeNavigation(data);
}

export async function getPages(includeUnpublished = false): Promise<VisualPageRecord[]> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return includeUnpublished ? getFallbackPages() : getFallbackPages().filter((page) => page.published !== false);
  const query = serviceSupabase().from("pages").select("*").order("updated_at", { ascending: false });
  const { data } = includeUnpublished ? await query : await query.eq("published", true);
  return data?.length ? data : getFallbackPages();
}

export async function getPage(slug: string): Promise<VisualPageRecord | undefined> {
  const pages = await getPages(false);
  const page = pages.find((entry) => entry.slug === slug);
  if (page && slug === "home" && !hasRenderablePageContent(page)) {
    return getFallbackPages().find((entry) => entry.slug === slug) ?? page;
  }
  return page;
}

