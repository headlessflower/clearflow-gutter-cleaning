<template>
  <section class="my-leads-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Contractor workspace</p>
        <h1>My Leads</h1>
        <p>
          Track claimed leads, mark customers as contacted, and manage your follow-up pipeline.
        </p>
      </div>

      <NuxtLink to="/gutter-cleaning-leads/leads" class="primary-button">
        Browse More Leads
      </NuxtLink>
    </header>

    <section class="stats-grid">
      <article class="stat-card">
        <span>Claimed</span>
        <strong>{{ statusCounts.claimed }}</strong>
      </article>

      <article class="stat-card">
        <span>Contacted</span>
        <strong>{{ statusCounts.contacted }}</strong>
      </article>

      <article class="stat-card">
        <span>Scheduled</span>
        <strong>{{ statusCounts.scheduled }}</strong>
      </article>

      <article class="stat-card">
        <span>Pipeline Value</span>
        <strong>{{ formatCurrency(pipelineValue) }}</strong>
      </article>
    </section>

    <section class="filters-card">
      <label class="field field--search">
        <span>Search</span>
        <input v-model="searchFilter" type="text" placeholder="Name, city, notes" />
      </label>

      <label class="field">
        <span>Status</span>
        <select v-model="statusFilter">
          <option value="all">All statuses</option>
          <option value="claimed">Claimed</option>
          <option value="contacted">Contacted</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="lost">Lost</option>
          <option value="expired">Expired</option>
        </select>
      </label>
    </section>

    <div class="quick-filters">
      <button type="button" :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">
        All
      </button>

      <button type="button" :class="{ active: statusFilter === 'claimed' }" @click="statusFilter = 'claimed'">
        Claimed
      </button>

      <button type="button" :class="{ active: statusFilter === 'contacted' }" @click="statusFilter = 'contacted'">
        Contacted
      </button>

      <button type="button" :class="{ active: statusFilter === 'scheduled' }" @click="statusFilter = 'scheduled'">
        Scheduled
      </button>
    </div>

    <p class="filter-summary">
      Showing {{ filteredClaims.length }} of {{ claims.length }} leads
    </p>

    <p v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </p>

    <div v-if="loading" class="empty-state">
      <h2>Loading your leads...</h2>
      <p>Pulling your claimed and contacted lead activity.</p>
    </div>

    <div v-else-if="!filteredClaims.length" class="empty-state">
      <h2>No leads found</h2>
      <p>
        Claim leads from the lead feed to start building your pipeline.
      </p>

      <NuxtLink to="/gutter-cleaning-leads/leads" class="primary-button">
        Browse Leads
      </NuxtLink>
    </div>

    <section v-else class="claims-list">
      <article v-for="claim in filteredClaims" :key="claim.id" class="claim-card">
        <div class="claim-main">
          <div class="claim-topline">
            <span class="status-pill" :class="`status-pill--${claim.status}`">
              {{ formatStatus(claim.status) }}
            </span>

            <span v-if="claim.status === 'claimed'" class="deadline-pill">
              Expires {{ formatDateTime(claim.expires_at) }}
            </span>
          </div>

          <h2>{{ claim.bookings?.name || 'New Customer' }}</h2>

          <p class="claim-location">
            {{ claim.bookings?.city || 'Los Angeles area' }}
          </p>

          <dl class="claim-meta">
            <div>
              <dt>Quote</dt>
              <dd>{{ formatCurrency(getQuoteTotal(claim.bookings)) }}</dd>
            </div>

            <div>
              <dt>Requested</dt>
              <dd>{{ formatDate(claim.bookings?.preferred_date) }}</dd>
            </div>

            <div>
              <dt>Service</dt>
              <dd>{{ formatServiceType(claim.bookings?.service_type) }}</dd>
            </div>

            <div>
              <dt>Claimed</dt>
              <dd>{{ formatDateTime(claim.claimed_at) }}</dd>
            </div>
          </dl>

          <div v-if="claim.notes" class="notes-box">
            <strong>Notes</strong>
            <p>{{ claim.notes }}</p>
          </div>
        </div>

        <div class="claim-actions">
          <NuxtLink :to="`/gutter-cleaning-leads/leads/${claim.booking_id}`" class="secondary-button">
            View Details
          </NuxtLink>
          <button v-if="claim.status === 'claimed'" type="button" class="primary-button"
            :disabled="updatingId === claim.id" @click="markContacted(claim)">
            {{ updatingId === claim.id ? 'Saving...' : 'Mark Contacted' }}
          </button>

          <button v-if="claim.status === 'contacted'" type="button" class="primary-button"
            :disabled="updatingId === claim.id" @click="updateClaimStatus(claim, 'scheduled')">
            {{ updatingId === claim.id ? 'Saving...' : 'Mark Scheduled' }}
          </button>

          <button v-if="claim.status === 'scheduled'" type="button" class="primary-button"
            :disabled="updatingId === claim.id" @click="updateClaimStatus(claim, 'completed')">
            {{ updatingId === claim.id ? 'Saving...' : 'Mark Completed' }}
          </button>

          <button v-if="['claimed', 'contacted', 'scheduled'].includes(claim.status)" type="button"
            class="secondary-button" :disabled="updatingId === claim.id" @click="updateClaimStatus(claim, 'lost')">
            Mark Lost
          </button>

          <button type="button" class="secondary-button" @click="openNotes(claim)">
            Add Note
          </button>
        </div>
      </article>
    </section>

    <div v-if="selectedClaim" class="modal-backdrop" @click.self="closeNotes">
      <article class="notes-modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div>
            <p class="eyebrow">Lead notes</p>
            <h2>{{ selectedClaim.bookings?.name || 'New Customer' }}</h2>
          </div>

          <button type="button" class="close-button" @click="closeNotes">
            Close
          </button>
        </div>

        <label class="field">
          <span>Notes</span>
          <textarea v-model="noteDraft" rows="6" placeholder="Example: Left voicemail. Follow up tomorrow morning." />
        </label>

        <button type="button" class="primary-button" :disabled="updatingId === selectedClaim.id" @click="saveNotes">
          {{ updatingId === selectedClaim.id ? 'Saving...' : 'Save Notes' }}
        </button>
      </article>
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

