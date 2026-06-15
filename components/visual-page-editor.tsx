"use client";

import { useEffect, useMemo, useState } from "react";
import { Puck } from "@measured/puck";
import { buildVisualPageConfig, buildVisualPagePayload, createVisualPageDraft, type VisualPageCatalog, type VisualPageRecord } from "@/lib/visual-pages";
import type { Product, Project } from "@/lib/types";
import { MediaField, SaveBanner, TextAreaField, TextField, ToggleField } from "@/components/admin-fields";

type Props = {
  page: VisualPageRecord;
  onClose: () => void;
  onSave: (nextValue: Record<string, unknown>) => Promise<void>;
  requestResource: (resource: "products" | "projects") => Promise<Product[] | Project[]>;
};

export function VisualPageEditor({ page, onClose, onSave, requestResource }: Props) {
  const [draft, setDraft] = useState<VisualPageRecord>(createVisualPageDraft(page));
  const [catalog, setCatalog] = useState<VisualPageCatalog>({ products: [], projects: [] });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(createVisualPageDraft(page));
  }, [page]);

  useEffect(() => {
    let mounted = true;
    Promise.all([requestResource("products"), requestResource("projects")]).then(([products, projects]) => {
      if (!mounted) return;
      setCatalog({ products: products as Product[], projects: projects as Project[] });
    });
    return () => {
      mounted = false;
    };
  }, [requestResource]);

  const config = useMemo(() => buildVisualPageConfig(catalog), [catalog]);
  const puckData = (draft.content ?? { root: { type: "page", props: {} }, content: [] }) as never;

  async function persist(published: boolean) {
    try {
      setStatus("saving");
      const nextDraft = { ...draft, published };
      await onSave(buildVisualPagePayload(nextDraft));
      setStatus("saved");
      setMessage(published ? "Published." : "Saved draft.");
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-black/90 p-5 pt-20">
      <div className="mx-auto max-w-7xl border border-white/10 bg-zinc-950 p-5 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Visual Pages</p>
            <h2 className="mt-2 text-2xl font-black uppercase">{draft.title}</h2>
            <p className="mt-1 text-sm text-white/45">Puck blocks only. No JSON editor.</p>
          </div>
          <button onClick={onClose} className="border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[.18em]">
            Close
          </button>
        </div>

        <SaveBanner status={status} />
        {message ? <p className="mt-3 text-sm text-race">{message}</p> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4">
            <TextField label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: value }))} />
            <TextField label="Title" value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
            <TextField label="SEO title" value={draft.seo_title ?? ""} onChange={(value) => setDraft((current) => ({ ...current, seo_title: value }))} />
            <TextAreaField label="SEO description" value={draft.seo_description ?? ""} onChange={(value) => setDraft((current) => ({ ...current, seo_description: value }))} rows={4} />
            <ToggleField label="Published" checked={draft.published !== false} onChange={(value) => setDraft((current) => ({ ...current, published: value }))} />
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void persist(false)} className="border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-[.18em]">
                Save draft
              </button>
              <button onClick={() => void persist(true)} className="bg-race px-4 py-3 text-xs font-black uppercase tracking-[.18em] text-black">
                Publish page
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-sm border border-white/10 bg-black/30 p-3 text-xs text-white/45">
              The builder saves section content through curated Puck blocks and keeps the underlying JSON out of the interface.
            </div>
            <div className="rounded-sm border border-white/10 bg-black/30 p-3 text-xs text-white/45">
              Use the canvas below to arrange hero, content, gallery, showcase, CTA, and FAQ/spec sections.
            </div>
          </div>
        </div>

        <div className="mt-8 border border-white/10 bg-black/30 p-3">
          <Puck
            config={config as never}
            data={puckData}
            onChange={(next) => setDraft((current) => ({ ...current, content: next }))}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="border border-white/20 px-5 py-3 uppercase">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
