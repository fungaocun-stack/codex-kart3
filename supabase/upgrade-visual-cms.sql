-- ============================================================
-- VORTKART VISUAL CMS UPGRADE
-- Safe to run multiple times.
-- Adds page, navigation, section, theme, and SEO structure
-- without removing or rewriting existing data.
-- ============================================================

create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.products
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists published boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

alter table public.site_settings
  add column if not exists site_name text,
  add column if not exists tagline text,
  add column if not exists contact_phone text,
  add column if not exists contact_email text,
  add column if not exists address text,
  add column if not exists logo_alt text,
  add column if not exists favicon_url text,
  add column if not exists og_image_url text,
  add column if not exists header_cta_label text,
  add column if not exists header_cta_url text,
  add column if not exists footer_note text,
  add column if not exists theme jsonb not null default '{"primary":"#ff5a00","secondary":"#ffffff","background":"#070707"}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

update public.site_settings
set
  logo_url = case when coalesce(logo_url, '') = '' then '/media/vortkart-logo.svg' else logo_url end,
  phone = case when coalesce(phone, '') = '' then '+86 000 0000 0000' else phone end,
  email = case when coalesce(email, '') = '' then 'racing@vortkart.com' else email end,
  social_links = coalesce(social_links, '{}'::jsonb) || '{"instagram":"#","youtube":"#","linkedin":"#"}'::jsonb,
  seo_title = case when coalesce(seo_title, '') = '' then 'VORTKART | Born For Racing' else seo_title end,
  seo_description = case when coalesce(seo_description, '') = '' then 'Racing karts, rental fleets, electric karts and complete track solutions engineered for champions.' else seo_description end,
  hero_video_url = case when coalesce(hero_video_url, '') = '' then '' else hero_video_url end,
  site_name = case when coalesce(site_name, '') = '' then 'VORTKART' else site_name end,
  tagline = case when coalesce(tagline, '') = '' then 'Born For Racing' else tagline end,
  contact_phone = case when coalesce(contact_phone, '') = '' then '+86 000 0000 0000' else contact_phone end,
  contact_email = case when coalesce(contact_email, '') = '' then 'racing@vortkart.com' else contact_email end,
  address = case when coalesce(address, '') = '' then 'Karting, manufacturing and track solutions' else address end,
  logo_alt = case when coalesce(logo_alt, '') = '' then 'VORTKART logo' else logo_alt end,
  favicon_url = case when coalesce(favicon_url, '') = '' then '' else favicon_url end,
  og_image_url = case when coalesce(og_image_url, '') = '' then '' else og_image_url end,
  header_cta_label = case when coalesce(header_cta_label, '') = '' then 'Build your track' else header_cta_label end,
  header_cta_url = case when coalesce(header_cta_url, '') = '' then '/contact' else header_cta_url end,
  footer_note = case when coalesce(footer_note, '') = '' then '© VORTKART' else footer_note end,
  theme = coalesce(theme, '{}'::jsonb) || '{"primary":"#ff5a00","secondary":"#ffffff","background":"#070707"}'::jsonb,
  updated_at = now()
where id = 1;

