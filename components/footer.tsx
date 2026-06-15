import Link from "next/link";
import type { NavigationLink, SiteSettings } from "@/lib/types";

export function Footer({ navigation, settings }: { navigation: NavigationLink[]; settings: SiteSettings }) {
  const links = navigation.length
    ? navigation
    : [
        { label: "Products", href: "/products" },
        { label: "Racing Stories", href: "/projects" },
        { label: "Culture", href: "/#culture" },
        { label: "Technology", href: "/#technology" },
        { label: "Contact", href: "/contact" }
      ];

  return (
    <footer className="border-t border-white/10 bg-black px-5 py-12 text-white/60">
      <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-3">
        <div>
          <div className="text-xl font-black tracking-[.2em] text-white">
            <span className="text-race">V</span>
            {settings.site_name || "ORTKART"}
          </div>
          <p className="mt-3 max-w-sm text-sm">{settings.footer_note || settings.tagline || "Karting culture, performance machines and complete track solutions."}</p>
        </div>
        <div className="grid gap-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-sm md:text-right">
          {settings.tagline || "BORN FOR RACING"}
          <br />© {new Date().getFullYear()} {settings.site_name || "VORTKART"}
        </div>
      </div>
    </footer>
  );
}
