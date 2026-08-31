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

create table if not exists public.site_articles (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
 summary text not null default '', content text not null default '', cover_url text not null default '',
 category text not null default 'ذكاء اصطناعي', published boolean not null default true,
 published_at timestamptz not null default now(), created_at timestamptz not null default now()
);
alter table public.site_articles enable row level security;
create policy "Public can read published articles" on public.site_articles for select using (published=true or auth.role()='authenticated');
create policy "Admin can manage articles" on public.site_articles for all to authenticated using ((auth.jwt()->>'email')='01022104948@admin.elhawy.local') with check ((auth.jwt()->>'email')='01022104948@admin.elhawy.local');
grant select on public.site_articles to anon, authenticated;
grant insert, update, delete on public.site_articles to authenticated;

alter table public.library_items add column if not exists slug text;
create unique index if not exists library_items_slug_key on public.library_items(slug) where slug is not null;

create table if not exists public.video_categories (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
 description text not null default '', cover_url text not null default '', sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists public.video_lessons (
 id uuid primary key default gen_random_uuid(), category_id uuid not null references public.video_categories(id) on delete cascade,
 title text not null, slug text not null unique, summary text not null default '', description text not null default '',
 youtube_url text not null, cover_url text not null default '', attachment_item_id uuid references public.library_items(id) on delete set null,
 published boolean not null default true, created_at timestamptz not null default now()
);
alter table public.video_categories enable row level security;
alter table public.video_lessons enable row level security;
create policy "Public reads video categories" on public.video_categories for select using(true);
create policy "Public reads videos" on public.video_lessons for select using(published=true or auth.role()='authenticated');
create policy "Admin manages video categories" on public.video_categories for all to authenticated using((auth.jwt()->>'email')='01022104948@admin.elhawy.local') with check((auth.jwt()->>'email')='01022104948@admin.elhawy.local');
create policy "Admin manages videos" on public.video_lessons for all to authenticated using((auth.jwt()->>'email')='01022104948@admin.elhawy.local') with check((auth.jwt()->>'email')='01022104948@admin.elhawy.local');
grant select on public.video_categories,public.video_lessons to anon,authenticated;
grant insert,update,delete on public.video_categories,public.video_lessons to authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null unique,
  role text not null default 'user' check (role in ('user','admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select to authenticated using (id=auth.uid() or (auth.jwt()->>'email')='01022104948@admin.elhawy.local');
create policy "Users update own profile" on public.profiles for update to authenticated using (id=auth.uid() or (auth.jwt()->>'email')='01022104948@admin.elhawy.local') with check (id=auth.uid() or (auth.jwt()->>'email')='01022104948@admin.elhawy.local');
grant select,update on public.profiles to authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name,phone,role)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'phone',split_part(new.email,'@',1)),case when new.email='01022104948@admin.elhawy.local' then 'admin' else 'user' end)
  on conflict(id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.protect_profile_admin_fields() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.jwt()->>'email','') <> '01022104948@admin.elhawy.local' then
    new.role := old.role;
    new.active := old.active;
    new.phone := old.phone;
  end if;
  return new;
end; $$;
drop trigger if exists protect_profile_admin_fields on public.profiles;
create trigger protect_profile_admin_fields before update on public.profiles for each row execute procedure public.protect_profile_admin_fields();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('site-images','site-images',true,6291456,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict(id) do update set public=true,file_size_limit=6291456,allowed_mime_types=excluded.allowed_mime_types;
create policy "Public reads site images" on storage.objects for select using(bucket_id='site-images');
create policy "Admin uploads site images" on storage.objects for insert to authenticated with check(bucket_id='site-images' and (auth.jwt()->>'email')='01022104948@admin.elhawy.local');
create policy "Admin updates site images" on storage.objects for update to authenticated using(bucket_id='site-images' and (auth.jwt()->>'email')='01022104948@admin.elhawy.local');
create policy "Admin deletes site images" on storage.objects for delete to authenticated using(bucket_id='site-images' and (auth.jwt()->>'email')='01022104948@admin.elhawy.local');
