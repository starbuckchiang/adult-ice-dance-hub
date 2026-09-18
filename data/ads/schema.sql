-- Future Supabase schema for a NEW project only.
-- Do not reuse another app's project or copy its keys.

create table if not exists advertisers (
  id text primary key,
  name text not null,
  contact_name text not null,
  contact_email text not null,
  status text not null check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ad_campaigns (
  id text primary key,
  advertiser_id text not null references advertisers (id),
  name text not null,
  destination_url text not null,
  desktop_image_url text not null,
  mobile_image_url text not null,
  alt_text text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ad_placements (
  id text primary key,
  code text not null unique,
  name text not null,
  page_type text not null,
  status text not null check (status in ('active', 'inactive'))
);

create table if not exists ad_assignments (
  id text primary key,
  campaign_id text not null references ad_campaigns (id),
  placement_id text not null references ad_placements (id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  priority integer not null default 0,
  status text not null check (status in ('active', 'inactive'))
);

create table if not exists ad_events (
  id text primary key,
  campaign_id text not null,
  placement_id text not null,
  event_type text not null check (event_type in ('impression', 'click')),
  occurred_at timestamptz not null default now(),
  page_path text not null,
  device_type text not null,
  anonymous_session_hash text not null,
  user_agent_category text not null
);
