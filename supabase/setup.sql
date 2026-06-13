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
  id integer primary key default 1 check (id = 1), logo_url text, phone text, email text,
  social_links jsonb not null default '{}', seo_title text, seo_description text, hero_video_url text,
  updated_at timestamptz not null default now()
);
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text default '',
  company text default '', country text default '', interest text default '', message text not null,
  status text not null default 'New' check (status in ('New','Contacted','Closed')),
  notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
insert into public.site_settings (id, seo_title, seo_description) values (1,'VORTKART | Born For Racing','Karting culture, performance machines and complete track solutions.') on conflict (id) do nothing;

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
