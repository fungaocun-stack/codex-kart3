import { HomeFallback } from "@/components/home-fallback";
import { VisualPageRender } from "@/components/visual-page-render";
import { getPage, getProducts, getProjects, getSettings } from "@/lib/data";
import { hasRenderableVisualPage } from "@/lib/visual-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [page, products, projects, settings] = await Promise.all([getPage("home"), getProducts(), getProjects(), getSettings()]);

  if (hasRenderableVisualPage(page)) {
    return <VisualPageRender page={page} catalog={{ products, projects }} />;
  }

  return <HomeFallback products={products} projects={projects} settings={settings} />;
}
