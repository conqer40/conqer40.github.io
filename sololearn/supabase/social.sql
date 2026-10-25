-- Profiles, friends, chat and admin role for Solo Learn.
-- Safe to run more than once.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  bio text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.friendships (
  id bigint generated always as identity primary key,
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  check (requester_id <> addressee_id),
  unique (requester_id, addressee_id)
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

-- Is the signed-in user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Are two users friends (request accepted)?
create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester_id = a and addressee_id = b) or (requester_id = b and addressee_id = a))
  );
$$;

-- Create a profile for every new account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create profiles for accounts that already exist.
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

-- Users cannot change their own role. Only admins can.
create or replace function public.protect_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_role();

alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.messages enable row level security;

-- Profiles: everyone signed in can read names and bios; users edit only their own.
drop policy if exists "read profiles" on public.profiles;
create policy "read profiles" on public.profiles for select to authenticated using (true);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Friendships: see your own requests; send requests as yourself; the other side accepts or removes.
drop policy if exists "read own friendships" on public.friendships;
create policy "read own friendships" on public.friendships for select to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid() or public.is_admin());

drop policy if exists "send friend request" on public.friendships;
create policy "send friend request" on public.friendships for insert to authenticated
  with check (requester_id = auth.uid() and status = 'pending');

drop policy if exists "accept friend request" on public.friendships;
create policy "accept friend request" on public.friendships for update to authenticated
  using (addressee_id = auth.uid()) with check (addressee_id = auth.uid() and status = 'accepted');

drop policy if exists "remove friendship" on public.friendships;
create policy "remove friendship" on public.friendships for delete to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());

-- Messages: only between accepted friends. Admins can read for moderation.
drop policy if exists "read own messages" on public.messages;
create policy "read own messages" on public.messages for select to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());

drop policy if exists "send message to friend" on public.messages;
create policy "send message to friend" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.are_friends(sender_id, recipient_id));

drop policy if exists "delete own message" on public.messages;
create policy "delete own message" on public.messages for delete to authenticated
  using (sender_id = auth.uid());

-- Admins can read everyone's lesson progress for the admin dashboard.
drop policy if exists "admin read progress" on public.lesson_progress;
create policy "admin read progress" on public.lesson_progress for select to authenticated
  using (public.is_admin());

-- Live updates for chat and friend requests.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.friendships;
