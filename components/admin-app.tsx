"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { browserSupabase, isSupabaseConfigured, missingPublicSupabaseEnv } from "@/lib/supabase";
import { adminNavItems, createAdminDraft, type AdminResource } from "@/lib/admin-cms";
import { adminFormDefinitions, buildAdminPayload } from "@/lib/admin-forms";
import { SaveBanner, TextField, TextAreaField, ToggleField, SelectField, RepeaterField, KeyValueRepeaterField, MediaField, MediaListField } from "@/components/admin-fields";

type Row = Record<string, unknown> & { id?: unknown; name?: string; title?: string; email?: string; status?: string };

const productCategories = [
  { label: "Rental", value: "Rental" },
  { label: "Racing", value: "Racing" },
  { label: "Electric", value: "Electric" }
];

export function AdminApp({ resource }: { resource: AdminResource }) {
  const [session, setSession] = useState<any>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const formDefinition = adminFormDefinitions[resource];

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    const s = browserSupabase();
    s.auth.getSession().then((result) => setSession(result.data.session));
    const { data } = s.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, [configured]);

  useEffect(() => {
    if (session) {
      void loadRows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, resource]);

  async function request(resourceName: AdminResource = resource, method = "GET", body?: Row, id?: string) {
    const token = session?.access_token;
    const response = await fetch(`/api/admin/${resourceName}${id ? `?id=${id}` : ""}`, {
      method,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }

  async function loadRows() {
    try {
      setMessage("");
      setStatus("idle");
      setRows(await request(resource));
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message);
    }
  }

  function openDraft(row?: Row) {
    setEditing(createAdminDraft(resource, row ?? {}));
    setStatus("idle");
    setMessage("");
  }

  async function uploadMedia(file: File) {
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error } = await browserSupabase().storage.from("media").upload(path, file);
    if (error) throw new Error(error.message);
    const { data } = browserSupabase().storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  if (!configured) {
    const missing = missingPublicSupabaseEnv();
    return (
      <AdminShell>
        <div className="mx-auto max-w-xl border border-race p-8">
          <h1 className="text-3xl font-black uppercase">Connect Supabase</h1>
          <p className="mt-4 text-white/60">The admin panel cannot read the required Supabase environment variables.</p>
          <div className="mt-5 border border-white/10 bg-black p-4 text-sm">
            <strong>Missing:</strong>
            {missing.map((value) => (
              <code className="mt-2 block text-race" key={value}>
                {value}
              </code>
            ))}
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!session) {
    return (
      <AdminShell>
        <Login
          onDone={(nextMessage) => {
            setStatus("error");
            setMessage(nextMessage);
          }}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="grid gap-5 border border-white/10 bg-zinc-950 p-5">
          <div className="grid gap-3">
            <p className="eyebrow">VORTKART CMS</p>
            <h1 className="text-3xl font-black uppercase">Content control</h1>
            <p className="text-sm text-white/50">Route-aware content tools for structured records and homepage content.</p>
          </div>
          <nav className="grid gap-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.resource}
                href={item.href}
                className={`border px-4 py-3 text-left transition ${
                  item.resource === resource ? "border-race bg-race/10 text-white" : "border-white/10 bg-black/30 text-white/70 hover:border-white/20"
                }`}
              >
                <span className="block text-sm font-black uppercase tracking-[.18em]">{item.label}</span>
                <span className="mt-1 block text-xs text-white/45">{item.description}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={() => browserSupabase().auth.signOut()}
            className="flex items-center justify-center gap-2 border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[.2em] text-white/70"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        <section className="grid gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{adminNavItems.find((item) => item.resource === resource)?.label ?? "CMS"}</p>
              <h2 className="mt-3 text-3xl font-black uppercase">{resource.replace("_", " ")}</h2>
              <p className="mt-2 text-sm text-white/45">{formDefinition.sections.length} structured sections, no JSON editor.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void loadRows()} className="flex items-center gap-2 border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-[.18em]">
                <RefreshCw size={16} />
                Refresh
              </button>
              {resource !== "inquiries" ? (
                <button onClick={() => openDraft()} className="flex items-center gap-2 bg-race px-4 py-3 text-xs font-black uppercase tracking-[.18em] text-black">
                  <Plus size={16} />
                  New {resource === "site_settings" ? "settings" : resource === "page_sections" ? "section" : resource.slice(0, -1)}
                </button>
              ) : null}
            </div>
          </div>

          <SaveBanner status={status} />
          {message ? <p className="text-sm text-race">{message}</p> : null}

          <div className="grid gap-3">
            {rows.map((row) => (
              <div key={String(row.id ?? row.email ?? row.title ?? row.name)} className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-zinc-950 p-4">
                <div>
                  <p className="font-black uppercase">{String(row.name ?? row.title ?? row.email ?? "Site settings")}</p>
                  <p className="mt-1 text-xs text-white/45">{recordSummary(resource, row)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openDraft(row)} className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.18em]">
                    Edit
                  </button>
                  {resource !== "site_settings" && resource !== "inquiries" ? (
                    <button
                      onClick={async () => {
                        if (confirm("Delete this item?")) {
                          await request(resource, "DELETE", undefined, String(row.id));
                          await loadRows();
                        }
                      }}
                      className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.18em]"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editing ? (
          <Editor
          resource={resource}
          value={editing}
          onClose={() => setEditing(null)}
          onSave={async (nextValue) => {
            try {
              setStatus("saving");
              await request(resource, "POST", buildAdminPayload(resource, nextValue) as Row);
              setEditing(null);
              setMessage("Saved.");
              setStatus("saved");
              await loadRows();
            } catch (error) {
              setStatus("error");
              setMessage((error as Error).message);
            }
          }}
          onUpload={uploadMedia}
        />
      ) : null}
    </AdminShell>
  );
}

function recordSummary(resource: AdminResource, row: Row) {
  if (resource === "products") {
    return [String(row.category ?? ""), String(row.published === false ? "Draft" : "Published"), String(row.featured ? "Featured" : "")].filter(Boolean).join(" · ");
  }
  if (resource === "projects") {
    return [String(row.location ?? ""), String(row.year ?? ""), String(row.published === false ? "Draft" : "Published")].filter(Boolean).join(" · ");
  }
  if (resource === "site_settings") {
    return "Global brand, navigation, and theme settings.";
  }
  if (resource === "page_sections") {
    return [String(row.section_type ?? ""), String(row.sort_order ?? ""), String(row.published === false ? "Draft" : "Published")].filter(Boolean).join(" · ");
  }
  return [String(row.status ?? ""), String(row.email ?? "")].filter(Boolean).join(" · ");
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink px-5 pb-20 pt-28">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}

function ReadOnlyField({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="grid gap-2 border border-white/10 bg-zinc-950 p-4">
      <span className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</span>
      <div className={multiline ? "whitespace-pre-wrap text-sm leading-6 text-white/80" : "text-sm text-white/80"}>{value || "—"}</div>
    </div>
  );
}

function Login({ onDone }: { onDone: (value: string) => void }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function login(formData: FormData) {
    setPending(true);
    setError("");
    const { error: authError } = await browserSupabase().auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });
    setPending(false);
    if (authError) {
      setError(authError.message);
      onDone(authError.message);
    }
  }

  return (
    <form action={login} className="mx-auto grid max-w-md gap-4 border border-white/10 bg-zinc-950 p-8">
      <p className="eyebrow">Secure CMS</p>
      <h1 className="text-3xl font-black uppercase">Admin login</h1>
      <input name="email" type="email" required autoComplete="email" placeholder="Email" />
      <input name="password" type="password" required autoComplete="current-password" placeholder="Password" />
      {error ? <p role="alert" className="border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p> : null}
      <button disabled={pending} className="bg-race p-4 font-black uppercase text-black disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function Editor({
  resource,
  value,
  onClose,
  onSave,
  onUpload
}: {
  resource: AdminResource;
  value: Row;
  onClose: () => void;
  onSave: (nextValue: Row) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}) {
  const [draft, setDraft] = useState<Row>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const setValue = (key: string, nextValue: unknown) => setDraft((current) => ({ ...current, [key]: nextValue }));

  const body =
    resource === "products" ? (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Name" value={String(draft.name ?? "")} onChange={(next) => setValue("name", next)} />
          <TextField label="Slug" value={String(draft.slug ?? "")} onChange={(next) => setValue("slug", next)} />
        </div>
        <SelectField label="Category" value={String(draft.category ?? "Rental")} options={productCategories} onChange={(next) => setValue("category", next)} />
        <TextAreaField label="Description" value={String(draft.description ?? "")} onChange={(next) => setValue("description", next)} rows={7} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="SEO title" value={String(draft.seo_title ?? "")} onChange={(next) => setValue("seo_title", next)} />
          <TextField label="SEO description" value={String(draft.seo_description ?? "")} onChange={(next) => setValue("seo_description", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Price" type="number" value={String(draft.price ?? "")} onChange={(next) => setValue("price", next === "" ? null : Number(next))} />
          <TextField label="Sort order" type="number" value={String(draft.sort_order ?? 0)} onChange={(next) => setValue("sort_order", next === "" ? 0 : Number(next))} />
        </div>
        <MediaField label="Brochure PDF" value={String(draft.brochure_url ?? "")} onChange={(next) => setValue("brochure_url", next)} hint="Upload a brochure and paste the public URL here." onUpload={onUpload} />
        <MediaListField label="Images" items={Array.isArray(draft.images) ? (draft.images as string[]) : []} onChange={(next) => setValue("images", next)} onUpload={onUpload} />
        <KeyValueRepeaterField label="Specs" items={isRecord(draft.specs) ? (draft.specs as Record<string, string>) : {}} onChange={(next) => setValue("specs", next)} keyPlaceholder="Spec" valuePlaceholder="Value" />
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField label="Featured" checked={Boolean(draft.featured)} onChange={(next) => setValue("featured", next)} />
          <ToggleField label="Published" checked={draft.published !== false} onChange={(next) => setValue("published", next)} />
        </div>
      </div>
    ) : resource === "projects" ? (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Title" value={String(draft.title ?? "")} onChange={(next) => setValue("title", next)} />
          <TextField label="Slug" value={String(draft.slug ?? "")} onChange={(next) => setValue("slug", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Client" value={String(draft.client ?? "")} onChange={(next) => setValue("client", next)} />
          <TextField label="Location" value={String(draft.location ?? "")} onChange={(next) => setValue("location", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Project type" value={String(draft.project_type ?? "")} onChange={(next) => setValue("project_type", next)} />
          <TextField label="Year" type="number" value={String(draft.year ?? new Date().getFullYear())} onChange={(next) => setValue("year", Number(next))} />
        </div>
        <TextAreaField label="Story" value={String(draft.story ?? "")} onChange={(next) => setValue("story", next)} rows={7} />
        <TextAreaField label="Testimonial" value={String(draft.testimonial ?? "")} onChange={(next) => setValue("testimonial", next)} rows={4} />
        <MediaListField label="Gallery" items={Array.isArray(draft.gallery) ? (draft.gallery as string[]) : []} onChange={(next) => setValue("gallery", next)} onUpload={onUpload} />
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField label="Featured" checked={Boolean(draft.featured)} onChange={(next) => setValue("featured", next)} />
          <ToggleField label="Published" checked={draft.published !== false} onChange={(next) => setValue("published", next)} />
        </div>
      </div>
    ) : resource === "site_settings" ? (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Site name" value={String(draft.site_name ?? "")} onChange={(next) => setValue("site_name", next)} />
          <TextField label="Tagline" value={String(draft.tagline ?? "")} onChange={(next) => setValue("tagline", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Logo mode" value={String(draft.logo_mode ?? "text")} options={[{ label: "Text", value: "text" }, { label: "Image", value: "image" }]} onChange={(next) => setValue("logo_mode", next)} />
          <TextField label="Logo text" value={String(draft.logo_text ?? draft.site_name ?? "") } onChange={(next) => setValue("logo_text", next)} hint="Shown when Logo mode is Text." />
        </div>
        {String(draft.logo_mode ?? "text") === "image" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <MediaField label="Logo URL" value={String(draft.logo_url ?? "")} onChange={(next) => setValue("logo_url", next)} onUpload={onUpload} />
            <TextField label="Logo alt text" value={String(draft.logo_alt ?? "")} onChange={(next) => setValue("logo_alt", next)} />
          </div>
        ) : (
          <TextField label="Logo text color" value={String(draft.logo_text_color ?? "#ffffff")} onChange={(next) => setValue("logo_text_color", next)} hint="Use a hex color like #ffffff." />
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Phone" value={String(draft.phone ?? "")} onChange={(next) => setValue("phone", next)} />
          <TextField label="Email" value={String(draft.email ?? "")} onChange={(next) => setValue("email", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Contact phone" value={String(draft.contact_phone ?? "")} onChange={(next) => setValue("contact_phone", next)} />
          <TextField label="Contact email" value={String(draft.contact_email ?? "")} onChange={(next) => setValue("contact_email", next)} />
        </div>
        <TextAreaField label="Address" value={String(draft.address ?? "")} onChange={(next) => setValue("address", next)} rows={3} />
        <KeyValueRepeaterField label="Social links" items={isRecord(draft.social_links) ? (draft.social_links as Record<string, string>) : {}} onChange={(next) => setValue("social_links", next)} keyPlaceholder="Network" valuePlaceholder="URL" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="SEO title" value={String(draft.seo_title ?? "")} onChange={(next) => setValue("seo_title", next)} />
          <TextField label="SEO description" value={String(draft.seo_description ?? "")} onChange={(next) => setValue("seo_description", next)} />
        </div>
        <MediaField label="Hero video URL" value={String(draft.hero_video_url ?? "")} onChange={(next) => setValue("hero_video_url", next)} onUpload={onUpload} />
        <div className="grid gap-4 md:grid-cols-2">
          <MediaField label="Favicon URL" value={String(draft.favicon_url ?? "")} onChange={(next) => setValue("favicon_url", next)} onUpload={onUpload} />
          <MediaField label="Open Graph image URL" value={String(draft.og_image_url ?? "")} onChange={(next) => setValue("og_image_url", next)} onUpload={onUpload} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Header CTA label" value={String(draft.header_cta_label ?? "")} onChange={(next) => setValue("header_cta_label", next)} />
          <TextField label="Header CTA URL" value={String(draft.header_cta_url ?? "")} onChange={(next) => setValue("header_cta_url", next)} />
        </div>
        <TextAreaField label="Footer note" value={String(draft.footer_note ?? "")} onChange={(next) => setValue("footer_note", next)} rows={3} />
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="Theme primary" value={String((draft.theme as { primary?: string } | undefined)?.primary ?? "")} onChange={(next) => setValue("theme", { ...(isRecord(draft.theme) ? draft.theme : {}), primary: next })} />
          <TextField label="Theme secondary" value={String((draft.theme as { secondary?: string } | undefined)?.secondary ?? "")} onChange={(next) => setValue("theme", { ...(isRecord(draft.theme) ? draft.theme : {}), secondary: next })} />
          <TextField label="Theme background" value={String((draft.theme as { background?: string } | undefined)?.background ?? "")} onChange={(next) => setValue("theme", { ...(isRecord(draft.theme) ? draft.theme : {}), background: next })} />
        </div>
      </div>
    ) : resource === "page_sections" ? (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Section type"
            value={String(draft.section_type ?? "hero")}
            options={[
              { label: "Hero", value: "hero" },
              { label: "Why", value: "why" },
              { label: "Products", value: "products" },
              { label: "Racing Stories", value: "racing_stories" },
              { label: "Culture", value: "culture" },
              { label: "Technology", value: "technology" },
              { label: "Contact", value: "contact" }
            ]}
            onChange={(next) => setValue("section_type", next)}
          />
          <TextField label="Title" value={String(draft.title ?? "")} onChange={(next) => setValue("title", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Sort order" type="number" value={String(draft.sort_order ?? 0)} onChange={(next) => setValue("sort_order", Number(next))} />
          <ToggleField label="Published" checked={draft.published !== false} onChange={(next) => setValue("published", next)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Eyebrow" value={String((draft.content as Record<string, unknown> | undefined)?.eyebrow ?? "")} onChange={(next) => setValue("content", { ...(isRecord(draft.content) ? draft.content : {}), eyebrow: next })} />
          <TextField label="Headline" value={String((draft.content as Record<string, unknown> | undefined)?.headline ?? "")} onChange={(next) => setValue("content", { ...(isRecord(draft.content) ? draft.content : {}), headline: next })} />
        </div>
        <TextAreaField
          label="Description"
          value={String((draft.content as Record<string, unknown> | undefined)?.description ?? "")}
          onChange={(next) => setValue("content", { ...(isRecord(draft.content) ? draft.content : {}), description: next })}
          rows={5}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="CTA label" value={String((draft.content as Record<string, unknown> | undefined)?.cta_label ?? "")} onChange={(next) => setValue("content", { ...(isRecord(draft.content) ? draft.content : {}), cta_label: next })} />
          <TextField label="CTA URL" value={String((draft.content as Record<string, unknown> | undefined)?.cta_url ?? "")} onChange={(next) => setValue("content", { ...(isRecord(draft.content) ? draft.content : {}), cta_url: next })} />
        </div>
        <MediaField
          label="Media URL"
          value={String((draft.content as Record<string, unknown> | undefined)?.media_url ?? "")}
          onChange={(next) => setValue("content", { ...(isRecord(draft.content) ? draft.content : {}), media_url: next })}
          onUpload={onUpload}
        />
      </div>
    ) : (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="Name" value={String(draft.name ?? "")} />
          <ReadOnlyField label="Email" value={String(draft.email ?? "")} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="Phone" value={String(draft.phone ?? "")} />
          <ReadOnlyField label="Company" value={String(draft.company ?? "")} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="Country" value={String(draft.country ?? "")} />
          <ReadOnlyField label="Interest" value={String(draft.interest ?? "")} />
        </div>
        <ReadOnlyField label="Message" value={String(draft.message ?? "")} multiline />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Status"
            value={String(draft.status ?? "New")}
            options={[
              { label: "New", value: "New" },
              { label: "Contacted", value: "Contacted" },
              { label: "Closed", value: "Closed" }
            ]}
            onChange={(next) => setValue("status", next)}
          />
          <TextAreaField label="Follow-up notes" value={String(draft.notes ?? "")} onChange={(next) => setValue("notes", next)} rows={6} />
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-black/90 p-5 pt-20">
      <div className="mx-auto max-w-4xl border border-white/10 bg-zinc-950 p-5 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Editing {resource.replace("_", " ")}</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Edit content</h2>
          </div>
          <button onClick={onClose} className="border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[.18em]">
            Close
          </button>
        </div>
        <div className="mt-6 grid gap-5">{body}</div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={async () => {
              await onSave(draft);
            }}
            className="flex items-center gap-2 bg-race px-5 py-3 font-black uppercase text-black"
          >
            <Save size={18} />
            Save
          </button>
          <button onClick={onClose} className="border border-white/20 px-5 py-3 uppercase">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}



