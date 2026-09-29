-- Run this once in Supabase SQL Editor.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  business text,
  service text not null,
  message text not null,
  language text default 'en',
  source text default 'elyara-website'
);

alter table public.inquiries enable row level security;

-- Public visitors may submit a contact request, but may not read records.
drop policy if exists "public can create inquiries" on public.inquiries;
create policy "public can create inquiries"
on public.inquiries for insert
to anon, authenticated
with check (true);

-- Optional profile table for Google-authenticated clients.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  avatar_url text,
  preferred_language text default 'en'
);

alter table public.profiles enable row level security;

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
