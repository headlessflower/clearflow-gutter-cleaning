-- ClearFlow test customer leads
--
-- Loaded automatically by `supabase db reset` (see supabase/config.toml).
-- All people and contact details below are fictional and reserved for testing.
-- Deterministic UUIDs plus ON CONFLICT make this script safe to run repeatedly.

begin;

insert into public.bookings (
  id,
  name,
  phone,
  email,
  city,
  zip,
  county,
  preferred_date,
  service_type,
  approx_ft,
  add_ons,
  water_access,
  gutter_guard_removal,
  notes,
  total_quote,
  discounted_total_quote,
  maintenance_plan,
  referral_count,
  discount_type,
  status,
  admin_notes,
  contacted_at,
  scheduled_for,
  completed_at,
  created_at,
  updated_at
)
values
  -- New/available leads: different ages, locations, services, prices, and options.
  (
    'cf100000-0000-4000-8000-000000000001',
    'Maya Torres', '(213) 555-0101', 'maya.torres@example.test',
    'Los Angeles', '90026', 'Los Angeles County', current_date + 3,
    'single_story', 140, '["heavy_debris"]'::jsonb, true, false,
    'Large jacaranda over the rear roof. Side gate is unlocked.',
    225, null, null, 0, null, 'lead', null,
    null, null, null, now() - interval '45 minutes', now() - interval '45 minutes'
  ),
  (
    'cf100000-0000-4000-8000-000000000002',
    'Ethan Kim', '(626) 555-0102', 'ethan.kim@example.test',
    'Pasadena', '91104', 'Los Angeles County', current_date + 7,
    'two_story', 210, '["difficult_access", "gutter_guards"]'::jsonb, true, true,
    'Steep driveway; please call before arriving. Guards cover the front run.',
    375, 337.50, 'seasonal', 0, null, 'lead', null,
    null, null, null, now() - interval '3 hours', now() - interval '3 hours'
  ),
  (
    'cf100000-0000-4000-8000-000000000003',
    'Priya Shah', '(909) 555-0103', 'priya.shah@example.test',
    'Claremont', '91711', 'Los Angeles County', current_date + 1,
    'multi_story', 320, '["heavy_debris", "difficult_access", "oversized_gutters"]'::jsonb,
    false, false, 'Three-story section over the garage; no exterior water hookup.',
    510, 408, 'quarterly', 1, null, 'lead', 'High-value / urgent test lead.',
    null, null, null, now() - interval '1 day', now() - interval '1 day'
  ),
  (
    'cf100000-0000-4000-8000-000000000004',
    'Noah Williams', '(562) 555-0104', 'noah.williams@example.test',
    'Long Beach', '90807', 'Los Angeles County', current_date + 14,
    'single_story', null, '[]'::jsonb, true, false, null,
    150, null, null, 0, null, 'lead', null,
    null, null, null, now() - interval '2 days', now() - interval '2 days'
  ),
  (
    'cf100000-0000-4000-8000-000000000005',
    'Sofia Martinez', '(323) 555-0105', 'sofia.martinez@example.test',
    'Glendale', '91205', 'Los Angeles County', current_date + 5,
    'two_story', 180, '["oversized_gutters"]'::jsonb, true, false,
    'Copper gutters. Please avoid parking in the shared driveway.',
    285, 260, null, 1, null, 'lead', null,
    null, null, null, now() - interval '5 days', now() - interval '5 days'
  ),
  (
    'cf100000-0000-4000-8000-000000000006',
    'Liam Chen', '(310) 555-0106', 'liam.chen@example.test',
    'Torrance', '90503', 'Los Angeles County', current_date + 30,
    'single_story', 95, '["gutter_guards"]'::jsonb, false, true,
    'Flexible on date and time. Tenant will provide access.',
    225, null, null, 0, null, 'lead', null,
    null, null, null, now() - interval '12 days', now() - interval '12 days'
  ),
  (
    'cf100000-0000-4000-8000-000000000007',
    'Ava Robinson', '(909) 555-0107', 'ava.robinson@example.test',
    'Rancho Cucamonga', '91730', 'San Bernardino County', current_date - 2,
    'two_story', 240, '["heavy_debris"]'::jsonb, true, false,
    'Requested date has passed; used to test stale-lead handling.',
    325, null, null, 0, null, 'lead', 'Stale lead test case.',
    null, null, null, now() - interval '21 days', now() - interval '21 days'
  ),
  (
    'cf100000-0000-4000-8000-000000000008',
    'Jackson Reed', '(626) 555-0108', 'jackson.reed@example.test',
    'San Marino', '91108', 'Los Angeles County', current_date + 10,
    'multi_story', 400, '["heavy_debris", "gutter_guards", "oversized_gutters"]'::jsonb,
    true, true, 'Detached garage and main house both need service.',
    625, 531.25, 'quarterly', 0, null, 'lead', 'Largest quote test case.',
    null, null, null, now() - interval '35 days', now() - interval '35 days'
  ),

  -- Admin booking workflow fixtures.
  (
    'cf100000-0000-4000-8000-000000000009',
    'Olivia Brooks', '(818) 555-0109', 'olivia.brooks@example.test',
    'Burbank', '91505', 'Los Angeles County', current_date + 4,
    'single_story', 125, '[]'::jsonb, true, false, 'Prefers text messages.',
    150, null, null, 0, null, 'contacted', 'Left voicemail; sent follow-up text.',
    now() - interval '1 day', null, null, now() - interval '4 days', now() - interval '1 day'
  ),
  (
    'cf100000-0000-4000-8000-000000000010',
    'Mateo Garcia', '(323) 555-0110', 'mateo.garcia@example.test',
    'Downey', '90241', 'Los Angeles County', current_date + 6,
    'two_story', 205, '["difficult_access"]'::jsonb, true, false,
    'Dog in backyard; owner will secure before arrival.',
    300, null, null, 0, null, 'scheduled', 'Customer confirmed the morning window.',
    now() - interval '3 days', (current_date + 6) + time '09:00', null,
    now() - interval '8 days', now() - interval '2 days'
  ),
  (
    'cf100000-0000-4000-8000-000000000011',
    'Emma Nguyen', '(714) 555-0111', 'emma.nguyen@example.test',
    'La Habra', '90631', 'Orange County', current_date - 10,
    'single_story', 160, '["heavy_debris"]'::jsonb, true, false,
    'Completed fixture for history and revenue totals.',
    225, 202.50, 'seasonal', 0, null, 'completed', 'Paid in full; seasonal reminder requested.',
    now() - interval '14 days', (current_date - 10) + time '10:30', now() - interval '10 days',
    now() - interval '18 days', now() - interval '10 days'
  ),
  (
    'cf100000-0000-4000-8000-000000000012',
    'Daniel Foster', '(909) 555-0112', 'daniel.foster@example.test',
    'Ontario', '91764', 'San Bernardino County', current_date - 35,
    'multi_story', 275, '["gutter_guards"]'::jsonb, true, true,
    'Older completed job for date-range and sorting tests.',
    425, null, null, 0, null, 'completed', 'Completion photos delivered by email.',
    now() - interval '40 days', (current_date - 35) + time '08:00', now() - interval '35 days',
    now() - interval '50 days', now() - interval '35 days'
  )
on conflict (id) do nothing;

commit;

-- Quick verification:
-- select status, count(*) from public.bookings
-- where id::text like 'cf100000-%' group by status order by status;
