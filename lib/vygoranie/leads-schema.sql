-- Таблица для анонимных лидов из воронки "Тест на выгорание руководителя".
-- Выполнить один раз в Supabase → SQL Editor (тот же проект, где уже есть
-- test_results для личного кабинета).

create table public.vygoranie_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_method text not null, -- 'phone' | 'email' | 'telegram'
  contact_value text not null,
  consent_given boolean not null default false,
  burnout_score integer not null,
  burnout_label text not null,
  braverman_type text not null,
  wheel_answers jsonb not null,
  archetype_key text not null,
  archetype_label text not null,
  is_mixed_profile boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.vygoranie_leads enable row level security;

-- Форма на сайте анонимная — разрешаем ВСТАВКУ без авторизации, но только
-- если согласие на обработку данных отмечено. Никаких прав на чтение анонимному
-- ключу не даём — сама будешь смотреть лидов в Table Editor под своим логином
-- в Supabase, это не проходит через публичный ключ сайта.
create policy "Anyone can submit a lead with consent"
  on public.vygoranie_leads for insert
  to anon
  with check (consent_given = true);
