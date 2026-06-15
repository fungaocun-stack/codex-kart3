"use client";

import { Plus, Trash2, Upload } from "lucide-react";

type BaseFieldProps = {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function FieldFrame({ label, hint, className, children }: BaseFieldProps) {
  return (
    <label className={className ?? "grid gap-2"}>
      <span className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</span>
      {children}
      {hint ? <span className="text-xs text-white/40">{hint}</span> : null}
    </label>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: string;
  placeholder?: string;
};

export function TextField({ label, value, onChange, hint, type = "text", placeholder }: TextFieldProps) {
  return (
    <FieldFrame label={label} hint={hint}>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </FieldFrame>
  );
}

type TextAreaFieldProps = TextFieldProps & { rows?: number };

export function TextAreaField({ label, value, onChange, hint, placeholder, rows = 5 }: TextAreaFieldProps) {
  return (
    <FieldFrame label={label} hint={hint}>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </FieldFrame>
  );
}

type ToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
};

export function ToggleField({ label, checked, onChange, hint }: ToggleFieldProps) {
  return (
    <label className="flex items-center justify-between gap-4 border border-white/10 bg-zinc-950 p-4">
      <div className="grid gap-1">
        <span className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</span>
        {hint ? <span className="text-xs text-white/40">{hint}</span> : null}
      </div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5" />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  hint?: string;
};

export function SelectField({ label, value, options, onChange, hint }: SelectFieldProps) {
  return (
    <FieldFrame label={label} hint={hint}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}

type RepeaterFieldProps = {
  label: string;
  items: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  placeholder?: string;
  buttonLabel?: string;
};

export function RepeaterField({ label, items, onChange, hint, placeholder, buttonLabel = "Add item" }: RepeaterFieldProps) {
  const updateItem = (index: number, nextValue: string) => {
    const next = [...items];
    next[index] = nextValue;
    onChange(next);
  };

  const removeItem = (index: number) => onChange(items.filter((_, itemIndex) => itemIndex !== index));
  const addItem = () => onChange([...items, ""]);

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</p>
          {hint ? <p className="mt-2 text-xs text-white/40">{hint}</p> : null}
        </div>
        <button type="button" onClick={addItem} className="flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.15em]">
          <Plus size={14} />
          {buttonLabel}
        </button>
      </div>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-3">
            <input value={item} placeholder={placeholder} onChange={(event) => updateItem(index, event.target.value)} />
            <button type="button" onClick={() => removeItem(index)} className="border border-white/15 px-3">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type KeyValueRepeaterFieldProps = {
  label: string;
  items: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  hint?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  buttonLabel?: string;
};

export function KeyValueRepeaterField({
  label,
  items,
  onChange,
  hint,
  keyPlaceholder = "Label",
  valuePlaceholder = "Value",
  buttonLabel = "Add row"
}: KeyValueRepeaterFieldProps) {
  const entries = Object.entries(items);
  const updateEntry = (index: number, nextKey: string, nextValue: string) => {
    const nextEntries = entries.map((entry, entryIndex) => (entryIndex === index ? [nextKey, nextValue] : entry));
    onChange(Object.fromEntries(nextEntries.filter(([key]) => key.trim())));
  };

  const removeEntry = (index: number) => onChange(Object.fromEntries(entries.filter((_, entryIndex) => entryIndex !== index)));
  const addEntry = () => onChange({ ...items, "": "" });

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</p>
          {hint ? <p className="mt-2 text-xs text-white/40">{hint}</p> : null}
        </div>
        <button type="button" onClick={addEntry} className="flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.15em]">
          <Plus size={14} />
          {buttonLabel}
        </button>
      </div>
      <div className="grid gap-3">
        {entries.map(([key, value], index) => (
          <div key={`${label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input value={key} placeholder={keyPlaceholder} onChange={(event) => updateEntry(index, event.target.value, value)} />
            <input value={value} placeholder={valuePlaceholder} onChange={(event) => updateEntry(index, key, event.target.value)} />
            <button type="button" onClick={() => removeEntry(index)} className="border border-white/15 px-3">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type MediaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  accept?: string;
  onUpload?: (file: File) => Promise<string>;
};

export function MediaField({ label, value, onChange, hint, accept = "image/*,video/*,.pdf", onUpload }: MediaFieldProps) {
  const preview = renderMediaPreview(value);
  return (
    <div className="grid gap-2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</p>
          {hint ? <p className="mt-2 text-xs text-white/40">{hint}</p> : null}
        </div>
        {onUpload ? (
          <label className="flex cursor-pointer items-center gap-2 border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.15em]">
            <Upload size={14} />
            Upload
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                onChange(await onUpload(file));
                event.currentTarget.value = "";
              }}
            />
          </label>
        ) : null}
      </div>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
      {preview ? <div className="overflow-hidden border border-white/10 bg-black/20 p-2">{preview}</div> : null}
    </div>
  );
}

type MediaListFieldProps = {
  label: string;
  items: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  accept?: string;
  onUpload?: (file: File) => Promise<string>;
};

export function MediaListField({ label, items, onChange, hint, accept = "image/*,video/*,.pdf", onUpload }: MediaListFieldProps) {
  const updateItem = (index: number, nextValue: string) => {
    const next = [...items];
    next[index] = nextValue;
    onChange(next);
  };

  const addItem = () => onChange([...items, ""]);
  const removeItem = (index: number) => onChange(items.filter((_, itemIndex) => itemIndex !== index));

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-white/60">{label}</p>
          {hint ? <p className="mt-2 text-xs text-white/40">{hint}</p> : null}
        </div>
        <button type="button" onClick={addItem} className="flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.15em]">
          <Plus size={14} />
          Add media
        </button>
      </div>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="grid gap-2 border border-white/10 bg-zinc-950 p-3">
            <div className="flex flex-wrap items-center gap-3">
              <input value={item} placeholder="/media/example.jpg" onChange={(event) => updateItem(index, event.target.value)} />
              <button type="button" onClick={() => removeItem(index)} className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.15em]">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-white/45">
              <span className="break-all">{item || "Empty"}</span>
              {onUpload ? (
                <label className="flex cursor-pointer items-center gap-2 border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.15em]">
                  <Upload size={14} />
                  Upload
                  <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      updateItem(index, await onUpload(file));
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              ) : null}
            </div>
            {renderMediaPreview(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SaveBanner({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "idle") return null;
  const palette = status === "error" ? "border-red-500/40 bg-red-950/30 text-red-200" : status === "saved" ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-200" : "border-white/15 bg-white/5 text-white/70";
  const text = status === "saving" ? "Saving changes..." : status === "saved" ? "Saved successfully." : "Save failed.";
  return <div className={`border px-4 py-3 text-sm ${palette}`}>{text}</div>;
}

function renderMediaPreview(value: string) {
  if (!value) return null;
  if (/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(value) || value.startsWith("data:image/")) {
    return <img src={value} alt="" className="h-32 w-full rounded-sm object-cover" />;
  }
  if (/\.(mp4|webm|mov)$/i.test(value) || value.startsWith("data:video/")) {
    return <video src={value} controls className="h-32 w-full rounded-sm object-cover" />;
  }
  if (/\.pdf$/i.test(value) || value.startsWith("data:application/pdf")) {
    return <div className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[.18em] text-white/60">PDF attached</div>;
  }
  return <a href={value} target="_blank" rel="noreferrer" className="break-all text-xs text-race underline">{value}</a>;
}
