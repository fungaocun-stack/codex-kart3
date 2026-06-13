"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? products : products.filter(p => p.category === filter);
  return <><div className="mb-10 flex flex-wrap gap-2">{["All","Rental","Racing","Electric"].map(x => <button key={x} onClick={() => setFilter(x)} className={`border px-5 py-2 text-xs font-bold uppercase ${filter === x ? "border-race bg-race text-black" : "border-white/20"}`}>{x}</button>)}</div>
  <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">{shown.map(p => <Link href={`/products/${p.slug}`} key={p.id} className="group bg-ink p-4">
    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900"><Image src={p.images[0]} alt={p.name} fill className="object-cover transition duration-700 group-hover:scale-105"/></div>
    <div className="flex items-end justify-between gap-4 py-5"><div><span className="text-xs font-bold uppercase text-race">{p.category}</span><h2 className="mt-2 text-xl font-black uppercase">{p.name}</h2></div><span className="text-2xl text-race">↗</span></div>
  </Link>)}</div></>;
}
