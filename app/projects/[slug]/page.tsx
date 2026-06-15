import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  return (
    <article className="section pt-32">
      <div className="section-inner">
        <p className="eyebrow">
          {p.location} · {p.project_type} · {p.year}
        </p>
        <h1 className="mt-4 max-w-5xl text-5xl font-black uppercase md:text-8xl">{p.title}</h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-white/60">{p.story}</p>
        <blockquote className="my-20 border-l-4 border-race pl-8 text-3xl font-black uppercase">“{p.testimonial}”</blockquote>
        <div className="grid gap-5 md:grid-cols-2">
          {p.gallery.map((x) => (
            <div className="relative aspect-[16/10]" key={x}>
              <Image src={x} alt={p.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
