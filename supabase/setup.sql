-- ============================================================
-- VORTKART DATABASE SETUP
-- Paste THIS ENTIRE .sql FILE into Supabase SQL Editor and Run.
-- Do not paste README.md into SQL Editor.
-- This script is safe to run again if setup was interrupted.
-- ============================================================
create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text not null unique, description text not null default '',
  category text not null check (category in ('Rental','Racing','Electric')),
  price numeric, images jsonb not null default '[]', brochure_url text, specs jsonb not null default '{}',
  featured boolean not null default false, published boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique, client text not null default '', location text not null default '',
  project_type text not null default '', year integer not null default extract(year from now()),
  story text not null default '', gallery jsonb not null default '[]', testimonial text not null default '',
  featured boolean not null default false, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1), logo_url text, logo_mode text not null default 'text' check (logo_mode in ('text','image')), logo_text text, logo_text_color text, phone text, email text,
  social_links jsonb not null default '{}', seo_title text, seo_description text, hero_video_url text,
  updated_at timestamptz not null default now()
);
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text default '',
  company text default '', country text default '', interest text default '', message text not null,
  status text not null default 'New' check (status in ('New','Contacted','Closed')),
  notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
insert into public.site_settings (
  id, logo_url, logo_mode, logo_text, logo_text_color, phone, email, social_links, seo_title, seo_description, hero_video_url, site_name, tagline, contact_phone, contact_email, address, logo_alt, favicon_url, og_image_url, header_cta_label, header_cta_url, footer_note, theme
) values (
  1, '/media/vortkart-logo.svg', 'text', 'VORTKART', '#ffffff', '+86 000 0000 0000', 'racing@vortkart.com', '{"instagram":"#","youtube":"#","linkedin":"#"}'::jsonb,
  'VORTKART | Born For Racing', 'Racing karts, rental fleets, electric karts and complete track solutions engineered for champions.', '', 'VORTKART', 'Born For Racing',
  '+86 000 0000 0000', 'racing@vortkart.com', 'Karting, manufacturing and track solutions', 'VORTKART logo', '', '', 'Build your track', '/contact', '© VORTKART',
  '{"primary":"#ff5a00","secondary":"#ffffff","background":"#070707"}'::jsonb
) on conflict (id) do nothing;

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

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.inquiries enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()); $$;
grant execute on function public.is_admin() to authenticated;
drop policy if exists "public read products" on public.products; create policy "public read products" on public.products for select using (published=true);
drop policy if exists "public read projects" on public.projects; create policy "public read projects" on public.projects for select using (published=true);
drop policy if exists "public read settings" on public.site_settings; create policy "public read settings" on public.site_settings for select using (true);
drop policy if exists "admin products" on public.products; create policy "admin products" on public.products for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin projects" on public.projects; create policy "admin projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin settings" on public.site_settings; create policy "admin settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin inquiries" on public.inquiries; create policy "admin inquiries" on public.inquiries for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin users self read" on public.admin_users; create policy "admin users self read" on public.admin_users for select using (user_id=auth.uid());

insert into storage.buckets (id,name,public) values ('media','media',true) on conflict (id) do update set public=true;
drop policy if exists "public media read" on storage.objects; create policy "public media read" on storage.objects for select using (bucket_id='media');
drop policy if exists "admin media insert" on storage.objects; create policy "admin media insert" on storage.objects for insert with check (bucket_id='media' and public.is_admin());
drop policy if exists "admin media update" on storage.objects; create policy "admin media update" on storage.objects for update using (bucket_id='media' and public.is_admin());
drop policy if exists "admin media delete" on storage.objects; create policy "admin media delete" on storage.objects for delete using (bucket_id='media' and public.is_admin());

-- Successful setup returns this one-row result.
select
  'VORTKART database setup completed' as status,
  (select count(*) from information_schema.tables where table_schema='public' and table_name in ('admin_users','products','projects','site_settings','inquiries')) as vortkart_tables_created,
  exists(select 1 from storage.buckets where id='media') as media_bucket_created;
