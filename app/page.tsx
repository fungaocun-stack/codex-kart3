import { HomeFallback } from "@/components/home-fallback";
import { getHomepageSections, getProducts, getProjects, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [products, projects, settings, sections] = await Promise.all([getProducts(), getProjects(), getSettings(), getHomepageSections()]);
  return <HomeFallback products={products} projects={projects} settings={settings} sections={sections} />;
}
