"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Products", "/products"], ["Racing Stories", "/projects"], ["Culture", "/#culture"], ["Technology", "/#technology"], ["Contact", "/contact"]];
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 lg:px-10">
      <Link href="/" className="text-xl font-black tracking-[.2em] text-white"><span className="text-race">V</span>ORTKART</Link>
      <nav className="hidden gap-8 text-xs font-bold uppercase tracking-[.15em] md:flex">{links.map(([a,b]) => <Link key={b} href={b} className="text-white/75 hover:text-race">{a}</Link>)}</nav>
      <Link href="/contact" className="hidden bg-race px-5 py-2 text-xs font-black uppercase text-black md:block">Build your track</Link>
      <button aria-label="Menu" className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav className="grid gap-5 border-t border-white/10 bg-black p-6 md:hidden">{links.map(([a,b]) => <Link onClick={() => setOpen(false)} key={b} href={b}>{a}</Link>)}</nav>}
  </header>;
}