insert into public.site_settings (
  id,
  logo_url,
  phone,
  email,
  social_links,
  seo_title,
  seo_description,
  hero_video_url,
  site_name,
  tagline,
  contact_phone,
  contact_email,
  address,
  logo_alt,
  favicon_url,
  og_image_url,
  header_cta_label,
  header_cta_url,
  footer_note,
  theme
)
values (
  1,
  '/media/vortkart-logo.svg',
  '+86 000 0000 0000',
  'racing@vortkart.com',
  '{"instagram":"#","youtube":"#","linkedin":"#"}'::jsonb,
  'VORTKART | Born For Racing',
  'Racing karts, rental fleets, electric karts and complete track solutions engineered for champions.',
  '',
  'VORTKART',
  'Born For Racing',
  '+86 000 0000 0000',
  'racing@vortkart.com',
  'Karting, manufacturing and track solutions',
  'VORTKART logo',
  '',
  '',
  'Build your track',
  '/contact',
  '© VORTKART',
  '{"primary":"#ff5a00","secondary":"#ffffff","background":"#070707"}'::jsonb
)
on conflict (id) do nothing;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  published boolean not null default true,
  content jsonb not null default '{"root":{"type":"page","props":{"slug":"home","title":"Home"}},"content":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation (
  id integer primary key default 1 check (id = 1),
  header jsonb not null default '[]'::jsonb,
  footer jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_type text not null,
  title text not null default '',
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.pages (slug, title, seo_title, seo_description, published, content)
values (
  'home',
  'Home',
  'VORTKART | Born For Racing',
  'Karting culture, performance machines and complete track solutions.',
  true,
  '{
    "root":{"type":"page","props":{"slug":"home","title":"Home","sectionCount":7}},
    "content":[
      {"type":"homepageSection","props":{"section_type":"hero","title":"Hero","description":"Primary landing section with the main value proposition."}},
      {"type":"homepageSection","props":{"section_type":"why","title":"Why VORTKART","description":"Reasons to trust the brand and the products."}},
      {"type":"homepageSection","props":{"section_type":"products","title":"Products","description":"Featured product grid for the homepage."}},
      {"type":"homepageSection","props":{"section_type":"racing_stories","title":"Racing Stories","description":"Proof from the track and customer stories."}},
      {"type":"homepageSection","props":{"section_type":"culture","title":"Culture","description":"Brand and community section."}},
      {"type":"homepageSection","props":{"section_type":"technology","title":"Technology","description":"Technical differentiators and systems."}},
      {"type":"homepageSection","props":{"section_type":"contact","title":"Contact","description":"Inquiry and next-step call to action."}}
    ]
  }'::jsonb
)
on conflict (slug) do nothing;

update public.navigation
set
  header = case
    when header = '[]'::jsonb
      then '[{"label":"Products","href":"/products"},{"label":"Racing Stories","href":"/projects"},{"label":"Culture","href":"/#culture"},{"label":"Technology","href":"/#technology"},{"label":"Contact","href":"/contact"}]'::jsonb
    else header
  end,
  footer = case
    when footer = '[]'::jsonb
      then '[{"label":"Products","href":"/products"},{"label":"Racing Stories","href":"/projects"},{"label":"Culture","href":"/#culture"},{"label":"Technology","href":"/#technology"},{"label":"Build Your Track","href":"/contact"}]'::jsonb
    else footer
  end,
  updated_at = now()
where id = 1;

insert into public.navigation (id, header, footer)
values (
  1,
  '[{"label":"Products","href":"/products"},{"label":"Racing Stories","href":"/projects"},{"label":"Culture","href":"/#culture"},{"label":"Technology","href":"/#technology"},{"label":"Contact","href":"/contact"}]'::jsonb,
  '[{"label":"Products","href":"/products"},{"label":"Racing Stories","href":"/projects"},{"label":"Culture","href":"/#culture"},{"label":"Technology","href":"/#technology"},{"label":"Build Your Track","href":"/contact"}]'::jsonb
)
on conflict (id) do nothing;

