export type ProductCategory = "Rental" | "Racing" | "Electric";
export type Product = {
  id: string; name: string; slug: string; description: string; category: ProductCategory;
  price?: number | null; images: string[]; brochure_url?: string | null;
  specs: Record<string, string>; featured?: boolean; published?: boolean;
  seo_title?: string | null; seo_description?: string | null;
};
export type Project = {
  id: string; title: string; slug: string; client: string; location: string; project_type: string;
  year: number; story: string; gallery: string[]; testimonial: string; featured?: boolean;
  published?: boolean;
};
export type SiteSettings = {
  logo_url?: string; logo_mode?: "text" | "image"; logo_text?: string; logo_text_color?: string; phone?: string; email?: string; social_links?: Record<string, string>;
  seo_title?: string; seo_description?: string; hero_video_url?: string;
  site_name?: string; tagline?: string; contact_phone?: string; contact_email?: string; address?: string;
  logo_alt?: string; favicon_url?: string; og_image_url?: string; header_cta_label?: string; header_cta_url?: string;
  footer_note?: string; theme?: { primary: string; secondary: string; background: string };
};

export type NavigationLink = { label: string; href: string };
export type SiteNavigation = {
  header: NavigationLink[];
  footer: NavigationLink[];
};

export type HomepageSectionContent = {
  eyebrow?: string;
  headline?: string;
  description?: string;
  cta_label?: string;
  cta_url?: string;
  media_url?: string;
  items?: unknown[];
  [key: string]: unknown;
};

export type HomepageSection = {
  id?: string;
  page_id?: string;
  section_type: string;
  title: string;
  description?: string;
  sort_order?: number;
  published?: boolean;
  content?: HomepageSectionContent | null;
};

export type VisualPageRecord = {
  id?: string;
  slug: string;
  title: string;
  seo_title?: string | null;
  seo_description?: string | null;
  published?: boolean;
  content?: unknown;
};
