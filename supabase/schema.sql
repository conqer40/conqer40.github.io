create extension if not exists pgcrypto;

create table if not exists public.library_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  cover_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.library_categories(id) on delete cascade,
  title text not null,
  summary text not null default '',
  description text not null default '',
  download_url text not null,
  cover_url text not null default '',
  file_type text not null default '',
  file_size text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.library_categories enable row level security;
alter table public.library_items enable row level security;

create policy "Public can read library categories" on public.library_categories for select using (true);
create policy "Public can read published library items" on public.library_items for select using (published = true or auth.role() = 'authenticated');
create policy "Admin can manage library categories" on public.library_categories for all to authenticated
using ((auth.jwt() ->> 'email') = '01022104948@admin.elhawy.local')
with check ((auth.jwt() ->> 'email') = '01022104948@admin.elhawy.local');
create policy "Admin can manage library items" on public.library_items for all to authenticated
using ((auth.jwt() ->> 'email') = '01022104948@admin.elhawy.local')
with check ((auth.jwt() ->> 'email') = '01022104948@admin.elhawy.local');
