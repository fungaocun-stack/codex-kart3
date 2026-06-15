const safeTheme = {
  primary: "#ff5a00",
  secondary: "#ffffff",
  background: "#070707"
} as const;

export type CmsTheme = {
  primary?: string;
  secondary?: string;
  background?: string;
};

export type CmsSection = {
  section_type: string;
  title: string;
  description?: string;
  [key: string]: unknown;
};

export type CmsPageData = {
  root: {
    type: string;
    props: Record<string, unknown>;
  };
  content: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
};

const colorPattern = /^#[0-9a-fA-F]{6}$/;

function fallbackColor(value: string | undefined, fallback: string) {
  return typeof value === "string" && colorPattern.test(value) ? value : fallback;
}

export function normalizeTheme(theme: CmsTheme | null | undefined) {
  return {
    primary: fallbackColor(theme?.primary, safeTheme.primary),
    secondary: fallbackColor(theme?.secondary, safeTheme.secondary),
    background: fallbackColor(theme?.background, safeTheme.background)
  };
}

export function themeStyle(theme: CmsTheme | null | undefined) {
  const normalized = normalizeTheme(theme);
  return {
    "--color-primary": normalized.primary,
    "--color-secondary": normalized.secondary,
    "--color-background": normalized.background
  };
}

export const defaultSections: CmsSection[] = [
  {
    section_type: "hero",
    title: "Hero",
    description: "Primary landing section with the main value proposition."
  },
  {
    section_type: "why",
    title: "Why VORTKART",
    description: "Reasons to trust the brand and the products."
  },
  {
    section_type: "products",
    title: "Products",
    description: "Featured product grid for the homepage."
  },
  {
    section_type: "racing_stories",
    title: "Racing Stories",
    description: "Proof from the track and customer stories."
  },
  {
    section_type: "culture",
    title: "Culture",
    description: "Brand and community section."
  },
  {
    section_type: "technology",
    title: "Technology",
    description: "Technical differentiators and systems."
  },
  {
    section_type: "contact",
    title: "Contact",
    description: "Inquiry and next-step call to action."
  }
];

export const defaultPageData: CmsPageData = {
  root: {
    type: "page",
    props: {
      slug: "home",
      title: "Home",
      sectionCount: defaultSections.length
    }
  },
  content: defaultSections.map((section) => ({
    type: "homepageSection",
    props: {
      section_type: section.section_type,
      title: section.title,
      description: section.description ?? ""
    }
  }))
};
