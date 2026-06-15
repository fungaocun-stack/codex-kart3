import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getProduct, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  return (
    <section className="pb-24 pt-16">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, image: p.images }} />
      <div className="relative min-h-[75vh]">
        <Image src={p.images[0]} alt={p.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
        <div className="absolute bottom-10 left-5 right-5 mx-auto max-w-[1500px]">
          <p className="eyebrow">{p.category}</p>
          <h1 className="mt-3 text-5xl font-black uppercase md:text-8xl">{p.name}</h1>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black uppercase">Built to perform.</h2>
          <p className="mt-5 text-lg leading-8 text-white/60">{p.description}</p>
          <div className="mt-8 flex gap-3">
            {p.brochure_url && (
              <a className="border border-white/20 px-5 py-3 font-bold uppercase" href={p.brochure_url}>
                Download brochure
              </a>
            )}
            <Link className="bg-race px-5 py-3 font-black uppercase text-black" href={`/contact?interest=${encodeURIComponent(p.name)}`}>
              Request quote
            </Link>
          </div>
        </div>
        <div className="grid gap-px bg-white/10">
          {Object.entries(p.specs).map(([k, v]) => (
            <div className="flex justify-between gap-4 bg-ink p-4" key={k}>
              <span className="text-white/45">{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-[1500px] gap-5 px-5 md:grid-cols-2">
        {p.images.slice(1).map((x) => (
          <div className="relative aspect-[4/3]" key={x}>
            <Image src={x} alt={p.name} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}
