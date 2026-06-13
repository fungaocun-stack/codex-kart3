import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/validation";
import { makeSlug } from "@/lib/utils";
import { getFallbackProducts } from "@/lib/fallback-data";

describe("core content behavior", () => {
  it("normalizes a product name into a stable slug", () => {
    expect(makeSlug("VORT KZ Racing Chassis")).toBe("vort-kz-racing-chassis");
  });

  it("rejects incomplete inquiry submissions", () => {
    expect(inquirySchema.safeParse({ name: "", email: "bad" }).success).toBe(false);
  });

  it("ships a useful product catalog before Supabase is configured", () => {
    expect(getFallbackProducts().length).toBeGreaterThanOrEqual(6);
    expect(getFallbackProducts().every((product) => product.slug && product.images.length)).toBe(true);
  });
});
