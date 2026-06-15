import { describe, expect, it } from "vitest";
import { buildVisualPageConfig, buildVisualPagePayload, createVisualPageDraft, visualPageBlockNames } from "@/lib/visual-pages";

describe("visual page builder", () => {
  it("exposes a curated Puck block library", () => {
    expect(visualPageBlockNames).toEqual([
      "Hero",
      "RichText",
      "MediaGallery",
      "ProductShowcase",
      "CaseStudyShowcase",
      "CTA",
      "FaqSpecs"
    ]);
    expect(Object.keys(buildVisualPageConfig({ products: [], projects: [] }).components)).toEqual(visualPageBlockNames);
  });

  it("creates a safe default visual page draft", () => {
    expect(createVisualPageDraft()).toMatchObject({
      slug: "home",
      title: "Home",
      published: true,
      seo_title: "VORTKART | Born For Racing",
      content: {
        root: {
          type: "page"
        }
      }
    });
  });

  it("strips ui-only fields from visual page save payloads", () => {
    expect(
      buildVisualPagePayload({
        id: "page-1",
        slug: "launch",
        title: "Launch",
        published: true,
        seo_title: "Launch",
        seo_description: "Launch page",
        content: {
          root: { type: "page", props: {} },
          content: [{ id: "hero-1", type: "Hero", props: { title: "Launch" } }]
        },
        uiPreview: "preview",
        _ephemeral: true
      })
    ).toMatchObject({
      id: "page-1",
      slug: "launch",
      title: "Launch",
      published: true,
      seo_title: "Launch",
      seo_description: "Launch page",
      content: {
        root: { type: "page", props: {} },
        content: [{ type: "Hero", props: { title: "Launch" } }]
      }
    });
  });
});
