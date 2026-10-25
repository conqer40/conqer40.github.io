-- Profile details, user notifications and filtered admin broadcasts.

alter table public.profiles add column if not exists gender text check (gender in ('male', 'female'));
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists level text check (level in ('A1', 'A2', 'B1'));

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table public.notifications enable row level security;

drop policy if exists "read own notifications" on public.notifications;
create policy "read own notifications" on public.notifications for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "mark own notifications read" on public.notifications;
create policy "mark own notifications read" on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Admins send one message to every user that matches the filters.
-- Any filter left null is ignored.
create or replace function public.send_broadcast(
  p_title text,
  p_body text,
  p_gender text default null,
  p_min_age int default null,
  p_max_age int default null,
  p_level text default null
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  sent int;
begin
  if not public.is_admin() then
    raise exception 'Only admins can send broadcasts';
  end if;

  insert into public.notifications (user_id, title, body)
  select p.id, p_title, p_body
  from public.profiles p
  where (p_gender is null or p.gender = p_gender)
    and (p_level is null or p.level = p_level)
    and (p_min_age is null or extract(year from age(current_date, p.birth_date)) >= p_min_age)
    and (p_max_age is null or extract(year from age(current_date, p.birth_date)) <= p_max_age);

  get diagnostics sent = row_count;
  return sent;
end;
$$;

alter publication supabase_realtime add table public.notifications;
