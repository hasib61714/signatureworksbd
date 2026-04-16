create extension if not exists pgcrypto;

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text,
  budget text,
  message text,
  submitted_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  date text,
  time text,
  meeting_type text,
  notes text,
  status text not null default 'pending',
  submitted_at timestamptz not null default now()
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  category text,
  location text,
  year text,
  image text,
  gallery jsonb not null default '[]'::jsonb,
  description text,
  full_description text,
  highlights jsonb not null default '[]'::jsonb,
  client text,
  area text,
  duration text,
  budget text,
  team jsonb not null default '[]'::jsonb,
  before_image text,
  after_image text,
  video_url text,
  featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists portfolio_projects add column if not exists budget text;
alter table if exists portfolio_projects add column if not exists team jsonb not null default '[]'::jsonb;
alter table if exists portfolio_projects add column if not exists before_image text;
alter table if exists portfolio_projects add column if not exists after_image text;
alter table if exists portfolio_projects add column if not exists video_url text;

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  category text,
  cover_image text,
  content text,
  author text default 'Signature Works BD',
  published_at date default current_date,
  read_time text,
  tags jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;
alter table bookings enable row level security;
alter table portfolio_projects enable row level security;
alter table blog_posts enable row level security;
alter table site_settings enable row level security;

drop policy if exists "Public insert contacts" on contact_submissions;
create policy "Public insert contacts"
on contact_submissions for insert
to anon, authenticated
with check (true);

drop policy if exists "Public read contacts" on contact_submissions;
create policy "Public read contacts"
on contact_submissions for select
to anon, authenticated
using (true);

drop policy if exists "Public delete contacts" on contact_submissions;
create policy "Public delete contacts"
on contact_submissions for delete
to anon, authenticated
using (true);

drop policy if exists "Public insert bookings" on bookings;
create policy "Public insert bookings"
on bookings for insert
to anon, authenticated
with check (true);

drop policy if exists "Public read bookings" on bookings;
create policy "Public read bookings"
on bookings for select
to anon, authenticated
using (true);

drop policy if exists "Public update bookings" on bookings;
create policy "Public update bookings"
on bookings for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public delete bookings" on bookings;
create policy "Public delete bookings"
on bookings for delete
to anon, authenticated
using (true);

drop policy if exists "Public manage portfolio" on portfolio_projects;
create policy "Public manage portfolio"
on portfolio_projects for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public manage blog" on blog_posts;
create policy "Public manage blog"
on blog_posts for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public manage site settings" on site_settings;
create policy "Public manage site settings"
on site_settings for all
to anon, authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read site media" on storage.objects;
create policy "Public read site media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-media');

drop policy if exists "Public upload site media" on storage.objects;
create policy "Public upload site media"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'site-media');

drop policy if exists "Public update site media" on storage.objects;
create policy "Public update site media"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

drop policy if exists "Public delete site media" on storage.objects;
create policy "Public delete site media"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'site-media');

create index if not exists idx_contact_submissions_submitted_at on contact_submissions (submitted_at desc);
create index if not exists idx_bookings_submitted_at on bookings (submitted_at desc);
create index if not exists idx_portfolio_projects_order_index on portfolio_projects (order_index asc);
create index if not exists idx_blog_posts_published_at on blog_posts (published_at desc);
