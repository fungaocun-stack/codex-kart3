import { notFound } from "next/navigation";
import { Render } from "@measured/puck";
import { buildVisualPageConfig, hasRenderableVisualPage, type VisualPageCatalog, type VisualPageRecord } from "@/lib/visual-pages";

type Props = {
  page: VisualPageRecord | null | undefined;
  catalog?: VisualPageCatalog;
};

export function VisualPageRender({ page, catalog = {} }: Props) {
  if (!page || !hasRenderableVisualPage(page)) {
    notFound();
  }

  return (
    <Render
      config={buildVisualPageConfig(catalog) as never}
      data={page.content as never}
      metadata={{
        title: page.seo_title || page.title,
        description: page.seo_description || undefined
      }}
    />
  );
}
