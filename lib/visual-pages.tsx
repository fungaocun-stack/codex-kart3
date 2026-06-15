import type React from "react";
import { defaultPageData } from "@/lib/cms";
import type { Product, Project } from "@/lib/types";

export type VisualPageCatalog = {
  products?: Product[];
  projects?: Project[];
};

export type VisualPageRecord = {
  id?: string;
  slug: string;
  title: string;
  seo_title?: string | null;
  seo_description?: string | null;
  published?: boolean;
  content?: unknown;
};

type PuckData = {
  root: {
    type: string;
    props: Record<string, unknown>;
  };
  content: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
};

type PuckComponentConfig = {
  fields: Record<string, { type: string; label?: string; options?: Array<{ label: string; value: string }> }>;
  render: (props: Record<string, unknown>) => React.ReactNode;
};

type PuckConfig = {
  components: Record<string, PuckComponentConfig>;
};

export const visualPageBlockNames = ["Hero", "RichText", "MediaGallery", "ProductShowcase", "CaseStudyShowcase", "CTA", "FaqSpecs"] as const;

const toLines = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const escape = (value: unknown) => String(value ?? "");

function cleanPuckData(value: unknown): PuckData {
  const fallback = defaultPageData as PuckData;
  if (!value || typeof value !== "object") return fallback;
  const node = value as Record<string, unknown>;
  return {
    root: cleanPuckNode(node.root) ?? fallback.root,
    content: Array.isArray(node.content) ? node.content.map((item) => cleanPuckNode(item)).filter(Boolean) as PuckData["content"] : fallback.content
  };
}

function cleanPuckNode(value: unknown): any {
  if (Array.isArray(value)) return value.map((item) => cleanPuckNode(item));
  if (!value || typeof value !== "object") return value;
  const node = value as Record<string, unknown>;
  const cleaned = Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => !/^(_|ui|temp|preview)/i.test(key) && key !== "id")
      .map(([key, entry]) => [key, cleanPuckNode(entry)])
  );
  return cleaned;
}

export function createVisualPageDraft(source: Partial<VisualPageRecord> = {}): VisualPageRecord {
  return {
    ...(typeof source.id === "string" && source.id ? { id: source.id } : {}),
    slug: source.slug ?? "home",
    title: source.title ?? "Home",
    seo_title: source.seo_title ?? "VORTKART | Born For Racing",
    seo_description: source.seo_description ?? "Karting culture, performance machines and complete track solutions.",
    published: source.published !== false,
    content: cleanPuckData(source.content)
  };
}

export function buildVisualPagePayload(draft: Record<string, unknown>) {
  const draftPage = createVisualPageDraft(draft as Partial<VisualPageRecord>);
  return {
    ...(draftPage.id ? { id: draftPage.id } : {}),
    slug: escape(draftPage.slug),
    title: escape(draftPage.title),
    seo_title: escape(draftPage.seo_title),
    seo_description: escape(draftPage.seo_description),
    published: draftPage.published !== false,
    content: cleanPuckData(draftPage.content)
  };
}

export function hasRenderableVisualPage(record: Partial<VisualPageRecord> | null | undefined) {
  return Boolean(record?.content && cleanPuckData(record.content).content.length > 0);
}

function listFromSlugs<T extends { slug: string }>(slugs: string[], items: T[]) {
  return slugs.map((slug) => items.find((item) => item.slug === slug)).filter(Boolean) as T[];
}

