import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: { default: settings.seo_title || "VORTKART | Born For Racing", template: "%s | VORTKART" }, description: settings.seo_description || "Karting culture, performance machines and complete track solutions.", metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") };
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><JsonLd data={{ "@context":"https://schema.org","@type":"Organization",name:"VORTKART",url:process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",slogan:"Born For Racing" }}/><Header/><main>{children}</main><Footer/></body></html>;
}
