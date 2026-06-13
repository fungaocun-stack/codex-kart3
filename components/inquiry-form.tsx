"use client";
import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
export function InquiryForm({ interest = "" }: { interest?: string }) {
  const [status, setStatus] = useState("");
  async function submit(formData: FormData) {
    setStatus("sending");
    const body = Object.fromEntries(formData);
    const res = await fetch("/api/inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setStatus(res.ok ? "sent" : "error");
  }
  return <form action={submit} className="grid gap-4">
    <div className="grid gap-4 md:grid-cols-2"><input name="name" required placeholder="Your name *"/><input name="email" type="email" required placeholder="Business email *"/></div>
    <div className="grid gap-4 md:grid-cols-2"><input name="company" placeholder="Company"/><input name="country" placeholder="Country / Region"/></div>
    <input name="interest" defaultValue={interest} placeholder="What are you interested in?"/>
    <textarea name="message" required minLength={10} rows={5} placeholder="Tell us about your track, fleet, or racing goals *"/>
    <button className="flex items-center justify-center gap-2 bg-race px-6 py-4 font-black uppercase text-black" disabled={status === "sending"}>{status === "sending" ? <LoaderCircle className="animate-spin"/> : <>Send inquiry <ArrowRight size={18}/></>}</button>
    {status === "sent" && <p className="text-sm text-green-400">Thank you. Our racing solutions team will contact you soon.</p>}
    {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please check your details and try again.</p>}
  </form>;
}
