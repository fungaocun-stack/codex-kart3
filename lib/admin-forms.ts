import { createAdminDraft, type AdminResource } from "@/lib/admin-cms";
import { buildVisualPagePayload } from "@/lib/visual-pages";

export type AdminFieldKind = "text" | "textarea" | "toggle" | "select" | "media" | "mediaList" | "keyvalue" | "readOnly" | "number";

export type AdminFieldDefinition = {
  key: string;
  label: string;
  kind: AdminFieldKind;
  hint?: string;
  options?: Array<{ label: string; value: string }>;
  readOnly?: boolean;
};

export type AdminFormSection = {
  title: string;
  description?: string;
  fields: AdminFieldDefinition[];
};

export type AdminFormDefinition = {
  resource: AdminResource;
  title: string;
  hasJsonEditor: false;
  sections: AdminFormSection[];
};

const productCategories = [
  { label: "Rental", value: "Rental" },
  { label: "Racing", value: "Racing" },
  { label: "Electric", value: "Electric" }
];

const sectionTypes = [
  { label: "Hero", value: "hero" },
  { label: "Why", value: "why" },
  { label: "Products", value: "products" },
  { label: "Racing Stories", value: "racing_stories" },
  { label: "Culture", value: "culture" },
  { label: "Technology", value: "technology" },
  { label: "Contact", value: "contact" }
];

