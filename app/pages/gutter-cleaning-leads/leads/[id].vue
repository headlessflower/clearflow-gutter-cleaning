<template>
  <section class="lead-detail-page">
    <NuxtLink to="/gutter-cleaning-leads/my-leads" class="back-link">
      ← Back to My Leads
    </NuxtLink>

    <p v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </p>

    <div v-if="loading" class="empty-state">
      Loading lead details...
    </div>

    <article v-else-if="lead" class="detail-card">
      <header class="detail-header">
        <div>
          <p class="eyebrow">Customer lead details</p>
          <h1>{{ lead.name || 'New Customer' }}</h1>
          <p class="location">
            {{ lead.city || 'Los Angeles area' }}<span v-if="lead.zip">, {{ lead.zip }}</span>
          </p>
        </div>

        <div class="header-actions">
          <span v-if="claim" class="status-pill" :class="`status-pill--${claim.status}`">
            {{ formatStatus(claim.status) }}
          </span>

          <NuxtLink to="/gutter-cleaning-leads/leads" class="secondary-button">
            Browse Leads
          </NuxtLink>
        </div>
      </header>

      <section class="detail-grid">
        <div class="info-box">
          <span>Phone</span>
          <strong>{{ lead.phone || 'Not provided' }}</strong>
        </div>

        <div class="info-box">
          <span>Email</span>
          <strong>{{ lead.email || 'Not provided' }}</strong>
        </div>

        <div class="info-box">
          <span>Address</span>
          <strong>{{ lead.address || 'Not provided' }}</strong>
        </div>

        <div class="info-box">
          <span>Requested date</span>
          <strong>{{ formatDate(lead.preferred_date) }}</strong>
        </div>

        <div class="info-box">
          <span>Service</span>
          <strong>{{ formatServiceType(lead.service_type) }}</strong>
        </div>

        <div class="info-box">
          <span>Approx. feet</span>
          <strong>{{ lead.approx_ft || 'Not provided' }}</strong>
        </div>

        <div class="info-box">
          <span>Quote total</span>
          <strong>{{ formatCurrency(getQuoteTotal(lead)) }}</strong>
        </div>

        <div class="info-box">
          <span>Maintenance plan</span>
          <strong>{{ lead.maintenance_plan || 'None selected' }}</strong>
        </div>

        <div class="info-box">
          <span>Water access</span>
          <strong>{{ lead.water_access ? 'Yes' : 'No' }}</strong>
        </div>

        <div class="info-box">
          <span>Gutter guard removal</span>
          <strong>{{ lead.gutter_guard_removal ? 'Yes' : 'No' }}</strong>
        </div>
      </section>

      <section v-if="lead.add_ons?.length" class="wide-box">
        <h2>Add-ons</h2>

        <div class="add-ons">
          <span v-for="addon in lead.add_ons" :key="addon">
            {{ formatAddon(addon) }}
          </span>
        </div>
      </section>

      <section class="wide-box">
        <h2>Customer notes</h2>
        <p>{{ lead.notes || 'No notes provided.' }}</p>
      </section>

      <section v-if="claim" class="wide-box claim-panel">
        <div>
          <h2>Lead workflow</h2>
          <div class="claim-timeline">
            <p>
              <strong>Claimed:</strong>
              {{ formatDateTime(claim.claimed_at) }}
            </p>

            <p v-if="claim.contacted_at">
              <strong>Last contacted:</strong>
              {{ formatDateTime(claim.contacted_at) }}
            </p>

            <p v-if="claim.expires_at && claim.status === 'claimed'">
              <strong>Claim expires:</strong>
              {{ formatDateTime(claim.expires_at) }}
            </p>

            <p v-if="claim.updated_at">
              <strong>Last updated:</strong>
              {{ formatDateTime(claim.updated_at) }}
            </p>
          </div>
        </div>

        <div class="workflow-actions">
          <button v-if="claim.status === 'claimed'" type="button" class="primary-button" :disabled="updating"
            @click="markContacted">
            {{ updating ? 'Saving...' : 'Mark Contacted' }}
          </button>

          <button v-if="claim.status === 'contacted'" type="button" class="primary-button" :disabled="updating"
            @click="updateClaimStatus('scheduled')">
            {{ updating ? 'Saving...' : 'Mark Scheduled' }}
          </button>

          <button v-if="claim.status === 'scheduled'" type="button" class="primary-button" :disabled="updating"
            @click="updateClaimStatus('completed')">
            {{ updating ? 'Saving...' : 'Mark Completed' }}
          </button>

          <button v-if="['claimed', 'contacted', 'scheduled'].includes(claim.status)" type="button"
            class="secondary-button" :disabled="updating" @click="updateClaimStatus('lost')">
            Mark Lost
          </button>
        </div>
      </section>
    </article>

    <div v-else class="empty-state">
      Lead not found.
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'leads'
})

type ClaimStatus =
  | 'claimed'
  | 'contacted'
  | 'scheduled'
  | 'completed'
  | 'lost'
  | 'expired'

type BookingLead = {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  zip: string | null
  county: string | null
  preferred_date: string | null
  service_type: string | null
  approx_ft: number | null
  add_ons: string[] | null
  water_access: boolean | null
  gutter_guard_removal: boolean | null
  notes: string | null
  total_quote: number | null
  discounted_total_quote: number | null
  maintenance_plan: string | null
  status: string | null
  created_at: string | null
}

type LeadClaim = {
  id: string
  booking_id: string
  contractor_id: string
  status: ClaimStatus
  claimed_at: string | null
  contacted_at: string | null
  expires_at: string | null
  notes: string | null
  updated_at: string | null
}

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const lead = ref<BookingLead | null>(null)
const claim = ref<LeadClaim | null>(null)
const loading = ref(true)
const updating = ref(false)
const errorMessage = ref('')

