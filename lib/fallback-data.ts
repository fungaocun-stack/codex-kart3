import { defaultPageData } from "./cms";
import type { NavigationLink, Product, Project, SiteNavigation, SiteSettings, VisualPageRecord } from "./types";

const img = (name: string) => `/media/${name}`;

const products: Product[] = [
  { id: "kz", name: "KZ Racing Chassis", slug: "kz-racing-chassis", category: "Racing", description: "Competition-bred chassis engineered for precision, response and podium pace.", images: [img("kz-racing.png"), img("kz-angle.png")], specs: { Class: "KZ", Frame: "30/32 mm CrMo", Braking: "Hydraulic", Application: "Professional racing" }, featured: true },
  { id: "ok", name: "OK Racing Chassis", slug: "ok-racing-chassis", category: "Racing", description: "A balanced, adaptable platform for serious sprint competition.", images: [img("ok-racing.png")], specs: { Class: "OK", Frame: "30 mm CrMo", Braking: "Rear hydraulic", Application: "Sprint racing" }, featured: true },
  { id: "phantom", name: "Phantom Electric Kart", slug: "phantom-electric-kart", category: "Electric", description: "Instant torque, low operating noise and a commanding rental-track presence.", images: [img("phantom.png"), img("phantom-angle.png")], specs: { Powertrain: "Electric", Drive: "Rear wheel", Application: "Commercial tracks", Control: "Remote speed control ready" }, featured: true },
  { id: "thunder", name: "Thunder Electric Kart", slug: "thunder-electric-kart", category: "Electric", description: "High-throughput electric karting built around durability and driver excitement.", images: [img("thunder.jpg")], specs: { Powertrain: "Electric", Seat: "Single", Application: "Rental operations", Bodywork: "Impact-resistant" } },
  { id: "lightning", name: "Lightning Electric Kart", slug: "lightning-electric-kart", category: "Electric", description: "A lightweight, agile electric platform for youth and family venues.", images: [img("lightning.jpg")], specs: { Powertrain: "Electric", Seat: "Single", Application: "Youth & family", Safety: "Adjustable speed" } },
  { id: "fs200", name: "FS200 Rental Kart", slug: "fs200-rental-kart", category: "Rental", description: "A robust petrol rental kart made for busy circuits and repeatable fun.", images: [img("fs200.png"), img("fs200-angle.png")], specs: { Engine: "200 cc petrol", Seat: "Single", Application: "Rental tracks", Protection: "Full perimeter bumper" }, featured: true },
  { id: "cyclone", name: "Cyclone Electric Kart", slug: "cyclone-electric-kart", category: "Electric", description: "A contemporary electric rental kart for immersive entertainment venues.", images: [img("cyclone.png")], specs: { Powertrain: "Electric", Seat: "Single", Application: "Indoor & outdoor", Control: "Fleet management ready" } }
];

const projects: Project[] = [
  { id: "race-culture", title: "Built Around Race Day", slug: "built-around-race-day", client: "VORTKART Racing Community", location: "Asia", project_type: "Championship Support", year: 2025, story: "From the briefing room to the final corner, VORTKART supports the people and systems that turn track time into racing culture.", gallery: [img("story-race.jpg"), img("story-grid.jpg")], testimonial: "The best racing solutions feel invisible on race day: everything simply works.", featured: true },
  { id: "global-partners", title: "Partners at the Track", slug: "partners-at-the-track", client: "International Track Partners", location: "Global", project_type: "Track Solutions", year: 2026, story: "Our teams work alongside operators, clubs and drivers to shape practical karting experiences with long-term support.", gallery: [img("story-partners.jpg"), img("story-track.jpg")], testimonial: "A dependable partner from first discussion through opening day.", featured: true }
];

export const defaultSettings: SiteSettings = {
  phone: "+86 000 0000 0000", email: "racing@vortkart.com",
  social_links: { instagram: "#", youtube: "#", linkedin: "#" },
  seo_title: "VORTKART | Born For Racing",
  seo_description: "Racing karts, rental fleets, electric karts and complete track solutions engineered for champions.",
  site_name: "VORTKART",
  logo_mode: "text",
  logo_text: "VORTKART",
  logo_text_color: "#ffffff",
  tagline: "Born For Racing",
  header_cta_label: "Build your track",
  header_cta_url: "/contact",
  footer_note: `© ${new Date().getFullYear()} VORTKART`,
  theme: { primary: "#ff5a00", secondary: "#ffffff", background: "#070707" }
};

const navigation: SiteNavigation = {
  header: [
    { label: "Products", href: "/products" },
    { label: "Racing Stories", href: "/projects" },
    { label: "Culture", href: "/#culture" },
    { label: "Technology", href: "/#technology" },
    { label: "Contact", href: "/contact" }
  ],
  footer: [
    { label: "Products", href: "/products" },
    { label: "Racing Stories", href: "/projects" },
    { label: "Culture", href: "/#culture" },
    { label: "Technology", href: "/#technology" },
    { label: "Build Your Track", href: "/contact" }
  ]
};

const pages: VisualPageRecord[] = [
  {
    id: "home",
    slug: "home",
    title: "Home",
    seo_title: "VORTKART | Born For Racing",
    seo_description: "Racing karts, rental fleets, electric karts and complete track solutions engineered for champions.",
    published: true,
    content: defaultPageData
  }
];

export const getFallbackProducts = () => products;
export const getFallbackProjects = () => projects;
export const getFallbackNavigation = () => navigation;
export const getFallbackPages = () => pages;

