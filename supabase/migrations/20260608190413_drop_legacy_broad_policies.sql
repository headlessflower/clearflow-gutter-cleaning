-- Remove legacy policies that were present before the stricter RLS migration.
-- The broad bookings policies below would otherwise allow public/authenticated
-- reads and authenticated updates despite the newer admin/contractor policies.

drop policy if exists "Allow anon inserts" on public.bookings;
drop policy if exists "bookings_read_authenticated" on public.bookings;
drop policy if exists "bookings_select_public" on public.bookings;
drop policy if exists "bookings_update_authenticated" on public.bookings;

drop policy if exists "Users can insert own profile" on public.contractor_profiles;
drop policy if exists "Users can read own profile" on public.contractor_profiles;
drop policy if exists "Users can update own profile" on public.contractor_profiles;
drop policy if exists "Users can update own terms acceptance" on public.contractor_profiles;

drop policy if exists "Contractors can insert their own claims" on public.lead_claims;
drop policy if exists "Contractors can update their own claims" on public.lead_claims;
drop policy if exists "Contractors can view their own claims" on public.lead_claims;

drop policy if exists "Users can insert own lead views" on public.lead_views;
