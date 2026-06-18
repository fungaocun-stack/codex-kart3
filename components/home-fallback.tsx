import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Flag, Gauge, Globe2, ShieldCheck, Timer, Wrench } from "lucide-react";
import { Reveal } from "@/components/motion";
import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/json-ld";
import type { HomepageSection, Product, Project, SiteSettings } from "@/lib/types";

type Props = {
  products: Product[];
  projects: Project[];
  settings: SiteSettings;
  sections?: HomepageSection[];
};

type SectionState = {
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  mediaUrl: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

function sectionState(sections: HomepageSection[] | undefined, sectionType: string, fallback: Partial<SectionState>): SectionState {
  const section = sections?.find((entry) => entry.section_type === sectionType);
  const content = section && isRecord(section.content) ? section.content : {};

  return {
    eyebrow: textValue(content.eyebrow) || section?.title || fallback.eyebrow || "",
    headline: textValue(content.headline) || fallback.headline || "",
    description: textValue(content.description) || section?.description || fallback.description || "",
    ctaLabel: textValue(content.cta_label) || fallback.ctaLabel || "",
    ctaHref: textValue(content.cta_url) || fallback.ctaHref || "",
    mediaUrl: textValue(content.media_url) || fallback.mediaUrl || ""
  };
}

function splitHeadline(value: string) {
  const text = value.trim();
  if (!text) return ["Born For", "Racing."];
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length >= 2) return [lines[0], lines.slice(1).join(" ")];
  const words = text.split(/\s+/);
  if (words.length >= 2) return [words.slice(0, -1).join(" "), words.at(-1) ?? "Racing."];
  return [text, "Racing."];
}

