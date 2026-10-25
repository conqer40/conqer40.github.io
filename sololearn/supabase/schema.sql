-- Run this once in Supabase > SQL Editor.

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  best_accuracy int not null check (best_accuracy between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

-- Each user can only read and write their own rows.
create policy "read own progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "insert own progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "update own progress"
  on public.lesson_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
