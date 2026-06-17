-- =====================================================
-- Nexus Arab Store — Supabase Setup SQL (v2)
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. apps table
create table if not exists public.apps (
  id              bigint generated always as identity primary key,
  title           text not null,
  description     text,
  icon_url        text,
  screenshots     text[]    default '{}',
  download_links  text[]    default '{}',
  demo_video_url  text,
  is_free         boolean   default true,
  price           numeric   default 0,
  category        text      not null,
  rating          numeric   default 0,
  downloads       text      default '0',
  app_size        text      default '',
  created_at      timestamptz default now()
);

-- Add new columns if table already exists
alter table public.apps add column if not exists rating    numeric default 0;
alter table public.apps add column if not exists downloads text    default '0';
alter table public.apps add column if not exists app_size  text    default '';

alter table public.apps enable row level security;
drop policy if exists "Public read apps"  on public.apps;
drop policy if exists "Admin write apps"  on public.apps;
create policy "Public read apps"  on public.apps for select using (true);
create policy "Admin write apps"  on public.apps for all    using (true) with check (true);

-- 2. admin_settings table
create table if not exists public.admin_settings (
  id       int primary key default 1 check (id = 1),
  password text not null default 'nexus2026'
);
alter table public.admin_settings enable row level security;
drop policy if exists "Read admin settings"   on public.admin_settings;
drop policy if exists "Update admin settings" on public.admin_settings;
create policy "Read admin settings"   on public.admin_settings for select using (true);
create policy "Update admin settings" on public.admin_settings for all    using (true) with check (true);

insert into public.admin_settings (id, password)
values (1, 'nexus2026')
on conflict (id) do nothing;

-- 3. Storage bucket
insert into storage.buckets (id, name, public)
values ('nexus-assets', 'nexus-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public read nexus-assets"    on storage.objects;
drop policy if exists "Anyone upload nexus-assets"  on storage.objects;
drop policy if exists "Anyone delete nexus-assets"  on storage.objects;
create policy "Public read nexus-assets"    on storage.objects for select using (bucket_id = 'nexus-assets');
create policy "Anyone upload nexus-assets"  on storage.objects for insert with check (bucket_id = 'nexus-assets');
create policy "Anyone delete nexus-assets"  on storage.objects for delete using (bucket_id = 'nexus-assets');
