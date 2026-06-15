import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VisualPageRender } from "@/components/visual-page-render";
import { getPage, getProducts, getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || undefined
  };
}

export default async function VisualPage({ params }: Props) {
  const { slug } = await params;
  const [page, products, projects] = await Promise.all([getPage(slug), getProducts(), getProjects()]);

  if (!page || page.published === false) {
    notFound();
  }

  if (!page.content) {
    return null;
  }

  return <VisualPageRender page={page} catalog={{ products, projects }} />;
}