const leadId = computed(() => String(route.params.id || ''))

onMounted(loadPage)

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error

  const userId = data.user?.id

  if (!userId) {
    await router.push('/gutter-cleaning-leads/login')
    return null
  }

  return userId
}

async function loadPage() {
  loading.value = true
  errorMessage.value = ''

  try {
    const userId = await getCurrentUserId()
    if (!userId) return

    await Promise.all([
      loadLead(),
      loadClaim(userId),
    ])
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load lead details.'
  } finally {
    loading.value = false
  }
}

async function loadLead() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      name,
      phone,
      email,
      address,
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
      status,
      created_at
    `)
    .eq('id', leadId.value)
    .single()

  if (error) throw error

  lead.value = data as BookingLead
}

async function loadClaim(userId: string) {
  const { data, error } = await supabase
    .from('lead_claims')
    .select(`
      id,
      booking_id,
      contractor_id,
      status,
      claimed_at,
      contacted_at,
      expires_at,
      notes,
      updated_at
    `)
    .eq('booking_id', leadId.value)
    .eq('contractor_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  claim.value = data as LeadClaim | null
}

async function markContacted() {
  if (!lead.value) return

  updating.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.rpc('mark_lead_contacted', {
      p_booking_id: lead.value.id,
    })

    if (error) throw error

    await loadPage()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not mark this lead as contacted.'
  } finally {
    updating.value = false
  }
}

async function updateClaimStatus(status: ClaimStatus) {
  if (!claim.value) return

  updating.value = true
  errorMessage.value = ''

  try {
    const patch: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'contacted') {
      patch.contacted_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('lead_claims')
      .update(patch)
      .eq('id', claim.value.id)

    if (error) throw error

    await loadPage()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not update this lead.'
  } finally {
    updating.value = false
  }
}

function getQuoteTotal(item: BookingLead | null | undefined) {
  return Number(item?.discounted_total_quote || item?.total_quote || 0)
}

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== 'number' || value <= 0) return 'Quote pending'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Flexible'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return 'soon'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatServiceType(value: string | null | undefined) {
  const labels: Record<string, string> = {
    single_story: 'Single-story home',
    two_story: 'Two-story home',
    multi_story: 'Multi-story home',
  }

  if (!value) return 'Gutter cleaning'
  return labels[value] || value.replaceAll('_', ' ')
}

function formatAddon(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatStatus(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}
</script>

<style scoped>
.lead-detail-page {
  max-width: 1180px;
  margin: 0 auto;
  color: #102018;
}

.back-link {
  display: inline-flex;
  margin-bottom: 1.5rem;
  color: #1f6f3d;
  font-weight: 900;
  text-decoration: none;
}

.detail-card,
.info-box,
.wide-box,
.error-banner,
.empty-state {
  border: 1px solid rgba(16, 32, 24, 0.08);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 24px 60px rgba(16, 32, 24, 0.08);
}

.detail-card {
  border-radius: 1.8rem;
  padding: 1.5rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: #1f6f3d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.detail-header h1 {
  margin: 0;
  color: #102018;
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.location {
  margin: 0.8rem 0 0;
  color: #536357;
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  align-items: flex-start;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.info-box,
.wide-box {
  border-radius: 1.2rem;
  padding: 1rem;
  background: #f8faf7;
  box-shadow: none;
}

.info-box span {
  display: block;
  margin-bottom: 0.35rem;
  color: #7a877e;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.info-box strong {
  color: #102018;
  font-size: 1.1rem;
}

.wide-box {
  margin-top: 1rem;
}

.wide-box h2 {
  margin: 0 0 0.7rem;
}

.wide-box p {
  margin: 0;
  color: #536357;
  line-height: 1.65;
}

.add-ons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.add-ons span {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  border-radius: 999px;
  padding: 0 0.8rem;
  color: #1f6f3d;
  background: rgba(31, 111, 61, 0.1);
  font-weight: 900;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.4rem;
  border-radius: 999px;
  padding: 0 0.9rem;
  color: #334155;
  background: #f1f5f9;
  font-weight: 900;
}

.status-pill--claimed {
  color: #1f6f3d;
  background: rgba(31, 111, 61, 0.1);
}

.status-pill--contacted {
  color: #1d4ed8;
  background: #dbeafe;
}

.status-pill--scheduled {
  color: #7c3aed;
  background: #ede9fe;
}

.status-pill--completed {
  color: #166534;
  background: #dcfce7;
}

.status-pill--lost,
.status-pill--expired {
  color: #9f1239;
  background: rgba(159, 18, 57, 0.08);
}

.claim-panel {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.workflow-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  justify-content: flex-end;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  border: 0;
  border-radius: 999px;
  padding: 0 1rem;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  text-decoration: none;
}

.primary-button {
  color: #fff;
  background: #1f6f3d;
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
}

.secondary-button {
  color: #102018;
  background: #f6f8f3;
  border: 1px solid rgba(16, 32, 24, 0.1);
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error-banner,
.empty-state {
  padding: 1rem;
  border-radius: 1.2rem;
}

.error-banner {
  color: #9f1239;
  background: rgba(159, 18, 57, 0.08);
}

@media (max-width: 760px) {

  .detail-header,
  .claim-panel {
    flex-direction: column;
  }

  .header-actions,
  .workflow-actions {
    justify-content: flex-start;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.claim-timeline {
  display: grid;
  gap: 0.35rem;
}

.claim-timeline p {
  margin: 0;
  color: #536357;
}

.claim-timeline strong {
  color: #102018;
}
</style>
