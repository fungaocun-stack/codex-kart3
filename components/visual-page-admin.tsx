"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Plus, RefreshCw, Trash2 } from "lucide-react";
import { browserSupabase, isSupabaseConfigured, missingPublicSupabaseEnv } from "@/lib/supabase";
import { adminNavItems, createAdminDraft } from "@/lib/admin-cms";
import { VisualPageEditor } from "@/components/visual-page-editor";
import type { VisualPageRecord } from "@/lib/types";

type Row = Record<string, unknown> & { id?: unknown; slug?: string; title?: string; published?: boolean };

export function VisualPageAdmin() {
  const [session, setSession] = useState<any>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<VisualPageRecord | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

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
  }, [session]);

  async function request(method = "GET", body?: Row, id?: string) {
    const token = session?.access_token;
    const response = await fetch(`/api/admin/pages${id ? `?id=${id}` : ""}`, {
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
      setRows(await request());
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message);
    }
  }

  function openDraft(row?: Row) {
    setEditing(createAdminDraft("pages", row ?? {}) as VisualPageRecord);
    setStatus("idle");
    setMessage("");
  }

  if (!configured) {
    const missing = missingPublicSupabaseEnv();
    return (
      <Shell>
        <div className="mx-auto max-w-xl border border-race p-8">
          <h1 className="text-3xl font-black uppercase">Connect Supabase</h1>
          <p className="mt-4 text-white/60">The visual page editor cannot read the required Supabase environment variables.</p>
          <div className="mt-5 border border-white/10 bg-black p-4 text-sm">
            <strong>Missing:</strong>
            {missing.map((value) => (
              <code className="mt-2 block text-race" key={value}>
                {value}
              </code>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <Login
          onDone={(nextMessage) => {
            setStatus("error");
            setMessage(nextMessage);
          }}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="grid gap-5 border border-white/10 bg-zinc-950 p-5">
          <div className="grid gap-3">
            <p className="eyebrow">VORTKART CMS</p>
            <h1 className="text-3xl font-black uppercase">Visual Pages</h1>
            <p className="text-sm text-white/50">Puck-based page builder with save and publish controls.</p>
          </div>
          <nav className="grid gap-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.resource}
                href={item.href}
                className={`border px-4 py-3 text-left transition ${
                  item.resource === "pages" ? "border-race bg-race/10 text-white" : "border-white/10 bg-black/30 text-white/70 hover:border-white/20"
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
              <p className="eyebrow">Visual Pages</p>
              <h2 className="mt-3 text-3xl font-black uppercase">Page builder</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void loadRows()} className="flex items-center gap-2 border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-[.18em]">
                <RefreshCw size={16} />
                Refresh
              </button>
              <button onClick={() => openDraft()} className="flex items-center gap-2 bg-race px-4 py-3 text-xs font-black uppercase tracking-[.18em] text-black">
                <Plus size={16} />
                New page
              </button>
            </div>
          </div>

          {status !== "idle" ? <p className={status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>{message}</p> : message ? <p className="text-sm text-race">{message}</p> : null}

          <div className="grid gap-3">
            {rows.map((row) => (
              <div key={String(row.id ?? row.slug ?? row.title)} className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-zinc-950 p-4">
                <div>
                  <p className="font-black uppercase">{String(row.title ?? row.slug ?? "Page")}</p>
                  <p className="mt-1 text-xs text-white/45">{pageSummary(row)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openDraft(row)} className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.18em]">
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("Delete this page?")) {
                        await request("DELETE", undefined, String(row.id));
                        await loadRows();
                      }
                    }}
                    className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.18em]"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editing ? (
        <VisualPageEditor
          page={editing}
          onClose={() => setEditing(null)}
          onSave={async (nextValue) => {
            try {
              setStatus("saving");
              await request("POST", nextValue as Row);
              setEditing(null);
              setMessage("Saved.");
              setStatus("saved");
              await loadRows();
            } catch (error) {
              setStatus("error");
              setMessage((error as Error).message);
            }
          }}
          requestResource={async (resource) => {
            const result = await fetch(`/api/admin/${resource}`, {
              headers: {
                authorization: `Bearer ${session?.access_token}`
              }
            });
            const data = await result.json();
            if (!result.ok) throw new Error(data.error);
            return data;
          }}
        />
      ) : null}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink px-5 pb-20 pt-28">
      <div className="mx-auto max-w-7xl">{children}</div>
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

function pageSummary(row: Row) {
  return [String(row.slug ?? ""), String(row.published === false ? "Draft" : "Published")].filter(Boolean).join(" · ");
}
