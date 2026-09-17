-- Run once in the Supabase SQL editor for this project.
-- Matches the schema in AGENTS.md section 5.

create table if not exists progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table progress enable row level security;

create policy "select own progress" on progress
  for select using (auth.uid() = user_id);

create policy "insert own progress" on progress
  for insert with check (auth.uid() = user_id);

create policy "update own progress" on progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete own progress" on progress
  for delete using (auth.uid() = user_id);
