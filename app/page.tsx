import { HomeFallback } from "@/components/home-fallback";
import { VisualPageRender } from "@/components/visual-page-render";
import { getPage, getProducts, getProjects, getSettings } from "@/lib/data";

export default async function Home() {
  const [page, products, projects, settings] = await Promise.all([getPage("home"), getProducts(), getProjects(), getSettings()]);

  if (page?.content) {
    return <VisualPageRender page={page} catalog={{ products, projects }} />;
  }

  return <HomeFallback products={products} projects={projects} settings={settings} />;
}