update public.pages
set content = '{
  "root":{"type":"page","props":{"slug":"home","title":"Home"}},
  "content":[
    {"type":"Hero","props":{"eyebrow":"Machines","title":"Choose your line.","description":"Competition chassis and commercial fleets engineered around the way you race and operate.","ctaLabel":"Build your track","ctaHref":"/contact","imageUrl":"/media/hero.jpg","imageAlt":"VORTKART racing start"}},
    {"type":"RichText","props":{"title":"Why VORTKART","body":"Every lap starts with a stronger system.\n\nA practical partner for drivers, operators and track builders."}},
    {"type":"ProductShowcase","props":{"title":"Products","intro":"Featured machines from the current lineup.","productSlugs":"kz-racing-chassis, ok-racing-chassis, phantom-electric-kart, fs200-rental-kart"}},
    {"type":"CaseStudyShowcase","props":{"title":"Racing Stories","intro":"Proof from the track and support from the circuit.","projectSlugs":"built-around-race-day, partners-at-the-track"}},
    {"type":"RichText","props":{"title":"Culture","body":"Karting culture, community and the shared language of speed."}},
    {"type":"RichText","props":{"title":"Technology","body":"Speed, made repeatable.\n\nTrack systems, fleet reliability and performance tooling."}},
    {"type":"CTA","props":{"title":"Build Your Track.","description":"Tell us what you want to create. We will help shape the fleet, systems and support around it.","ctaLabel":"Contact us","ctaHref":"/contact"}}
  ]
}'::jsonb,
updated_at = now()
where slug = 'home'
  and (
    content = '{"root":{"type":"page","props":{"slug":"home","title":"Home"}},"content":[]}'::jsonb
    or content = '{"root":{"type":"page","props":{"slug":"home","title":"Home","sectionCount":7}},"content":[{"type":"homepageSection","props":{"section_type":"hero","title":"Hero","description":"Primary landing section with the main value proposition."}},{"type":"homepageSection","props":{"section_type":"why","title":"Why VORTKART","description":"Reasons to trust the brand and the products."}},{"type":"homepageSection","props":{"section_type":"products","title":"Products","description":"Featured product grid for the homepage."}},{"type":"homepageSection","props":{"section_type":"racing_stories","title":"Racing Stories","description":"Proof from the track and customer stories."}},{"type":"homepageSection","props":{"section_type":"culture","title":"Culture","description":"Brand and community section."}},{"type":"homepageSection","props":{"section_type":"technology","title":"Technology","description":"Technical differentiators and systems."}},{"type":"homepageSection","props":{"section_type":"contact","title":"Contact","description":"Inquiry and next-step call to action."}}]}'::jsonb
  );

with home_page as (
  select id from public.pages where slug = 'home' limit 1
)
insert into public.page_sections (page_id, section_type, title, content, sort_order, published)
select home_page.id, section_type, title, content, sort_order, true
from home_page
cross join (
  values
    ('hero', 'Hero', '{"eyebrow":"Machines","headline":"Choose your line.","description":"Competition chassis and commercial fleets engineered around the way you race and operate.","cta_label":"Build your track","cta_url":"/contact","media_url":"/media/story-track.jpg"}'::jsonb, 0),
    ('why', 'Why VORTKART', '{"eyebrow":"Why VORTKART","headline":"Built for drivers and operators.","description":"A unified content system for race-focused products, stories and track operations.","cta_label":"See products","cta_url":"/products","media_url":"/media/story-grid.jpg"}'::jsonb, 1),
    ('products', 'Products', '{"eyebrow":"Products","headline":"Featured machines","description":"A selection of racing, rental and electric karts.","cta_label":"Browse all products","cta_url":"/products","media_url":"/media/kz-racing.png"}'::jsonb, 2),
    ('racing_stories', 'Racing Stories', '{"eyebrow":"Racing Stories","headline":"Proof from the track","description":"Projects and race-day support that show the system in motion.","cta_label":"Read stories","cta_url":"/projects","media_url":"/media/story-race.jpg"}'::jsonb, 3),
    ('culture', 'Culture', '{"eyebrow":"Culture","headline":"A brand with a pulse","description":"Community, competition and the shared language of karting.","cta_label":"Explore culture","cta_url":"/projects","media_url":"/media/story-partners.jpg"}'::jsonb, 4),
    ('technology', 'Technology', '{"eyebrow":"Technology","headline":"Systems that scale","description":"Track operations, fleet reliability and performance tooling.","cta_label":"Learn more","cta_url":"/products","media_url":"/media/phantom.png"}'::jsonb, 5),
    ('contact', 'Contact', '{"eyebrow":"Contact","headline":"Start your build","description":"Tell us about the track, fleet or product you want to launch.","cta_label":"Contact us","cta_url":"/contact","media_url":"/media/story-track.jpg"}'::jsonb, 6)
) as seed(section_type, title, content, sort_order)
where not exists (
  select 1
  from public.page_sections existing
  where existing.page_id = home_page.id
    and existing.section_type = seed.section_type
);