type Booking = {
  id: string
  name: string | null
  city: string | null
  preferred_date: string | null
  service_type: string | null
  total_quote: number | null
  discounted_total_quote: number | null
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
  bookings: Booking | null
}

const supabase = useSupabaseClient()
const router = useRouter()

const claims = ref<LeadClaim[]>([])
const loading = ref(true)
const errorMessage = ref('')
const updatingId = ref<string | null>(null)

const searchFilter = ref('')
const statusFilter = ref<'all' | ClaimStatus>('all')

const selectedClaim = ref<LeadClaim | null>(null)
const noteDraft = ref('')

onMounted(loadPage)

const filteredClaims = computed(() => {
  return claims.value
    .filter((claim) => {
      if (statusFilter.value === 'all') return true
      return claim.status === statusFilter.value
    })
    .filter((claim) => {
      if (!searchFilter.value.trim()) return true

      const haystack = [
        claim.bookings?.name,
        claim.bookings?.city,
        claim.bookings?.service_type,
        claim.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(searchFilter.value.trim().toLowerCase())
    })
})

const statusCounts = computed(() => {
  return {
    claimed: claims.value.filter((claim) => claim.status === 'claimed').length,
    contacted: claims.value.filter((claim) => claim.status === 'contacted').length,
    scheduled: claims.value.filter((claim) => claim.status === 'scheduled').length,
    completed: claims.value.filter((claim) => claim.status === 'completed').length,
    lost: claims.value.filter((claim) => claim.status === 'lost').length,
  }
})

const pipelineValue = computed(() => {
  return claims.value
    .filter((claim) => ['claimed', 'contacted', 'scheduled', 'completed'].includes(claim.status))
    .reduce((sum, claim) => {
      return sum + getQuoteTotal(claim.bookings)
    }, 0)
})

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

    await expireOldClaims(userId)
    await loadClaims(userId)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load your leads.'
  } finally {
    loading.value = false
  }
}

