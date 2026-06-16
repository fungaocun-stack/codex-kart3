import { describe, expect, it } from "vitest";
import { defaultPageData, defaultSections, normalizeTheme, resolveLogoDisplay, themeStyle } from "@/lib/cms";

describe("visual CMS contracts", () => {
  it("normalizes invalid theme colors to safe defaults", () => {
    expect(normalizeTheme({ primary: "orange", secondary: "#fff", background: "" })).toEqual({
      primary: "#ff5a00",
      secondary: "#ffffff",
      background: "#070707"
    });
  });

  it("creates CSS variables from the saved theme", () => {
    expect(themeStyle({ primary: "#112233", secondary: "#abcdef", background: "#010203" })).toMatchObject({
      "--color-primary": "#112233",
      "--color-secondary": "#abcdef",
      "--color-background": "#010203",
      "--color-primary-rgb": "17 34 51",
      "--color-secondary-rgb": "171 205 239",
      "--color-background-rgb": "1 2 3"
    });
  });

  it("resolves text and image logo modes without the hardcoded brand prefix", () => {
    expect(
      resolveLogoDisplay({
        logo_mode: "text",
        logo_text: "VORTKART",
        logo_text_color: "#ff5a00",
        site_name: "VORTKART"
      })
    ).toEqual({
      mode: "text",
      text: "VORTKART",
      color: "#ff5a00"
    });

    expect(
      resolveLogoDisplay({
        logo_mode: "image",
        logo_url: "/media/logo.png",
        logo_alt: "VORTKART logo",
        site_name: "VORTKART"
      })
    ).toEqual({
      mode: "image",
      src: "/media/logo.png",
      alt: "VORTKART logo"
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
