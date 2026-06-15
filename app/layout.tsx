import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "@measured/puck/puck.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getNavigation, getSettings } from "@/lib/data";
import { themeStyle } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: { default: settings.seo_title || "VORTKART | Born For Racing", template: "%s | VORTKART" },
    description: settings.seo_description || "Karting culture, performance machines and complete track solutions.",
    metadataBase: new URL(baseUrl),
    themeColor: settings.theme?.background || "#070707",
    icons: settings.favicon_url ? { icon: settings.favicon_url, shortcut: settings.favicon_url, apple: settings.favicon_url } : undefined,
    openGraph: {
      title: settings.seo_title || "VORTKART | Born For Racing",
      description: settings.seo_description || "Karting culture, performance machines and complete track solutions.",
      url: baseUrl,
      siteName: settings.site_name || "VORTKART"
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, navigation] = await Promise.all([getSettings(), getNavigation()]);
  const style = themeStyle(settings.theme) as CSSProperties;
  return (
    <html lang="en">
      <body style={style}>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: settings.site_name || "VORTKART", url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", slogan: settings.tagline || "Born For Racing" }} />
        <Header navigation={navigation.header} settings={settings} />
        <main>{children}</main>
        <Footer navigation={navigation.footer} settings={settings} />
      </body>
    </html>
  );
}
