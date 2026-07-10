-- Tighten function execution grants surfaced by Supabase advisors.

alter function public.bookings_set_workflow_timestamps()
  set search_path = public, pg_temp;

revoke all on function public.claim_lead(uuid) from public;
revoke all on function public.claim_lead(uuid) from anon;
grant execute on function public.claim_lead(uuid) to authenticated;

revoke all on function public.mark_lead_contacted(uuid) from public;
revoke all on function public.mark_lead_contacted(uuid) from anon;
grant execute on function public.mark_lead_contacted(uuid) to authenticated;

revoke all on function public.record_lead_view(uuid) from public;
revoke all on function public.record_lead_view(uuid) from anon;
grant execute on function public.record_lead_view(uuid) to authenticated;

-- This is used as a trigger helper, not as a public RPC.
revoke all on function public.handle_new_contractor_profile() from public;
revoke all on function public.handle_new_contractor_profile() from anon;
revoke all on function public.handle_new_contractor_profile() from authenticated;
