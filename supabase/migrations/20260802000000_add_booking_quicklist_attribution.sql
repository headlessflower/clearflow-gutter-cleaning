-- Preserve business-level attribution when a customer submits a quote request.
alter table public.bookings
  add column if not exists contact_quicklist_companies boolean not null default false,
  add column if not exists quicklist_company_ids text[] not null default '{}',
  add column if not exists quicklist_size integer not null default 0;

alter table public.bookings
  drop constraint if exists bookings_quicklist_size_nonnegative,
  add constraint bookings_quicklist_size_nonnegative check (quicklist_size >= 0),
  drop constraint if exists bookings_quicklist_contact_consistent,
  add constraint bookings_quicklist_contact_consistent check (
    not contact_quicklist_companies or cardinality(quicklist_company_ids) > 0
  );

create index if not exists bookings_quicklist_company_ids_idx
  on public.bookings using gin (quicklist_company_ids);

comment on column public.bookings.quicklist_company_ids is
  'Stable partner cleaner IDs selected when the customer consented to company contact.';
comment on column public.bookings.quicklist_size is
  'Number of companies saved at booking submission, including unselected companies.';
