import { describe, expect, it } from "vitest";
import { adminFormDefinitions, buildAdminPayload } from "@/lib/admin-forms";
import { createAdminDraft } from "@/lib/admin-cms";

describe("structured admin forms", () => {
  it("describes beginner-friendly modules without a JSON editor", () => {
    expect(adminFormDefinitions.products.hasJsonEditor).toBe(false);
    expect(adminFormDefinitions.projects.hasJsonEditor).toBe(false);
    expect(adminFormDefinitions.site_settings.hasJsonEditor).toBe(false);
    expect(adminFormDefinitions.inquiries.hasJsonEditor).toBe(false);
    expect(adminFormDefinitions.page_sections.hasJsonEditor).toBe(false);
    expect(adminFormDefinitions.products.sections.flatMap((section) => section.fields.map((field) => field.kind))).not.toContain("json");
  });

  it("creates safe defaults for homepage sections", () => {
    expect(createAdminDraft("page_sections")).toMatchObject({
      section_type: "hero",
      title: "",
      sort_order: 0,
      published: true
    });
  });

  it("filters ui-only fields from save payloads", () => {
    expect(
      buildAdminPayload("products", {
        id: "prod-1",
        name: "KZ Racing",
        slug: "kz-racing",
        _uploadState: "done",
        uiPreview: "preview",
        images: ["https://example.com/kz.png"],
        specs: { Frame: "30 mm" }
      })
    ).toEqual({
      id: "prod-1",
      name: "KZ Racing",
      slug: "kz-racing",
      description: "",
      category: "Rental",
      price: null,
      images: ["https://example.com/kz.png"],
      brochure_url: "",
      specs: { Frame: "30 mm" },
      featured: false,
      published: true,
      sort_order: 0,
      seo_title: "",
      seo_description: ""
    });

    expect(
      buildAdminPayload("inquiries", {
        id: "inq-1",
        name: "Buyer",
        email: "buyer@example.com",
        status: "Contacted",
        notes: "Call back tomorrow",
        uiPreview: "preview"
      })
    ).toEqual({
      id: "inq-1",
      status: "Contacted",
      notes: "Call back tomorrow"
    });

    expect(
      buildAdminPayload("page_sections", {
        id: "sec-1",
        page_id: "page-1",
        section_type: "hero",
        title: "Hero",
        sort_order: 2,
        published: false,
        content: { headline: "Born for racing" },
        tempUiState: true
      })
    ).toEqual({
      id: "sec-1",
      page_id: "page-1",
      section_type: "hero",
      title: "Hero",
      sort_order: 2,
      published: false,
      content: { headline: "Born for racing" }
    });
  });
});