async function expireOldClaims(userId: string) {
  const { error } = await supabase
    .from('lead_claims')
    .update({
      status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('contractor_id', userId)
    .eq('status', 'claimed')
    .lt('expires_at', new Date().toISOString())

  if (error) throw error
}

async function loadClaims(userId: string) {
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
      updated_at,
      bookings (
        id,
        name,
        city,
        preferred_date,
        service_type,
        total_quote,
        discounted_total_quote
      )
    `)
    .eq('contractor_id', userId)
    .order('claimed_at', { ascending: false })

  if (error) throw error

  claims.value = (data || []) as LeadClaim[]
}

async function markContacted(claim: LeadClaim) {
  updatingId.value = claim.id
  errorMessage.value = ''

  try {
    const { error } = await supabase.rpc('mark_lead_contacted', {
      p_booking_id: claim.booking_id,
    })

    if (error) throw error

    await loadPage()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not mark this lead as contacted.'
  } finally {
    updatingId.value = null
  }
}

async function updateClaimStatus(claim: LeadClaim, status: ClaimStatus) {
  updatingId.value = claim.id
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
      .eq('id', claim.id)

    if (error) throw error

    await loadPage()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not update this lead.'
  } finally {
    updatingId.value = null
  }
}

function openNotes(claim: LeadClaim) {
  selectedClaim.value = claim
  noteDraft.value = claim.notes || ''
}

function closeNotes() {
  selectedClaim.value = null
  noteDraft.value = ''
}

async function saveNotes() {
  if (!selectedClaim.value) return

  updatingId.value = selectedClaim.value.id
  errorMessage.value = ''

  try {
    const { error } = await supabase
      .from('lead_claims')
      .update({
        notes: noteDraft.value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedClaim.value.id)

    if (error) throw error

    closeNotes()
    await loadPage()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not save notes.'
  } finally {
    updatingId.value = null
  }
}

function getQuoteTotal(booking: Booking | null | undefined) {
  return Number(booking?.discounted_total_quote || booking?.total_quote || 0)
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

function formatStatus(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}
</script>

<style scoped>
.my-leads-page {
  max-width: 1180px;
  margin: 0 auto;
  color: #102018;
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: #1f6f3d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page-header h1 {
  margin: 0;
  font-size: clamp(3rem, 6vw, 5.2rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.page-header p:not(.eyebrow) {
  max-width: 680px;
  color: #536357;
  font-size: 1.1rem;
  line-height: 1.65;
}

.primary-button,
.secondary-button,
.close-button {
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

.secondary-button,
.close-button {
  color: #102018;
  background: #f6f8f3;
  border: 1px solid rgba(16, 32, 24, 0.1);
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card,
.filters-card,
.claim-card,
.empty-state,
.error-banner,
.notes-modal {
  border: 1px solid rgba(16, 32, 24, 0.08);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 24px 60px rgba(16, 32, 24, 0.08);
}

.stat-card {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 1.2rem;
}

.stat-card span {
  color: #64748b;
  font-weight: 800;
}

.stat-card strong {
  font-size: 2rem;
  letter-spacing: -0.04em;
}

.filters-card {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 220px;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1.3rem;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field span {
  color: #3d5246;
  font-size: 0.9rem;
  font-weight: 900;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-height: 3rem;
  border: 1px solid rgba(16, 32, 24, 0.12);
  border-radius: 1rem;
  background: #fff;
  color: #102018;
  padding: 0 0.9rem;
  font: inherit;
}

.field textarea {
  min-height: 9rem;
  padding: 0.9rem;
  resize: vertical;
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.quick-filters button {
  border: 1px solid rgba(16, 32, 24, 0.1);
  border-radius: 999px;
  background: white;
  color: #3d5246;
  padding: 0.55rem 0.85rem;
  font-weight: 850;
  cursor: pointer;
}

.quick-filters button.active {
  background: #1f6f3d;
  color: white;
}

.filter-summary {
  margin: 0 0 1rem;
  color: #536357;
  font-weight: 800;
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

.empty-state {
  display: grid;
  gap: 0.8rem;
}

.empty-state h2,
.empty-state p {
  margin: 0;
}

.claims-list {
  display: grid;
  gap: 1rem;
}

.claim-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 1.4rem;
}

.claim-main {
  min-width: 0;
}

.claim-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 0.8rem;
}

.status-pill,
.deadline-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  border-radius: 999px;
  padding: 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 900;
}

.status-pill {
  color: #334155;
  background: #f1f5f9;
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

.deadline-pill {
  color: #b45309;
  background: #fffbeb;
}

.claim-card h2 {
  margin: 0;
  color: #102018;
  font-size: 1.45rem;
}

.claim-location {
  margin: 0.35rem 0 1rem;
  color: #69766d;
}

.claim-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
  margin: 0;
}

.claim-meta div,
.notes-box {
  padding: 0.85rem;
  border-radius: 1rem;
  background: #f6f8f3;
}

.claim-meta dt {
  color: #7a877e;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.claim-meta dd {
  margin: 0.25rem 0 0;
  color: #102018;
  font-weight: 800;
}

.notes-box {
  margin-top: 0.8rem;
}

.notes-box p {
  margin: 0.35rem 0 0;
  color: #536357;
  line-height: 1.55;
}

.claim-actions {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: stretch;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(16, 32, 24, 0.48);
}

.notes-modal {
  width: min(640px, 100%);
  padding: 1.25rem;
  border-radius: 1.4rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-header h2 {
  margin: 0;
}

@media (max-width: 900px) {

  .page-header,
  .claim-card {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .stats-grid,
  .claim-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {

  .stats-grid,
  .claim-meta {
    grid-template-columns: 1fr;
  }
}
</style>
