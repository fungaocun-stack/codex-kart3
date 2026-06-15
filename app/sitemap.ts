import type { MetadataRoute } from "next";
import { getPages, getProducts, getProjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, projects, pages] = await Promise.all([getProducts(), getProjects(), getPages(false)]);

  const routes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/projects",
    "/contact",
    ...pages.map((page) => `/pages/${page.slug}`)
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  return routes
    .concat(products.map((product) => ({ url: `${base}/products/${product.slug}`, lastModified: new Date() })))
    .concat(projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: new Date() })));
}