export const adminFormDefinitions: Record<AdminResource, AdminFormDefinition> = {
  products: {
    resource: "products",
    title: "Products",
    hasJsonEditor: false,
    sections: [
      {
        title: "Product details",
        fields: [
          { key: "name", label: "Name", kind: "text" },
          { key: "slug", label: "Slug", kind: "text" },
          { key: "category", label: "Category", kind: "select", options: productCategories },
          { key: "description", label: "Description", kind: "textarea", hint: "Use plain text or simple rich text formatting." }
        ]
      },
      {
        title: "Media and specs",
        fields: [
          { key: "images", label: "Images", kind: "mediaList", hint: "Upload product images and copy the public URLs." },
          { key: "brochure_url", label: "PDF brochure", kind: "media", hint: "Upload a brochure PDF to Supabase Storage." },
          { key: "specs", label: "Parameters", kind: "keyvalue" }
        ]
      },
      {
        title: "SEO and status",
        fields: [
          { key: "seo_title", label: "SEO title", kind: "text" },
          { key: "seo_description", label: "SEO description", kind: "text" },
          { key: "price", label: "Price", kind: "number" },
          { key: "featured", label: "Featured", kind: "toggle" },
          { key: "published", label: "Published", kind: "toggle" }
        ]
      }
    ]
  },
  projects: {
    resource: "projects",
    title: "Projects",
    hasJsonEditor: false,
    sections: [
      {
        title: "Project details",
        fields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "slug", label: "Slug", kind: "text" },
          { key: "client", label: "Client", kind: "text" },
          { key: "location", label: "Location", kind: "text" },
          { key: "project_type", label: "Project type", kind: "text" },
          { key: "year", label: "Year", kind: "number" }
        ]
      },
      {
        title: "Story and gallery",
        fields: [
          { key: "story", label: "Story", kind: "textarea" },
          { key: "testimonial", label: "Testimonial", kind: "textarea" },
          { key: "gallery", label: "Gallery", kind: "mediaList" }
        ]
      },
      {
        title: "Visibility",
        fields: [
          { key: "featured", label: "Featured", kind: "toggle" },
          { key: "published", label: "Published", kind: "toggle" }
        ]
      }
    ]
  },
  site_settings: {
    resource: "site_settings",
    title: "Site Settings",
    hasJsonEditor: false,
    sections: [
      {
        title: "Brand and contact",
        fields: [
          { key: "site_name", label: "Company name", kind: "text" },
          { key: "tagline", label: "Tagline", kind: "text" },
          { key: "logo_url", label: "Logo", kind: "media" },
          { key: "logo_alt", label: "Logo alt text", kind: "text" },
          { key: "favicon_url", label: "Favicon", kind: "media" },
          { key: "contact_phone", label: "Contact phone", kind: "text" },
          { key: "contact_email", label: "Contact email", kind: "text" },
          { key: "address", label: "Address", kind: "textarea" }
        ]
      },
      {
        title: "Social and CTA",
        fields: [
          { key: "social_links", label: "Social links", kind: "keyvalue" },
          { key: "header_cta_label", label: "Header CTA label", kind: "text" },
          { key: "header_cta_url", label: "Header CTA URL", kind: "text" },
          { key: "footer_note", label: "Copyright", kind: "text" }
        ]
      },
      {
        title: "SEO and theme",
        fields: [
          { key: "seo_title", label: "SEO title", kind: "text" },
          { key: "seo_description", label: "SEO description", kind: "text" },
          { key: "hero_video_url", label: "Hero video", kind: "media" },
          { key: "og_image_url", label: "Open Graph image", kind: "media" },
          { key: "theme", label: "Theme colors", kind: "text" }
        ]
      }
    ]
  },
  inquiries: {
    resource: "inquiries",
    title: "Inquiries",
    hasJsonEditor: false,
    sections: [
      {
        title: "Lead details",
        fields: [
          { key: "name", label: "Name", kind: "readOnly", readOnly: true },
          { key: "email", label: "Email", kind: "readOnly", readOnly: true },
          { key: "phone", label: "Phone", kind: "readOnly", readOnly: true },
          { key: "company", label: "Company", kind: "readOnly", readOnly: true },
          { key: "country", label: "Country", kind: "readOnly", readOnly: true },
          { key: "interest", label: "Interest", kind: "readOnly", readOnly: true },
          { key: "message", label: "Message", kind: "readOnly", readOnly: true }
        ]
      },
      {
        title: "Follow-up",
        fields: [
          { key: "status", label: "Status", kind: "select" },
          { key: "notes", label: "Notes", kind: "textarea" }
        ]
      }
    ]
  },
  page_sections: {
    resource: "page_sections",
    title: "Homepage Sections",
    hasJsonEditor: false,
    sections: [
      {
        title: "Structure",
        fields: [
          { key: "section_type", label: "Section type", kind: "select", options: sectionTypes },
          { key: "title", label: "Title", kind: "text" },
          { key: "sort_order", label: "Sort order", kind: "number" },
          { key: "published", label: "Published", kind: "toggle" }
        ]
      },
      {
        title: "Content",
        fields: [
          { key: "content.eyebrow", label: "Eyebrow", kind: "text" },
          { key: "content.headline", label: "Headline", kind: "text" },
          { key: "content.description", label: "Description", kind: "textarea" },
          { key: "content.cta_label", label: "CTA label", kind: "text" },
          { key: "content.cta_url", label: "CTA URL", kind: "text" },
          { key: "content.media_url", label: "Media URL", kind: "media" }
        ]
      }
    ]
  },
  pages: {
    resource: "pages",
    title: "Visual Pages",
    hasJsonEditor: false,
    sections: [
      {
        title: "Page settings",
        fields: [
          { key: "slug", label: "Slug", kind: "text" },
          { key: "title", label: "Title", kind: "text" },
          { key: "seo_title", label: "SEO title", kind: "text" },
          { key: "seo_description", label: "SEO description", kind: "textarea" },
          { key: "published", label: "Published", kind: "toggle" }
        ]
      }
    ]
  }
};

function stripUiFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUiFields);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !/^(_|ui|temp|preview)/i.test(key))
      .map(([key, entry]) => [key, stripUiFields(entry)])
  );
}

export function buildAdminPayload(resource: AdminResource, draft: Record<string, unknown>) {
  const cleanDraft = stripUiFields(draft) as Record<string, unknown>;
  const next = createAdminDraft(resource, cleanDraft);

  if (resource === "inquiries") {
    return {
      ...(typeof next.id === "string" && next.id ? { id: next.id } : {}),
      status: String(next.status ?? "New"),
      notes: String(next.notes ?? "")
    };
  }

  if (resource === "page_sections") {
    return {
      ...(typeof next.id === "string" && next.id ? { id: next.id } : {}),
      ...(typeof next.page_id === "string" && next.page_id ? { page_id: next.page_id } : {}),
      section_type: String(next.section_type ?? "hero"),
      title: String(next.title ?? ""),
      sort_order: Number(next.sort_order ?? 0),
      published: next.published !== false,
      content: (next.content && typeof next.content === "object" && !Array.isArray(next.content) ? next.content : {}) as Record<string, unknown>
    };
  }

  if (resource === "pages") {
    return buildVisualPagePayload(cleanDraft);
  }

  return next;
}