function sectionShell(title: string, children: React.ReactNode) {
  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">{title}</p>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

export function buildVisualPageConfig(catalog: VisualPageCatalog = {}): PuckConfig {
  const products = catalog.products ?? [];
  const projects = catalog.projects ?? [];

  return {
    components: {
      Hero: {
        fields: {
          eyebrow: { type: "text" },
          title: { type: "text" },
          description: { type: "textarea" },
          ctaLabel: { type: "text" },
          ctaHref: { type: "text" },
          imageUrl: { type: "text" },
          imageAlt: { type: "text" }
        },
        render: ({ eyebrow, title, description, ctaLabel, ctaHref, imageUrl, imageAlt }) => (
          <section className="relative overflow-hidden bg-black text-white">
            {imageUrl ? <img src={escape(imageUrl)} alt={escape(imageAlt)} className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
            <div className="relative mx-auto flex min-h-[78vh] max-w-[1500px] flex-col justify-end px-5 pb-16 pt-28 lg:px-10">
              <p className="eyebrow mb-5">{escape(eyebrow)}</p>
              <h1 className="display max-w-6xl">{escape(title)}</h1>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <p className="max-w-xl text-lg text-white/70">{escape(description)}</p>
                {ctaLabel && ctaHref ? (
                  <a className="flex items-center gap-2 bg-race px-6 py-4 text-sm font-black uppercase text-black" href={escape(ctaHref)}>
                    {escape(ctaLabel)}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        )
      },
      RichText: {
        fields: {
          title: { type: "text" },
          body: { type: "textarea" }
        },
        render: ({ title, body }) => sectionShell(escape(title), <div className="max-w-4xl whitespace-pre-wrap text-lg leading-8 text-white/75">{escape(body)}</div>)
      },
      MediaGallery: {
        fields: {
          title: { type: "text" },
          imageUrls: { type: "textarea" }
        },
        render: ({ title, imageUrls }) =>
          sectionShell(
            escape(title),
            <div className="grid gap-4 md:grid-cols-2">
              {toLines(escape(imageUrls)).map((src) => (
                <img key={src} src={src} alt={escape(title)} className="aspect-[16/10] w-full object-cover" />
              ))}
            </div>
          )
      },
      ProductShowcase: {
        fields: {
          title: { type: "text" },
          intro: { type: "textarea" },
          productSlugs: { type: "textarea" }
        },
        render: ({ title, intro, productSlugs }) =>
          sectionShell(
            escape(title),
            <>
              <p className="max-w-3xl text-white/55">{escape(intro)}</p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {listFromSlugs(toLines(escape(productSlugs)), products).map((product) => (
                  <article key={product.slug} className="group">
                    <div className="relative aspect-square overflow-hidden bg-zinc-100">
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-xs font-black uppercase text-race">{product.category}</p>
                    <h3 className="mt-1 text-xl font-black uppercase">{product.name}</h3>
                  </article>
                ))}
              </div>
            </>
          )
      },
      CaseStudyShowcase: {
        fields: {
          title: { type: "text" },
          intro: { type: "textarea" },
          projectSlugs: { type: "textarea" }
        },
        render: ({ title, intro, projectSlugs }) =>
          sectionShell(
            escape(title),
            <>
              <p className="max-w-3xl text-white/55">{escape(intro)}</p>
              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                {listFromSlugs(toLines(escape(projectSlugs)), projects).map((project) => (
                  <article key={project.slug}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={project.gallery[0]} alt={project.title} className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase text-race">
                      {project.location} · {project.year}
                    </p>
                    <h3 className="mt-2 text-3xl font-black uppercase">{project.title}</h3>
                    <p className="mt-3 max-w-xl text-white/55">{project.story}</p>
                  </article>
                ))}
              </div>
            </>
          )
      },
      CTA: {
        fields: {
          title: { type: "text" },
          description: { type: "textarea" },
          ctaLabel: { type: "text" },
          ctaHref: { type: "text" }
        },
        render: ({ title, description, ctaLabel, ctaHref }) => (
          <section className="section bg-race text-black">
            <div className="section-inner grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em]">Start a project</p>
                <h2 className="mt-4 text-5xl font-black uppercase md:text-8xl">{escape(title)}</h2>
                <p className="mt-6 max-w-xl text-black/65">{escape(description)}</p>
              </div>
              <div className="self-end">
                {ctaLabel && ctaHref ? (
                  <a className="inline-flex items-center gap-2 bg-black px-6 py-4 text-sm font-black uppercase text-white" href={escape(ctaHref)}>
                    {escape(ctaLabel)}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        )
      },
      FaqSpecs: {
        fields: {
          title: { type: "text" },
          intro: { type: "textarea" },
          question1: { type: "text" },
          answer1: { type: "textarea" },
          question2: { type: "text" },
          answer2: { type: "textarea" },
          spec1Label: { type: "text" },
          spec1Value: { type: "text" },
          spec2Label: { type: "text" },
          spec2Value: { type: "text" }
        },
        render: ({ title, intro, question1, answer1, question2, answer2, spec1Label, spec1Value, spec2Label, spec2Value }) => (
          <section className="section bg-white text-black">
            <div className="section-inner grid gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow">{escape(title)}</p>
                <p className="mt-4 max-w-xl text-lg text-black/65">{escape(intro)}</p>
                <dl className="mt-10 grid gap-4">
                  {[ [spec1Label, spec1Value], [spec2Label, spec2Value] ].map(([label, value]) =>
                    label ? (
                      <div key={String(label)} className="flex items-center justify-between gap-4 border-t border-black/10 pt-4">
                        <dt className="font-black uppercase">{escape(label)}</dt>
                        <dd>{escape(value)}</dd>
                      </div>
                    ) : null
                  )}
                </dl>
              </div>
              <div className="grid gap-4">
                {[ [question1, answer1], [question2, answer2] ].map(([question, answer]) =>
                  question ? (
                    <details key={String(question)} className="border border-black/10 p-5">
                      <summary className="cursor-pointer font-black uppercase">{escape(question)}</summary>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-black/70">{escape(answer)}</p>
                    </details>
                  ) : null
                )}
              </div>
            </div>
          </section>
        )
      }
    }
  };
}
