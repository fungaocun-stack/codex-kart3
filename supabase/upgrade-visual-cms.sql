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
  '{"root":{"type":"page","props":{"slug":"home","title":"Home"}},"content":[]}'::jsonb
)
on conflict (slug) do nothing;

insert into public.navigation (id, header, footer)
values (1, '[]'::jsonb, '[]'::jsonb)
on conflict (id) do nothing;

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
