-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.

create table if not exists public.movies (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  year        integer check (year between 1888 and 2100),
  genre       text,
  notes       text,
  status      text not null default 'to_watch' check (status in ('to_watch', 'watched')),
  rating      integer check (rating between 1 and 5),
  created_at  timestamptz not null default now()
);

-- Row Level Security: every user can only see and change their own rows.
alter table public.movies enable row level security;

create policy "Users can view their own movies"
  on public.movies for select
  using (auth.uid() = user_id);

create policy "Users can add their own movies"
  on public.movies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own movies"
  on public.movies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own movies"
  on public.movies for delete
  using (auth.uid() = user_id);
