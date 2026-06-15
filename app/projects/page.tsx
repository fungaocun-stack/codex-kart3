import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Projects() {
  const ps = await getProjects();
  return (
    <section className="section pt-32">
      <div className="section-inner">
        <p className="eyebrow">Racing stories</p>
        <h1 className="mt-4 text-5xl font-black uppercase md:text-8xl">Proof from the track.</h1>
        <div className="mt-16 grid gap-12">
          {ps.map((p) => (
            <Link href={`/projects/${p.slug}`} key={p.id} className="grid gap-6 border-t border-white/15 pt-8 lg:grid-cols-2">
              <div className="relative aspect-[16/9]">
                <Image src={p.gallery[0]} alt={p.title} fill className="object-cover" />
              </div>
              <div className="self-center">
                <p className="eyebrow">
                  {p.location} · {p.year}
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase">{p.title}</h2>
                <p className="mt-5 text-white/55">{p.story}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
