export type ProductCategory = "Rental" | "Racing" | "Electric";
export type Product = {
  id: string; name: string; slug: string; description: string; category: ProductCategory;
  price?: number | null; images: string[]; brochure_url?: string | null;
  specs: Record<string, string>; featured?: boolean; published?: boolean;
};
export type Project = {
  id: string; title: string; slug: string; client: string; location: string; project_type: string;
  year: number; story: string; gallery: string[]; testimonial: string; featured?: boolean;
};
export type SiteSettings = {
  logo_url?: string; phone?: string; email?: string; social_links?: Record<string, string>;
  seo_title?: string; seo_description?: string; hero_video_url?: string;
};
