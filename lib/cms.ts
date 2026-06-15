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

function hexToRgbChannels(value: string) {
  const hex = value.replace("#", "");
  return `${Number.parseInt(hex.slice(0, 2), 16)} ${Number.parseInt(hex.slice(2, 4), 16)} ${Number.parseInt(hex.slice(4, 6), 16)}`;
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
    "--color-background": normalized.background,
    "--color-primary-rgb": hexToRgbChannels(normalized.primary),
    "--color-secondary-rgb": hexToRgbChannels(normalized.secondary),
    "--color-background-rgb": hexToRgbChannels(normalized.background)
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
      title: "Home"
    }
  },
  content: [
    {
      type: "Hero",
      props: {
        eyebrow: "Machines",
        title: "Choose your line.",
        description: "Competition chassis and commercial fleets engineered around the way you race and operate.",
        ctaLabel: "Build your track",
        ctaHref: "/contact",
        imageUrl: "/media/hero.jpg",
        imageAlt: "VORTKART racing start"
      }
    },
    {
      type: "RichText",
      props: {
        title: "Why VORTKART",
        body: "Every lap starts with a stronger system.\n\nA practical partner for drivers, operators and track builders."
      }
    },
    {
      type: "ProductShowcase",
      props: {
        title: "Products",
        intro: "Featured machines from the current lineup.",
        productSlugs: "kz-racing-chassis, ok-racing-chassis, phantom-electric-kart, fs200-rental-kart"
      }
    },
    {
      type: "CaseStudyShowcase",
      props: {
        title: "Racing Stories",
        intro: "Proof from the track and support from the circuit.",
        projectSlugs: "built-around-race-day, partners-at-the-track"
      }
    },
    {
      type: "RichText",
      props: {
        title: "Culture",
        body: "Karting culture, community and the shared language of speed."
      }
    },
    {
      type: "RichText",
      props: {
        title: "Technology",
        body: "Speed, made repeatable.\n\nTrack systems, fleet reliability and performance tooling."
      }
    },
    {
      type: "CTA",
      props: {
        title: "Build Your Track.",
        description: "Tell us what you want to create. We will help shape the fleet, systems and support around it.",
        ctaLabel: "Contact us",
        ctaHref: "/contact"
      }
    }
  ]
};
