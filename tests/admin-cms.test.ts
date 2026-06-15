import { describe, expect, it } from "vitest";
import { adminNavItems, createAdminDraft, resolveAdminResource } from "@/lib/admin-cms";

describe("admin foundation contracts", () => {
  it("maps route slugs back to CMS resources", () => {
    expect(resolveAdminResource("site-settings")).toBe("site_settings");
    expect(resolveAdminResource("homepage-sections")).toBe("page_sections");
    expect(resolveAdminResource("products")).toBe("products");
  });

  it("exposes route-aware admin navigation in a stable order", () => {
    expect(adminNavItems.map((item) => item.href)).toEqual([
      "/admin/products",
      "/admin/projects",
      "/admin/site-settings",
      "/admin/inquiries",
      "/admin/homepage-sections",
      "/admin/pages"
    ]);
  });

  it("creates safe starter drafts for structured content", () => {
    expect(createAdminDraft("products")).toMatchObject({
      category: "Rental",
      featured: false,
      published: true,
      images: [],
      specs: {},
      seo_title: "",
      seo_description: ""
    });

    expect(createAdminDraft("site_settings")).toMatchObject({
      id: 1,
      site_name: "",
      theme: {
        primary: "#ff5a00",
        secondary: "#ffffff",
        background: "#070707"
      }
    });

    expect(createAdminDraft("page_sections")).toMatchObject({
      section_type: "hero",
      title: "",
      sort_order: 0,
      published: true,
      content: {
        eyebrow: "",
        headline: "",
        description: "",
        cta_label: "",
        cta_url: "",
        media_url: "",
        items: []
      }
    });
  });
});
