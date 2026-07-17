-- Таблица результатов тестов личного кабинета.
-- Выполнить один раз в Supabase → SQL Editor → New query → Run.

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  test_slug text not null,
  answers jsonb not null,
  score integer not null,
  created_at timestamptz not null default now()
);

alter table public.test_results enable row level security;

create policy "Users can view their own test results"
  on public.test_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own test results"
  on public.test_results for insert
  with check (auth.uid() = user_id);
