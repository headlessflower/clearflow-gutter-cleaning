<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useSupabaseClient, useSupabaseUser } from '#imports'

type SubscriptionTier = 'starter' | 'pro' | string | null

type ContractorProfile = {
  id: string
  company_name: string | null
  contact_name: string | null
  phone: string | null
  service_area: string[] | null
  subscription_tier: SubscriptionTier
  subscription_status: string | null
  monthly_lead_view_limit: number | null
  monthly_lead_views_used: number | null
}

type LeadRow = {
  id: string
  name: string | null
  phone: string | null
  email: string | null
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

type ViewedLeadRow = {
  booking_id: string
}
type LeadClaimRow = {
  booking_id: string
  contractor_id: string
  status: string | null
  claimed_at: string | null
  expires_at: string | null
}

type LeadWithState = LeadRow & {
  is_claimed?: boolean
  claimed_by_me?: boolean
  claim_status?: string | null
}
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const profile = ref<ContractorProfile | null>(null)
const leads = ref<LeadWithState[]>([])
const viewedLeadIds = ref<string[]>([])
const selectedLead = ref<LeadWithState | null>(null)
const loading = ref(true)
const unlocking = ref(false)
const errorMessage = ref('')

const claimingId = ref<string | null>(null)
const claimedLeadIds = ref<string[]>([])

const cityFilter = ref('all')
const dateFilter = ref('all')
const searchFilter = ref('')
const minQuoteFilter = ref('')
const leadStatusFilter = ref('all')

const isActive = computed(() => profile.value?.subscription_status === 'active')
const isStarter = computed(() => profile.value?.subscription_tier === 'starter')
const isPro = computed(() => profile.value?.subscription_tier === 'pro')
const monthlyLimit = computed(() => profile.value?.monthly_lead_view_limit ?? 10)
const monthlyUsed = computed(() => viewedLeadIds.value.length)

const monthlyRemaining = computed(() => {
  return Math.max(0, monthlyLimit.value - monthlyUsed.value)
})

const canBrowseFullFeed = computed(() => isActive.value && (isStarter.value || isPro.value))

const uniqueCities = computed(() => {
  return [...new Set(leads.value.map((lead) => lead.city).filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b),
  )
})

const filteredLeads = computed(() => {
  return leads.value
    .filter((lead) => {
      if (cityFilter.value === 'all') return true
      return lead.city === cityFilter.value
    })
    .filter((lead) => {
      if (dateFilter.value === 'all') return true
      if (!lead.preferred_date) return false

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const requested = new Date(`${lead.preferred_date}T00:00:00`)
      const diffDays = Math.ceil((requested.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (dateFilter.value === 'this_week') return diffDays >= 0 && diffDays <= 7
      if (dateFilter.value === 'next_14_days') return diffDays >= 0 && diffDays <= 14
      return true
    })
    .filter((lead) => {
      if (!minQuoteFilter.value) return true
      const min = Number(minQuoteFilter.value)
      if (Number.isNaN(min)) return true
      return getQuoteTotal(lead) >= min
    })
    .filter((lead) => {
      if (!searchFilter.value.trim()) return true

      const haystack = [lead.name, lead.city, lead.service_type, lead.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(searchFilter.value.trim().toLowerCase())
    })
    .filter((lead) => {
      if (leadStatusFilter.value === 'all') return true

      if (leadStatusFilter.value === 'viewed') {
        return hasViewedLead(lead.id)
      }

      if (leadStatusFilter.value === 'unviewed') {
        return !hasViewedLead(lead.id)
      }

      if (leadStatusFilter.value === 'claimed_by_me') {
        return Boolean(lead.claimed_by_me)
      }

      if (leadStatusFilter.value === 'claimed_by_others') {
        return Boolean(lead.is_claimed && !lead.claimed_by_me)
      }

      if (leadStatusFilter.value === 'available') {
        return !lead.is_claimed
      }

      return true
    })
    .sort((a, b) => {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    })
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



function getTeaserName(name: string | null) {
  if (!name) return 'New Customer'

  const parts = name.trim().split(/\s+/)
  const first = parts[0]
  const lastInitial = parts[1]?.charAt(0)

  return lastInitial ? `${first} ${lastInitial}.` : first
}

function getQuoteTotal(lead: LeadRow) {
  return lead.discounted_total_quote || lead.total_quote || 0
}

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== 'number' || value <= 0) return 'Quote pending'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | null) {
  if (!value) return 'Flexible'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function formatServiceType(value: string | null) {
  const labels: Record<string, string> = {
    single_story: 'Single-story home',
    two_story: 'Two-story home',
    multi_story: 'Multi-story home',
  }

  if (!value) return 'Gutter cleaning'
  return labels[value] || value.replaceAll('_', ' ')
}

function formatAddOn(value: string) {
  const labels: Record<string, string> = {
    heavy_debris: 'Heavy debris',
    difficult_access: 'Difficult access',
    gutter_guards: 'Gutter guards',
    oversized_gutters: 'Oversized gutters',
  }

  return labels[value] || value.replaceAll('_', ' ')
}

function hasViewedLead(leadId: string) {
  return viewedLeadIds.value.includes(leadId)
}

function canOpenLead(leadId: string) {
  if (!canBrowseFullFeed.value) return false
  if (isPro.value) return true
  if (hasViewedLead(leadId)) return true
  return monthlyRemaining.value > 0
}

async function fetchProfile() {
  const userId = await getCurrentUserId()
  if (!userId) return

  const { data, error } = await supabase
    .from('contractor_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error

  profile.value = data as ContractorProfile | null
}

function getMoreInfoTooltip(leadId: string) {
  if (canOpenLead(leadId)) return ''

  if (isStarter.value && monthlyRemaining.value <= 0 && !hasViewedLead(leadId)) {
    return 'You’ve used all 10 Starter views. Upgrade to Pro for unlimited lead access.'
  }

  if (!isActive.value) {
    return 'Activate your subscription to view full lead details.'
  }

  return ''
}

async function fetchViewedLeads() {
  const userId = await getCurrentUserId()
  if (!userId) return

  const { data, error } = await supabase
    .from('lead_views')
    .select('booking_id')
    .eq('contractor_id', userId)
    .gte('viewed_at', getMonthStartIso())

  if (error) throw error

  viewedLeadIds.value = ((data || []) as ViewedLeadRow[]).map((row) => row.booking_id)
}

async function fetchClaims() {
  const userId = await getCurrentUserId()
  if (!userId) return

  const { data, error } = await supabase
    .from('lead_claims')
    .select('booking_id, contractor_id, status, claimed_at, expires_at')
    .in('status', ['claimed', 'contacted', 'scheduled', 'completed'])

  if (error) throw error

  const claims = (data || []) as LeadClaimRow[]

  claimedLeadIds.value = claims
    .filter((claim) => claim.contractor_id === userId)
    .map((claim) => claim.booking_id)

  leads.value = leads.value.map((lead) => {
    const claim = claims.find((item) => item.booking_id === lead.id)

    return {
      ...lead,
      is_claimed: Boolean(claim),
      claimed_by_me: claim?.contractor_id === userId,
      claim_status: claim?.status ?? null,
    }
  })
}
async function fetchLeads() {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, name, phone, email,  city, zip, county, preferred_date, service_type, approx_ft, add_ons, water_access, gutter_guard_removal, notes, total_quote, discounted_total_quote, maintenance_plan, status, created_at',
    )
    .eq('status', 'lead')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw error
  leads.value = (data || []) as LeadWithState[]
}

function getMonthStartIso() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

async function recordLeadView(leadId: string) {
  const userId = await getCurrentUserId()
  if (!userId || isPro.value || hasViewedLead(leadId)) return

  const { data, error } = await supabase.rpc('record_lead_view', {
    p_booking_id: leadId,
  })

  if (error) throw error

  viewedLeadIds.value = [...new Set([...viewedLeadIds.value, leadId])]

  if (profile.value) {
    profile.value = {
      ...profile.value,
      monthly_lead_views_used:
        Number(data?.monthly_lead_views_used ?? profile.value.monthly_lead_views_used ?? viewedLeadIds.value.length),
    }
  }
}
async function openLeadDetails(lead: LeadWithState) {
  if (!user.value) {
    await router.push('/gutter-cleaning-leads/login')
    return
  }

  if (!isActive.value) {
    await router.push('/gutter-cleaning-leads/signup')
    return
  }

  if (!canOpenLead(lead.id)) {
    errorMessage.value = 'You have used all 10 Starter lead views this month. Upgrade to Pro for unlimited access.'
    return
  }

  unlocking.value = true
  errorMessage.value = ''

  try {
    await recordLeadView(lead.id)
    selectedLead.value = lead
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not open this lead. Please try again.'
  } finally {
    unlocking.value = false
  }
}
async function claimLead(lead: LeadWithState) {
  if (!user.value) {
    await router.push('/gutter-cleaning-leads/login')
    return
  }

  if (!isActive.value) {
    await router.push('/gutter-cleaning-leads/signup')
    return
  }

  if (lead.is_claimed && !lead.claimed_by_me) {
    errorMessage.value = 'This lead has already been claimed by another contractor.'
    return
  }

  claimingId.value = lead.id
  errorMessage.value = ''

  try {
    const { error } = await supabase.rpc('claim_lead', {
      p_booking_id: lead.id,
    })

    if (error) throw error

    claimedLeadIds.value = [...new Set([...claimedLeadIds.value, lead.id])]

    leads.value = leads.value.map((item) =>
      item.id === lead.id
        ? {
          ...item,
          is_claimed: true,
          claimed_by_me: true,
          claim_status: 'claimed',
        }
        : item,
    )
    selectedLead.value = {
      ...lead,
      is_claimed: true,
      claimed_by_me: true,
      claim_status: 'claimed',
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not claim this lead. It may already be claimed.'
  } finally {
    claimingId.value = null
  }
}

function closeLeadDetails() {
  selectedLead.value = null
}

async function loadPage() {
  loading.value = true
  errorMessage.value = ''

  try {
    const userId = await getCurrentUserId()
    if (!userId) return

    await fetchProfile()
    await fetchViewedLeads()
    await fetchLeads()
    await fetchClaims()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load leads.'
  } finally {
    loading.value = false
  }
}
onMounted(loadPage)
</script>

<template>
  <section class="lead-feed">
    <header class="feed-header">
      <div>
        <p class="eyebrow">Contractor lead feed</p>
        <h1>Available gutter cleaning leads</h1>
        <p>
          Browse customer quote requests. Starter members get 10 full lead views per month. Pro members get unlimited
          access.
        </p>
      </div>

      <aside class="account-card">
        <span>{{ profile?.company_name || 'Contractor account' }}</span>

        <strong>{{ profile?.subscription_tier || 'No plan' }}</strong>

        <div class="account-card__stats">
          <p v-if="isStarter">
            {{ monthlyUsed }} / {{ monthlyLimit }} views used
          </p>

          <p v-else-if="isPro">
            Unlimited lead views
          </p>

          <p v-else>
            Subscription inactive
          </p>

          <p v-if="claimedLeadIds.length">
            {{ claimedLeadIds.length }} claimed leads
          </p>
        </div>
      </aside>
    </header>

    <div v-if="!isActive && !loading" class="paywall-card">
      <div>
        <h2>Activate your subscription to view leads</h2>
        <p>Choose Starter or Pro to unlock full customer details.</p>
      </div>
      <NuxtLink to="/gutter-cleaning-leads/reactivate" class="primary-button">Choose a Plan</NuxtLink>
    </div>

    <section class="filters-card">
      <label class="field field--search">
        <span>Search</span>
        <input v-model="searchFilter" type="text" placeholder="Name, city, service, notes" />
      </label>

      <label class="field">
        <span>Status</span>
        <select v-model="leadStatusFilter">
          <option value="all">All leads</option>
          <option value="available">Available only</option>
          <option value="unviewed">Unviewed </option>
          <option value="viewed">Viewed </option>
          <option value="claimed_by_me">Claimed by me </option>
          <option value="claimed_by_others">Claimed by others</option>

        </select>
      </label>

      <label class="field">
        <span>City</span>
        <select v-model="cityFilter">
          <option value="all">All cities</option>
          <option v-for="city in uniqueCities" :key="city" :value="city">{{ city }}</option>
        </select>
      </label>

      <label class="field">
        <span>Date</span>
        <select v-model="dateFilter">
          <option value="all">Any date</option>
          <option value="this_week">This week</option>
          <option value="next_14_days">Next 14 days</option>
        </select>
      </label>

      <label class="field">
        <span>Minimum quote</span>
        <input v-model="minQuoteFilter" type="number" min="0" step="25" placeholder="250" />
      </label>
    </section>

    <div class="quick-filters">
      <button type="button" :class="{ active: leadStatusFilter === 'all' }" @click="leadStatusFilter = 'all'">
        All
      </button>

      <button type="button" :class="{ active: leadStatusFilter === 'available' }"
        @click="leadStatusFilter = 'available'">
        Available
      </button>

      <button type="button" :class="{ active: leadStatusFilter === 'viewed' }" @click="leadStatusFilter = 'viewed'">
        Viewed
      </button>

      <button type="button" :class="{ active: leadStatusFilter === 'claimed_by_me' }"
        @click="leadStatusFilter = 'claimed_by_me'">
        My claimed leads
      </button>
    </div>
    <div class="filter-summary">
      Showing {{ filteredLeads.length }} of {{ leads.length }} leads
    </div>


    <p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

    <div v-if="loading" class="empty-state">
      <h2>Loading leads...</h2>
      <p>Checking your account and pulling the latest customer requests.</p>
    </div>

    <div v-else-if="!filteredLeads.length" class="empty-state">
      <h2>No matching leads</h2>
      <p>Try clearing your filters or widening your search.</p>
    </div>

    <section v-else class="lead-grid">
      <article v-for="lead in filteredLeads" :key="lead.id" class="lead-card">
        <div class="lead-card__top">
          <div>
            <h2>{{ hasViewedLead(lead.id) || isPro ? lead.name : getTeaserName(lead.name) }}</h2>
            <p>{{ lead.city || 'Los Angeles' }}</p>
          </div>
          <span class="quote-pill">{{ formatCurrency(getQuoteTotal(lead)) }}</span>
        </div>

        <dl class="lead-meta">
          <div>
            <dt>Requested</dt>
            <dd>{{ formatDate(lead.preferred_date) }}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{{ formatServiceType(lead.service_type) }}</dd>
          </div>
        </dl>

        <div class="lead-card__footer">
          <span class="viewed-badge" :class="{
            'viewed-badge--owned': lead.claimed_by_me,
            'viewed-badge--claimed': lead.is_claimed && !lead.claimed_by_me,
            'viewed-badge--viewed': hasViewedLead(lead.id) && !lead.is_claimed,
          }">
            <template v-if="lead.claimed_by_me">
              ✓ Claimed by you
            </template>
            <template v-else-if="lead.is_claimed">
              Claimed
            </template>
            <template v-else-if="hasViewedLead(lead.id)">
              Viewed
            </template>
            <template v-else-if="isStarter">
              Uses 1 view
            </template>
            <template v-else>
              Included
            </template>
          </span>
          <div class="lead-actions">
            <div class="tooltip-wrap">
              <button type="button" :disabled="unlocking || !canOpenLead(lead.id)" @click="openLeadDetails(lead)">
                More Info
              </button>

              <span v-if="getMoreInfoTooltip(lead.id)" class="tooltip">
                {{ getMoreInfoTooltip(lead.id) }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <div v-if="selectedLead" class="modal-backdrop" @click.self="closeLeadDetails">
      <article class="lead-modal" role="dialog" aria-modal="true">
        <div class="modal-actions">
          <button v-if="selectedLead" type="button" class="claim-modal-button" :disabled="claimingId === selectedLead.id ||
            (selectedLead.is_claimed && !selectedLead.claimed_by_me)
            " @click="claimLead(selectedLead)">
            <template v-if="claimingId === selectedLead.id">
              Claiming...
            </template>
            <template v-else-if="selectedLead.claimed_by_me">
              Claimed by you
            </template>
            <template v-else-if="selectedLead.is_claimed">
              Already claimed
            </template>
            <template v-else>
              Claim Lead
            </template>
          </button>

          <button class="close-button" type="button" @click="closeLeadDetails">
            Close
          </button>
        </div>

        <div class="modal-header">
          <p class="eyebrow">Full lead details</p>
          <h2>{{ selectedLead.name || 'New Customer' }}</h2>
          <p>{{ selectedLead.city }}, {{ selectedLead.zip }}</p>

          <p v-if="selectedLead.claimed_by_me" class="claim-status-note claim-status-note--owned">
            You claimed this lead. Contact the customer within 3 days to keep it assigned.
          </p>

          <p v-else-if="selectedLead.is_claimed" class="claim-status-note claim-status-note--claimed">
            This lead has already been claimed by another contractor.
          </p>

          <p v-else class="claim-status-note">
            Claim this lead to reserve it for 3 days.
          </p>
        </div>

        <dl class="details-grid">
          <div>
            <dt>Phone</dt>
            <dd>{{ selectedLead.phone || 'Not provided' }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ selectedLead.email || 'Not provided' }}</dd>
          </div>
          <div>
           <strong>
              {{ selectedLead.city || 'Los Angeles area' }}<span v-if="selectedLead.zip">, {{ selectedLead.zip }}</span></strong>
          </div>
          <div>
            <dt>Requested date</dt>
            <dd>{{ formatDate(selectedLead.preferred_date) }}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{{ formatServiceType(selectedLead.service_type) }}</dd>
          </div>
          <div>
            <dt>Approx. feet</dt>
            <dd>{{ selectedLead.approx_ft || 'Not provided' }}</dd>
          </div>
          <div>
            <dt>Quote total</dt>
            <dd>{{ formatCurrency(getQuoteTotal(selectedLead)) }}</dd>
          </div>
          <div>
            <dt>Maintenance plan</dt>
            <dd>{{ selectedLead.maintenance_plan || 'None selected' }}</dd>
          </div>
          <div>
            <dt>Water access</dt>
            <dd>{{ selectedLead.water_access ? 'Yes' : 'No / unknown' }}</dd>
          </div>
          <div>
            <dt>Gutter guard removal</dt>
            <dd>{{ selectedLead.gutter_guard_removal ? 'Yes' : 'No' }}</dd>
          </div>
        </dl>

        <div v-if="selectedLead.add_ons?.length" class="detail-section">
          <h3>Add-ons</h3>
          <div class="chips">
            <span v-for="addOn in selectedLead.add_ons" :key="addOn">{{ formatAddOn(addOn) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>Notes</h3>
          <p>{{ selectedLead.notes || 'No notes provided.' }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.lead-feed {
  color: #102018;
}

.feed-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: #1f6f3d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.feed-header h1 {
  max-width: 820px;
  margin: 0;
  font-size: clamp(2.6rem, 6vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.feed-header p {
  max-width: 720px;
  color: #536357;
  line-height: 1.7;
}

.account-card,
.filters-card,
.lead-card,
.empty-state,
.error-banner,
.paywall-card,
.lead-modal {
  border: 1px solid rgba(16, 32, 24, 0.08);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 60px rgba(16, 32, 24, 0.08);
}

.account-card {
  display: grid;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: 1.3rem;
}

.account-card span,
.account-card p {
  margin: 0;
  color: #69766d;
}

.account-card strong {
  text-transform: capitalize;
  font-size: 1.5rem;
}

.paywall-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1.3rem;
}

.paywall-card h2,
.paywall-card p {
  margin: 0;
}

.paywall-card p {
  color: #69766d;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0 1rem;
  border-radius: 999px;
  color: #fff;
  background: #1f6f3d;
  font-weight: 900;
  text-decoration: none;
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
}

.filters-card {
  display: grid;
  grid-template-columns: minmax(300px, 1.4fr) repeat(4, minmax(160px, 1fr));
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1.3rem;
  box-sizing: border-box;
}

@media (max-width: 1100px) {
  .filters-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field--search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 680px) {
  .filters-card {
    grid-template-columns: 1fr;
  }
}

.field {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
}

.field span {
  color: #3d5246;
  font-size: 0.88rem;
  font-weight: 900;
}

.field input,
.field select {
  width: 100%;
  min-width: 0;
  min-height: 3rem;
  border: 1px solid rgba(16, 32, 24, 0.12);
  border-radius: 1rem;
  background: #fff;
  color: #102018;
  padding: 0 0.9rem;
  font: inherit;
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

.lead-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.lead-card {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1.3rem;
}

.lead-card__top,
.lead-card__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.lead-card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.35rem;
}

.lead-card p {
  margin: 0;
  color: #69766d;
}

.quote-pill,
.viewed-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.45rem;
  border-radius: 999px;
  padding: 0 1rem;
  font-size: 0.95rem;
  font-weight: 950;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.quote-pill {
  flex: 0 0 auto;
  color: #1f6f3d;
  background: rgba(31, 111, 61, 0.1);
}

.viewed-badge {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  font-weight: 900;
}

.lead-meta {
  display: grid;
  gap: 0.7rem;
  margin: 0;
}

.lead-meta dt,
.details-grid dt {
  color: #7a877e;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lead-meta dd,
.details-grid dd {
  margin: 0;
  color: #102018;
  font-weight: 750;
}

.lead-card button,
.close-button {
  min-height: 2.6rem;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: #1f6f3d;
  padding: 0 0.9rem;
  font-weight: 900;
  cursor: pointer;
}

.lead-card button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(16, 32, 24, 0.48);
}

.lead-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: 1.25rem;
  border-radius: 1.5rem;
}

.close-button {
  float: right;
}

.modal-header {
  margin-bottom: 1rem;
}

.modal-header h2 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.modal-header p:not(.eyebrow) {
  margin: 0.5rem 0 0;
  color: #69766d;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  margin: 0;
}

.details-grid div,
.detail-section {
  padding: 0.9rem;
  border-radius: 1rem;
  background: #f6f8f3;
}

.detail-section {
  margin-top: 0.8rem;
}

.detail-section h3,
.detail-section p {
  margin: 0;
}

.detail-section h3 {
  margin-bottom: 0.6rem;
}

.detail-section p {
  color: #536357;
  line-height: 1.65;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chips span {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  color: #1f6f3d;
  background: rgba(31, 111, 61, 0.1);
  font-weight: 850;
}

@media (max-width: 980px) {

  .feed-header,
  .filters-card,
  .lead-grid {
    grid-template-columns: 1fr 1fr;
  }

  .field--search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 680px) {

  .feed-header,
  .filters-card,
  .lead-grid,
  .details-grid,
  .paywall-card {
    grid-template-columns: 1fr;
  }

  .paywall-card,
  .lead-card__footer {
    align-items: stretch;
    flex-direction: column;
  }
}

.lead-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.claim-button {
  color: #1f6f3d !important;
  background: rgba(31, 111, 61, 0.1) !important;
}

.claim-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.viewed-badge--owned {
  color: #fff;
  background: linear-gradient(135deg, #c65a2e 0%, #9f3f1f 100%);
  box-shadow:
    0 12px 28px rgba(198, 90, 46, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.viewed-badge--claimed {
  color: #c2410c;
  background: #fff7ed;
  border: 1px solid #fed7aa;
}

.viewed-badge--viewed {
  color: #536357;
  background: #f6f8f3;
  border: 1px solid #e2e8f0;
}

@media (max-width: 680px) {
  .lead-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.claim-modal-button {
  min-height: 2.6rem;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: #1f6f3d;
  padding: 0 1rem;
  font-weight: 900;
  cursor: pointer;
}

.claim-modal-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.claim-status-note {
  display: inline-flex;
  margin-top: 0.85rem !important;
  padding: 0.65rem 0.85rem;
  border-radius: 999px;
  color: #1f6f3d !important;
  background: rgba(31, 111, 61, 0.1);
  font-weight: 850;
}

.claim-status-note--owned {
  color: #1f6f3d !important;
  background: rgba(31, 111, 61, 0.14);
}

.claim-status-note--claimed {
  color: #c2410c !important;
  background: #fff7ed;
}

.close-button {
  color: #102018;
  background: #f6f8f3;
}

.filter-summary {
  margin: -0.25rem 0 1rem;
  color: #536357;
  font-weight: 800;
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0 0 1rem;
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
  margin: -0.25rem 0 1rem;
  color: #536357;
  font-weight: 800;
}

.account-card__stats {
  display: grid;
  gap: 0.25rem;
}

.account-card__stats p {
  margin: 0;
  color: #69766d;
}

.tooltip-wrap {
  position: relative;
  display: inline-flex;
}

.tooltip {
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.6rem);
  z-index: 20;
  width: max-content;
  max-width: 260px;
  padding: 0.65rem 0.8rem;
  border-radius: 0.8rem;
  background: #102018;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.35;
  box-shadow: 0 14px 30px rgba(16, 32, 24, 0.18);
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  right: 1rem;
  top: 100%;
  border-width: 0.45rem;
  border-style: solid;
  border-color: #102018 transparent transparent transparent;
}

.tooltip-wrap:hover .tooltip,
.tooltip-wrap:focus-within .tooltip {
  opacity: 1;
  transform: translateY(0);
}

.lead-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  margin-top: 1.2rem;
}

@media (max-width: 640px) {
  .lead-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .viewed-badge,
  .lead-actions button {
    width: 100%;
  }
}
</style>
