import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/data";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Kart Collection", description: "Explore VORTKART racing, rental and electric karts." };
export default async function ProductsPage(){return <section className="section pt-32"><div className="section-inner"><p className="eyebrow">Machines</p><h1 className="mt-4 text-5xl font-black uppercase md:text-8xl">Choose your line.</h1><p className="mb-14 mt-6 max-w-xl text-white/55">Competition chassis and commercial fleets engineered around the way you race and operate.</p><ProductGrid products={await getProducts()}/></div></section>}
