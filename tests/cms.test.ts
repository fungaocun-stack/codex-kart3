import { describe, expect, it } from "vitest";
import { defaultPageData, defaultSections, normalizeTheme, themeStyle } from "@/lib/cms";

describe("visual CMS contracts", () => {
  it("normalizes invalid theme colors to safe defaults", () => {
    expect(normalizeTheme({ primary: "orange", secondary: "#fff", background: "" })).toEqual({
      primary: "#ff5a00",
      secondary: "#ffffff",
      background: "#070707"
    });
  });

  it("creates CSS variables from the saved theme", () => {
    expect(themeStyle({ primary: "#112233", secondary: "#abcdef", background: "#010203" })).toEqual({
      "--color-primary": "#112233",
      "--color-secondary": "#abcdef",
      "--color-background": "#010203"
    });
  });

  it("ships editable homepage sections and visual page data", () => {
    expect(defaultSections.map((section) => section.section_type)).toEqual([
      "hero", "why", "products", "racing_stories", "culture", "technology", "contact"
    ]);
    expect(defaultPageData.root).toBeDefined();
    expect(defaultPageData.content.length).toBeGreaterThan(0);
  });
});