export function HomeFallback({ products, projects, settings, sections }: Props) {
  const hero = sectionState(sections, "hero", {
    eyebrow: "Karting culture. Complete solutions.",
    headline: "Born For Racing.",
    description: "Engineered for champions. Built for operators. Supported everywhere the race takes us.",
    ctaLabel: "Explore machines",
    ctaHref: "/products",
    mediaUrl: settings.hero_video_url || "/media/hero.jpg"
  });
  const why = sectionState(sections, "why", {
    eyebrow: "Why VORTKART",
    headline: "Every lap starts with a stronger system."
  });
  const productsSection = sectionState(sections, "products", {
    eyebrow: "Kart ecosystem",
    headline: "One partner. The whole circuit.",
    description: "Featured machines from the current lineup."
  });
  const stories = sectionState(sections, "racing_stories", {
    eyebrow: "Racing stories",
    headline: "The track is our proof."
  });
  const technology = sectionState(sections, "technology", {
    eyebrow: "Technology",
    headline: "Speed, made repeatable."
  });
  const contact = sectionState(sections, "contact", {
    eyebrow: "Start a project",
    headline: "Build Your Track.",
    description: "Tell us what you want to create. We will help shape the fleet, systems and support around it."
  });

  const [heroFirstLine, heroSecondLine] = splitHeadline(hero.headline);
  const heroVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(hero.mediaUrl) ? hero.mediaUrl : settings.hero_video_url || "";
  const heroImage = heroVideo ? "" : hero.mediaUrl || "/media/hero.jpg";

  const features = [
    [Gauge, "Performance", "Race-derived handling and precise driver feedback."],
    [Wrench, "Technology", "Purpose-built chassis, powertrains and timing systems."],
    [ShieldCheck, "Safety", "Engineered protection for drivers and track operators."],
    [Globe2, "Global Support", "A practical partner from concept to race day."]
  ] as const;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "VORTKART Born For Racing",
          description: "VORTKART racing culture and track solutions.",
          thumbnailUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${heroImage || "/media/hero.jpg"}`,
          uploadDate: "2026-01-01",
          contentUrl: heroVideo || undefined
        }}
      />
      <section className="relative min-h-screen overflow-hidden">
        {heroVideo ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src={heroVideo} />
          </video>
        ) : (
          <Image src={heroImage || "/media/hero.jpg"} alt="VORTKART racing start" fill priority className="animate-[pulse_10s_ease-in-out_infinite] object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/30" />
        <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col justify-end px-5 pb-16 pt-28 lg:px-10">
          <p className="eyebrow mb-5">{hero.eyebrow}</p>
          <h1 className="display max-w-6xl">
            {heroFirstLine}
            <br />
            <span className="text-race">{heroSecondLine}</span>
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <p className="max-w-xl text-lg text-white/70">{hero.description}</p>
            <Link className="flex items-center gap-2 bg-race px-6 py-4 text-sm font-black uppercase text-black" href={hero.ctaHref || "/products"}>
              {hero.ctaLabel || "Explore machines"} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section track-grid">
        <div className="section-inner">
          <Reveal>
            <p className="eyebrow">{why.eyebrow}</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase md:text-7xl">{why.headline}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-4">
            {features.map(([Icon, title, text]) => (
              <Reveal key={title} className="bg-ink p-7">
                <Icon className="text-race" />
                <h3 className="mt-12 text-xl font-black uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white text-black">
        <div className="section-inner">
          <p className="eyebrow">{productsSection.eyebrow}</p>
          <div className="mt-4 flex items-end justify-between gap-5">
            <h2 className="max-w-4xl text-4xl font-black uppercase md:text-7xl">{productsSection.headline}</h2>
            <Link href="/products" className="hidden font-bold uppercase md:block">
              View all →
            </Link>
          </div>
          <p className="mt-6 max-w-3xl text-black/60">{productsSection.description}</p>
          <div className="mt-10 grid gap-px bg-black/15 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [Gauge, "Rental Karts"],
              [Flag, "Racing Karts"],
              [BatteryCharging, "Electric Karts"],
              [Wrench, "Track System"],
              [Timer, "Timing System"]
            ].map(([Icon, label]) => (
              <div key={label as string} className="group bg-white p-5 transition hover:bg-black hover:text-white">
                <Icon className="text-race" />
                <h3 className="mt-10 font-black uppercase">{label as string}</h3>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {products.filter((product) => product.featured).slice(0, 4).map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group">
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-end bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400 p-5">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[.18em] text-race">{product.category}</p>
                        <h3 className="mt-2 text-2xl font-black uppercase text-black">{product.name}</h3>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-xs font-black uppercase text-race">{product.category}</p>
                <h3 className="mt-1 text-xl font-black uppercase">{product.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="culture">
        <div className="section-inner">
          <p className="eyebrow">{stories.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black uppercase md:text-7xl">{stories.headline}</h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {projects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id} className="group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {project.gallery[0] ? (
                    <Image src={project.gallery[0]} alt={project.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-end bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-5" />
                  )}
                </div>
                <p className="mt-5 text-xs font-bold uppercase text-race">
                  {project.location} · {project.year}
                </p>
                <h3 className="mt-2 text-3xl font-black uppercase">{project.title}</h3>
                <p className="mt-3 max-w-xl text-white/55">{project.story}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-zinc-950" id="technology">
        <div className="section-inner">
          <p className="eyebrow">{technology.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black uppercase md:text-7xl">{technology.headline}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [Flag, "Chassis Intelligence", "Materials, geometry and tuning windows built around driver confidence."],
              [BatteryCharging, "Powertrain Control", "Responsive performance with practical fleet management."],
              [Timer, "Track & Timing", "A connected race-day experience from start lights to results."]
            ].map(([Icon, title, description]) => (
              <div key={title as string} className="min-h-80 border border-white/10 bg-black p-8">
                <Icon className="text-race" size={36} />
                <h3 className="mt-32 text-2xl font-black uppercase">{title as string}</h3>
                <p className="mt-3 text-white/55">{description as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-race text-black">
        <div className="section-inner grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em]">{contact.eyebrow}</p>
            <h2 className="mt-4 text-5xl font-black uppercase md:text-8xl">{contact.headline}</h2>
            <p className="mt-6 max-w-xl text-black/65">{contact.description}</p>
          </div>
          <div className="[&_input]:border-black/25 [&_input]:bg-black [&_textarea]:border-black/25 [&_textarea]:bg-black">
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
