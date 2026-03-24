-- ============================================================
-- Migration: 001_partner_leads
-- Creates the partner_leads table for demo-request lead capture
-- ============================================================

create table if not exists public.partner_leads (
  id            uuid primary key default gen_random_uuid(),
  org_name      text        not null,
  contact_name  text        not null,
  product_type  text        not null,
  phone_email   text        not null,
  created_at    timestamptz not null default now()
);

-- Index for chronological dashboard queries
create index if not exists partner_leads_created_at_idx
  on public.partner_leads (created_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.partner_leads enable row level security;

-- Anyone (incl. anonymous) can INSERT a lead (the form submit)
create policy "anon_insert_leads"
  on public.partner_leads
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated (dashboard/admin) can SELECT leads
create policy "auth_select_leads"
  on public.partner_leads
  for select
  to authenticated
  using (true);

-- No public UPDATE or DELETE
