-- Enforce row-level security for ClearFlow's public Supabase tables.
--
-- Bootstrap step after applying:
--   insert into public.admin_users (user_id, email)
--   values ('<auth.users.id for admin>', '<admin email>')
--   on conflict (user_id) do update set email = excluded.email;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to authenticated;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create index if not exists admin_users_email_idx on public.admin_users (lower(email));

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

create or replace function private.is_active_contractor()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.contractor_profiles
    where id = (select auth.uid())
      and coalesce(accepted_terms, false) = true
      and subscription_status = 'active'
  );
$$;

create or replace function private.has_viewed_lead(p_booking_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.lead_views
    where booking_id = p_booking_id
      and contractor_id = (select auth.uid())
  );
$$;

create or replace function private.has_claimed_lead(p_booking_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.lead_claims
    where booking_id = p_booking_id
      and contractor_id = (select auth.uid())
      and status in ('claimed', 'contacted', 'scheduled', 'completed')
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.is_active_contractor() from public;
revoke all on function private.has_viewed_lead(uuid) from public;
revoke all on function private.has_claimed_lead(uuid) from public;

grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_active_contractor() to authenticated;
grant execute on function private.has_viewed_lead(uuid) to authenticated;
grant execute on function private.has_claimed_lead(uuid) to authenticated;

alter table public.bookings enable row level security;
alter table public.contractor_profiles enable row level security;
alter table public.lead_views enable row level security;
alter table public.lead_claims enable row level security;

revoke all on table public.bookings from anon, authenticated;
revoke all on table public.contractor_profiles from anon, authenticated;
revoke all on table public.lead_views from anon, authenticated;
revoke all on table public.lead_claims from anon, authenticated;
revoke all on table public.admin_users from anon, authenticated;

grant insert on table public.bookings to anon, authenticated;
grant select, update on table public.bookings to authenticated;

grant select, insert, update on table public.contractor_profiles to authenticated;

grant select, insert on table public.lead_views to authenticated;

grant select on table public.lead_claims to anon;
grant select, insert, update on table public.lead_claims to authenticated;

grant select on table public.admin_users to authenticated;

create index if not exists bookings_status_created_at_idx
  on public.bookings (status, created_at desc);

create index if not exists lead_views_contractor_month_idx
  on public.lead_views (contractor_id, viewed_at desc);

create index if not exists lead_views_booking_contractor_idx
  on public.lead_views (booking_id, contractor_id);

create index if not exists lead_claims_contractor_status_idx
  on public.lead_claims (contractor_id, status);

create index if not exists lead_claims_booking_status_idx
  on public.lead_claims (booking_id, status);

drop policy if exists "Admin users can read admin list" on public.admin_users;
drop policy if exists "Admin users can manage admin list" on public.admin_users;

create policy "Admin users can read admin list"
on public.admin_users
for select
to authenticated
using (private.is_admin() or user_id = (select auth.uid()));

create policy "Admin users can manage admin list"
on public.admin_users
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Public can create booking leads" on public.bookings;
drop policy if exists "Admins can read all bookings" on public.bookings;
drop policy if exists "Admins can update bookings" on public.bookings;
drop policy if exists "Active contractors can read available and unlocked bookings" on public.bookings;

create policy "Public can create booking leads"
on public.bookings
for insert
to anon, authenticated
with check (
  status = 'lead'
  and admin_notes is null
  and contacted_at is null
  and scheduled_for is null
  and completed_at is null
);

create policy "Admins can read all bookings"
on public.bookings
for select
to authenticated
using (private.is_admin());

create policy "Admins can update bookings"
on public.bookings
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

-- Current frontend reads booking rows directly for the contractor lead feed.
-- This keeps that flow working while limiting access to active, terms-accepted
-- contractors. A stricter future version should move teaser reads to a sanitized
-- view/RPC so full customer PII is only returned after record_lead_view().
create policy "Active contractors can read available and unlocked bookings"
on public.bookings
for select
to authenticated
using (
  private.is_active_contractor()
  and (
    status = 'lead'
    or private.has_viewed_lead(id)
    or private.has_claimed_lead(id)
  )
);

drop policy if exists "Users can read own contractor profile" on public.contractor_profiles;
drop policy if exists "Users can create own contractor profile" on public.contractor_profiles;
drop policy if exists "Users can update own contractor profile" on public.contractor_profiles;
drop policy if exists "Admins can manage contractor profiles" on public.contractor_profiles;

create policy "Users can read own contractor profile"
on public.contractor_profiles
for select
to authenticated
using (id = (select auth.uid()) or private.is_admin());

create policy "Users can create own contractor profile"
on public.contractor_profiles
for insert
to authenticated
with check (id = (select auth.uid()));

create policy "Users can update own contractor profile"
on public.contractor_profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Admins can manage contractor profiles"
on public.contractor_profiles
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Users can read own lead views" on public.lead_views;
drop policy if exists "Users can create own lead views" on public.lead_views;
drop policy if exists "Admins can read lead views" on public.lead_views;

create policy "Users can read own lead views"
on public.lead_views
for select
to authenticated
using (contractor_id = (select auth.uid()));

create policy "Users can create own lead views"
on public.lead_views
for insert
to authenticated
with check (
  contractor_id = (select auth.uid())
  and private.is_active_contractor()
);

create policy "Admins can read lead views"
on public.lead_views
for select
to authenticated
using (private.is_admin());

drop policy if exists "Public can read active claim status" on public.lead_claims;
drop policy if exists "Users can read own lead claims" on public.lead_claims;
drop policy if exists "Users can create own lead claims" on public.lead_claims;
drop policy if exists "Users can update own lead claims" on public.lead_claims;
drop policy if exists "Admins can manage lead claims" on public.lead_claims;

-- Keeps existing public lead-landing and contractor feed claimed-state badges
-- working. This reveals claim metadata, but not booking contact details.
create policy "Public can read active claim status"
on public.lead_claims
for select
to anon, authenticated
using (status in ('claimed', 'contacted', 'scheduled', 'completed'));

create policy "Users can read own lead claims"
on public.lead_claims
for select
to authenticated
using (contractor_id = (select auth.uid()));

create policy "Users can create own lead claims"
on public.lead_claims
for insert
to authenticated
with check (
  contractor_id = (select auth.uid())
  and private.is_active_contractor()
);

create policy "Users can update own lead claims"
on public.lead_claims
for update
to authenticated
using (contractor_id = (select auth.uid()))
with check (contractor_id = (select auth.uid()));

create policy "Admins can manage lead claims"
on public.lead_claims
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'claim_lead'
      and pg_get_function_identity_arguments(p.oid) = 'p_booking_id uuid'
  ) then
    revoke all on function public.claim_lead(uuid) from public;
    grant execute on function public.claim_lead(uuid) to authenticated;
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'mark_lead_contacted'
      and pg_get_function_identity_arguments(p.oid) = 'p_booking_id uuid'
  ) then
    revoke all on function public.mark_lead_contacted(uuid) from public;
    grant execute on function public.mark_lead_contacted(uuid) to authenticated;
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'record_lead_view'
      and pg_get_function_identity_arguments(p.oid) = 'p_booking_id uuid'
  ) then
    revoke all on function public.record_lead_view(uuid) from public;
    grant execute on function public.record_lead_view(uuid) to authenticated;
  end if;
end $$;
