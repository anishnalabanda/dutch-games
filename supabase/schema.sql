-- Run in the Supabase SQL editor for this project.
--
-- There are no accounts. Identity is whatever email address is typed into the
-- app, so rows are keyed by that address and the policies below are open to the
-- publishable key on purpose. Anyone who knows an address can read or overwrite
-- that address's progress. This is a deliberate trade for a one-field sign-in;
-- do not put anything sensitive in this table.

drop table if exists progress;

create table progress (
  email text not null,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (email, key)
);

alter table progress enable row level security;

-- Open by design, see the note above. Delete is deliberately not granted: the
-- app never needs it, and withholding it means a stray request cannot wipe rows.
create policy "read progress" on progress
  for select using (true);

create policy "insert progress" on progress
  for insert with check (true);

create policy "update progress" on progress
  for update using (true) with check (true);
