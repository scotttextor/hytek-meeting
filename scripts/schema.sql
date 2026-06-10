-- Run once in Supabase SQL editor to create the tables
create table if not exists staff (
  id text primary key,
  name text not null,
  rate numeric(10,2) not null,
  created_at timestamptz default now()
);

create table if not exists meeting_log (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  attendees text[] not null,
  duration_ms bigint not null,
  cost numeric(10,2) not null
);