insert into public.products (name, slug, description, category, price, images, brochure_url, specs, featured, published, sort_order)
values
  ('KZ Racing Chassis', 'kz-racing-chassis', 'Competition-bred chassis engineered for precision, response and podium pace.', 'Racing', null, '["/media/kz-racing.png","/media/kz-angle.png"]'::jsonb, null, '{"Class":"KZ","Frame":"30/32 mm CrMo","Braking":"Hydraulic","Application":"Professional racing"}'::jsonb, true, true, 0),
  ('OK Racing Chassis', 'ok-racing-chassis', 'A balanced, adaptable platform for serious sprint competition.', 'Racing', null, '["/media/ok-racing.png"]'::jsonb, null, '{"Class":"OK","Frame":"30 mm CrMo","Braking":"Rear hydraulic","Application":"Sprint racing"}'::jsonb, true, true, 1),
  ('Phantom Electric Kart', 'phantom-electric-kart', 'Instant torque, low operating noise and a commanding rental-track presence.', 'Electric', null, '["/media/phantom.png","/media/phantom-angle.png"]'::jsonb, null, '{"Powertrain":"Electric","Drive":"Rear wheel","Application":"Commercial tracks","Control":"Remote speed control ready"}'::jsonb, true, true, 2),
  ('Thunder Electric Kart', 'thunder-electric-kart', 'High-throughput electric karting built around durability and driver excitement.', 'Electric', null, '["/media/thunder.jpg"]'::jsonb, null, '{"Powertrain":"Electric","Seat":"Single","Application":"Rental operations","Bodywork":"Impact-resistant"}'::jsonb, false, true, 3),
  ('Lightning Electric Kart', 'lightning-electric-kart', 'A lightweight, agile electric platform for youth and family venues.', 'Electric', null, '["/media/lightning.jpg"]'::jsonb, null, '{"Powertrain":"Electric","Seat":"Single","Application":"Youth & family","Safety":"Adjustable speed"}'::jsonb, false, true, 4),
  ('FS200 Rental Kart', 'fs200-rental-kart', 'A robust petrol rental kart made for busy circuits and repeatable fun.', 'Rental', null, '["/media/fs200.png","/media/fs200-angle.png"]'::jsonb, null, '{"Engine":"200 cc petrol","Seat":"Single","Application":"Rental tracks","Protection":"Full perimeter bumper"}'::jsonb, true, true, 5),
  ('Cyclone Electric Kart', 'cyclone-electric-kart', 'A contemporary electric rental kart for immersive entertainment venues.', 'Electric', null, '["/media/cyclone.png"]'::jsonb, null, '{"Powertrain":"Electric","Seat":"Single","Application":"Indoor & outdoor","Control":"Fleet management ready"}'::jsonb, false, true, 6)
on conflict (slug) do nothing;

insert into public.projects (title, slug, client, location, project_type, year, story, gallery, testimonial, featured, published)
values
  ('Built Around Race Day', 'built-around-race-day', 'VORTKART Racing Community', 'Asia', 'Championship Support', 2025, 'From the briefing room to the final corner, VORTKART supports the people and systems that turn track time into racing culture.', '["/media/story-race.jpg","/media/story-grid.jpg"]'::jsonb, 'The best racing solutions feel invisible on race day: everything simply works.', true, true),
  ('Partners at the Track', 'partners-at-the-track', 'International Track Partners', 'Global', 'Track Solutions', 2026, 'Our teams work alongside operators, clubs and drivers to shape practical karting experiences with long-term support.', '["/media/story-partners.jpg","/media/story-track.jpg"]'::jsonb, 'A dependable partner from first discussion through opening day.', true, true)
on conflict (slug) do nothing;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.navigation enable row level security;
alter table public.page_sections enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select
  using (published = true);

drop policy if exists "admin products" on public.products;
create policy "admin products" on public.products
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select
  using (true);

drop policy if exists "admin settings" on public.site_settings;
create policy "admin settings" on public.site_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages
  for select
  using (published = true);

drop policy if exists "admin pages" on public.pages;
create policy "admin pages" on public.pages
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read navigation" on public.navigation;
create policy "public read navigation" on public.navigation
  for select
  using (true);

drop policy if exists "admin navigation" on public.navigation;
create policy "admin navigation" on public.navigation
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read page sections" on public.page_sections;
create policy "public read page sections" on public.page_sections
  for select
  using (
    published = true
    and exists (
      select 1
      from public.pages
      where pages.id = page_sections.page_id
        and pages.published = true
    )
  );

drop policy if exists "admin page sections" on public.page_sections;
create policy "admin page sections" on public.page_sections
  for all
  using (public.is_admin())
  with check (public.is_admin());
