import { createVisualPageDraft, buildVisualPagePayload } from "@/lib/visual-pages";
import { normalizeTheme } from "@/lib/cms";

export type AdminResource = "products" | "projects" | "site_settings" | "inquiries" | "page_sections" | "pages";
export type AdminRouteSlug = "products" | "projects" | "site-settings" | "inquiries" | "homepage-sections" | "pages";

export type AdminNavItem = {
  resource: AdminResource;
  slug: AdminRouteSlug;
  href: string;
  label: string;
  description: string;
  editable: boolean;
};

export type AdminDraft = Record<string, unknown>;

export const adminNavItems: AdminNavItem[] = [
  {
    resource: "products",
    slug: "products",
    href: "/admin/products",
    label: "Products",
    description: "Catalog, pricing, SEO, and publish controls.",
    editable: true
  },
  {
    resource: "projects",
    slug: "projects",
    href: "/admin/projects",
    label: "Projects",
    description: "Racing stories, galleries, and publish controls.",
    editable: true
  },
  {
    resource: "site_settings",
    slug: "site-settings",
    href: "/admin/site-settings",
    label: "Site Settings",
    description: "Brand, contact, navigation, and theme defaults.",
    editable: true
  },
  {
    resource: "inquiries",
    slug: "inquiries",
    href: "/admin/inquiries",
    label: "Inquiries",
    description: "Read-only lead inbox and follow-up notes.",
    editable: false
  },
  {
    resource: "page_sections",
    slug: "homepage-sections",
    href: "/admin/homepage-sections",
    label: "Homepage Sections",
    description: "Hero, benefits, story, and CTA sections for the homepage.",
    editable: true
  },
  {
    resource: "pages",
    slug: "pages",
    href: "/admin/pages",
    label: "Visual Pages",
    description: "Puck-based pages with publish controls and SEO settings.",
    editable: true
  }
];

const resourceBySlug: Record<string, AdminResource> = {
  products: "products",
  projects: "projects",
  "site-settings": "site_settings",
  inquiries: "inquiries",
  "homepage-sections": "page_sections",
  pages: "pages"
};

export function isAdminResource(value: string): value is AdminResource {
  return value === "products" || value === "projects" || value === "site_settings" || value === "inquiries" || value === "page_sections" || value === "pages";
}

export function resolveAdminResource(value: string): AdminResource {
  return resourceBySlug[value] ?? "products";
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function stringRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry === "string")) as Record<string, string>;
}

export function createAdminDraft(resource: AdminResource, source: AdminDraft = {}): AdminDraft {
  const hasId = typeof source.id === "string" && source.id.length > 0;
  if (resource === "products") {
    return {
      ...(hasId ? { id: stringValue(source.id) } : {}),
      name: stringValue(source.name),
      slug: stringValue(source.slug),
      description: stringValue(source.description),
      category: stringValue(source.category, "Rental"),
      price: source.price ?? null,
      images: stringArray(source.images),
      brochure_url: stringValue(source.brochure_url),
      specs: stringRecord(source.specs),
      featured: booleanValue(source.featured),
      published: source.published === false ? false : true,
      sort_order: numberValue(source.sort_order),
      seo_title: stringValue(source.seo_title),
      seo_description: stringValue(source.seo_description)
    };
  }

  if (resource === "projects") {
    return {
      ...(hasId ? { id: stringValue(source.id) } : {}),
      title: stringValue(source.title),
      slug: stringValue(source.slug),
      client: stringValue(source.client),
      location: stringValue(source.location),
      project_type: stringValue(source.project_type),
      year: numberValue(source.year, new Date().getFullYear()),
      story: stringValue(source.story),
      gallery: stringArray(source.gallery),
      testimonial: stringValue(source.testimonial),
      featured: booleanValue(source.featured),
      published: source.published === false ? false : true
    };
  }

  if (resource === "site_settings") {
    return {
      id: 1,
      logo_mode: source.logo_mode === "image" ? "image" : "text",
      site_name: stringValue(source.site_name),
      tagline: stringValue(source.tagline),
      logo_url: stringValue(source.logo_url),
      logo_text: stringValue(source.logo_text, "VORTKART"),
      logo_text_color: stringValue(source.logo_text_color, "#ffffff"),
      logo_alt: stringValue(source.logo_alt),
      phone: stringValue(source.phone),
      email: stringValue(source.email),
      contact_phone: stringValue(source.contact_phone),
      contact_email: stringValue(source.contact_email),
      address: stringValue(source.address),
      social_links: stringRecord(source.social_links),
      seo_title: stringValue(source.seo_title),
      seo_description: stringValue(source.seo_description),
      hero_video_url: stringValue(source.hero_video_url),
      favicon_url: stringValue(source.favicon_url),
      og_image_url: stringValue(source.og_image_url),
      header_cta_label: stringValue(source.header_cta_label),
      header_cta_url: stringValue(source.header_cta_url),
      footer_note: stringValue(source.footer_note),
      theme: normalizeTheme(source.theme as { primary?: string; secondary?: string; background?: string } | undefined)
    };
  }

  if (resource === "page_sections") {
    return {
      ...(hasId ? { id: stringValue(source.id) } : {}),
      page_id: stringValue(source.page_id),
      section_type: stringValue(source.section_type, "hero"),
      title: stringValue(source.title),
      sort_order: numberValue(source.sort_order),
      published: source.published === false ? false : true,
      content:
        source.content && typeof source.content === "object" && !Array.isArray(source.content)
          ? source.content
          : {
              eyebrow: "",
              headline: "",
              description: "",
              cta_label: "",
              cta_url: "",
              media_url: "",
              items: []
            }
    };
  }

  if (resource === "pages") {
    return createVisualPageDraft(source);
  }

  return {
    ...(hasId ? { id: stringValue(source.id) } : {}),
    name: stringValue(source.name),
    email: stringValue(source.email),
    phone: stringValue(source.phone),
    company: stringValue(source.company),
    country: stringValue(source.country),
    interest: stringValue(source.interest),
    message: stringValue(source.message),
    title: stringValue(source.title),
    status: stringValue(source.status),
    notes: stringValue(source.notes)
  };
}

export function buildAdminPagePayload(draft: Record<string, unknown>) {
  return buildVisualPagePayload(draft);
}

export function getAdminRevalidationPaths(resource: AdminResource, draft: AdminDraft = {}) {
  const paths = new Set<string>();
  const add = (...values: Array<string | undefined>) => {
    for (const value of values) {
      if (value) paths.add(value);
    }
  };
  const slug = typeof draft.slug === "string" && draft.slug.trim().length > 0 ? draft.slug.trim() : "";

  if (resource === "products") {
    add("/", "/products", "/sitemap.xml");
    if (slug) add(`/products/${slug}`);
  } else if (resource === "projects") {
    add("/", "/projects", "/sitemap.xml");
    if (slug) add(`/projects/${slug}`);
  } else if (resource === "site_settings") {
    add("/", "/contact", "/sitemap.xml");
  } else if (resource === "page_sections") {
    add("/", "/pages/home", "/sitemap.xml");
  } else if (resource === "pages") {
    add("/", "/pages", "/pages/home", "/admin/pages", "/sitemap.xml");
    if (slug) add(`/pages/${slug}`);
  }

  return [...paths];
}





