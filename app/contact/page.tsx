import { InquiryForm } from "@/components/inquiry-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Contact({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
  return (
    <section className="section min-h-screen pt-32">
      <div className="section-inner grid gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Start a conversation</p>
          <h1 className="mt-4 text-6xl font-black uppercase md:text-8xl">Build your track.</h1>
          <p className="mt-6 max-w-xl text-white/55">
            Planning a fleet, upgrading a circuit, or building a new karting destination? Tell us where the finish line should be.
          </p>
        </div>
        <InquiryForm interest={(await searchParams).interest} />
      </div>
    </section>
  );
}
