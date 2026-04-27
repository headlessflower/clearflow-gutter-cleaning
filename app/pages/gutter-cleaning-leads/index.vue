<script setup lang="ts">

definePageMeta({
  layout: 'leads'
})
import { computed, onMounted, ref } from 'vue'
import { useSupabaseClient } from '#imports'

type TeaserLead = {
  id: string
  name: string | null
  city: string | null
  preferred_date: string | null
  service_type: string | null
  total_quote: number | null
  discounted_total_quote: number | null
  is_viewed?: boolean
  is_claimed?: boolean
  claimed_by_me?: boolean
  claim_status?: string | null
  claimed_at?: string | null
  expires_at?: string | null
}

const supabase = useSupabaseClient()

const leads = ref<TeaserLead[]>([])
const loading = ref(true)
const errorMessage = ref('')
const viewingId = ref<string | null>(null)
const claimingId = ref<string | null>(null)

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'For solo gutter cleaners testing local lead access.',
    features: ['View full customer details', 'Access local lead feed', 'City and date filters', 'Cancel anytime'],
    cta: 'Select Starter ',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'Best for contractors who want steady lead flow.',
    features: ['Unlimited lead access', 'Priority new lead visibility', 'Quote amount filters', 'Saved service areas'],
    cta: 'Start Pro',
    highlighted: true,
  },
]

const visibleLeadCount = computed(() => leads.value.length)
const averageQuote = computed(() => {
  const values = leads.value
    .map((lead) => getQuoteTotal(lead))
    .filter((value): value is number => typeof value === 'number')

  if (!values.length) return null

  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round(total / values.length)
})



function getTeaserName(name: string | null) {
  if (!name) return 'New Customer'

  const parts = name.trim().split(/\s+/)
  const first = parts[0]
  const lastInitial = parts[1]?.charAt(0)

  return lastInitial ? `${first} ${lastInitial}.` : first
}

function getQuoteTotal(lead: TeaserLead) {
  return lead.discounted_total_quote || lead.total_quote || null
}

function formatCurrency(value: number | null) {
  if (typeof value !== 'number') return 'Quote pending'

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

async function fetchLeadTeasers() {
  loading.value = true
  errorMessage.value = ''

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      name,
      city,
      preferred_date,
      service_type,
      total_quote,
      discounted_total_quote,
      created_at
    `)
    .eq('status', 'lead')
    .order('created_at', { ascending: false })
    .limit(50)

  if (bookingsError) {
    errorMessage.value = bookingsError.message
    leads.value = []
    loading.value = false
    return
  }

  const bookingIds = bookings?.map((booking) => booking.id) ?? []

  let activeClaims: Array<{
    booking_id: string
    status: string | null
    claimed_at: string | null
    expires_at: string | null
  }> = []

  if (bookingIds.length > 0) {
    const { data: claims, error: claimsError } = await supabase
      .from('lead_claims')
      .select('booking_id, status, claimed_at, expires_at')
      .in('booking_id', bookingIds)
      .in('status', ['claimed', 'contacted', 'scheduled', 'completed'])

    if (claimsError) {
      console.error('Claims error:', claimsError.message)
    } else {
      activeClaims = claims ?? []
    }
  }

  const claimMap = new Map(
    activeClaims.map((claim) => [claim.booking_id, claim])
  )

  leads.value = (bookings ?? []).map((lead) => {
    const claim = claimMap.get(lead.id)

    return {
      ...lead,
      is_claimed: Boolean(claim),
      claim_status: claim?.status ?? null,
      claimed_at: claim?.claimed_at ?? null,
      expires_at: claim?.expires_at ?? null,
    }
  })

  loading.value = false
}
onMounted(fetchLeadTeasers)
</script>

<template>
  <main class="lead-landing">
    <section class="hero-section">


      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Gutter cleaning lead marketplace</p>
          <h1>See local gutter cleaning jobs before you subscribe.</h1>
          <p class="hero-description">
            View active customer quote requests in your area. Subscribe to unlock full customer
            details, contact info, addresses, notes, and service requests.
          </p>

          <div class="hero-actions">
            <NuxtLink to="/gutter-cleaning-leads/signup" class="primary-button">Start Getting Leads</NuxtLink>
            <NuxtLink to="/gutter-cleaning-leads/login" class="secondary-button">Login</NuxtLink>
          </div>

          <div class="hero-metrics" aria-label="Lead marketplace stats">
            <article>
              <strong>{{ visibleLeadCount }}+</strong>
              <span>active leads available</span>
            </article>
            <article>
              <strong>{{ formatCurrency(averageQuote) }}</strong>
              <span>average quote preview</span>
            </article>
            <article>
              <strong>LA</strong>
              <span>local service area</span>
            </article>
          </div>
        </div>

        <aside class="hero-panel" aria-label="Example lead preview">
          <div class="panel-header">
            <span class="live-dot"></span>
            <span>Live lead previews</span>
          </div>

          <div class="mini-leads">
            <article v-for="lead in leads.slice(0, 4)" :key="lead.id" class="mini-lead-card">
              <div>
                <strong>{{ getTeaserName(lead.name) }}</strong>
                <span>{{ lead.city || 'Los Angeles' }}</span>
              </div>
              <p>{{ formatCurrency(getQuoteTotal(lead)) }}</p>
            </article>

            <article v-if="loading" class="mini-lead-card skeleton-card">
              <div>
                <strong>Loading leads...</strong>
                <span>Checking available requests</span>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </section>

    <section class="lead-preview-section" id="leads-preview">
      <div class="section-heading">
        <p class="eyebrow">Preview available leads</p>
        <h2>Recent customer quote requests</h2>
        <p>
          Everyone can see teaser info. Paid contractors can log in to view the full customer record.
        </p>
      </div>

      <p v-if="errorMessage" class="error-banner">
        Could not load lead previews: {{ errorMessage }}
      </p>

      <div v-if="loading" class="lead-grid">
        <article v-for="item in 8" :key="item" class="lead-card is-loading">
          <div class="loading-line large"></div>
          <div class="loading-line"></div>
          <div class="loading-line short"></div>
        </article>
      </div>

      <div v-else-if="!leads.length" class="empty-state">
        <h3>No lead previews available yet</h3>
        <p>Once customers submit quote requests, the latest 50 will appear here.</p>
      </div>

      <div v-else class="lead-grid">
        <article v-for="lead in leads" :key="lead.id" class="lead-card">
          <div class="lead-card-header">
            <span class="lead-status-badge" :class="lead.is_claimed ? 'is-claimed' : 'is-available'">
              {{ lead.is_claimed ? 'Claimed' : 'Available' }}
            </span>

            <span v-if="lead.is_claimed" class="activity-note">
              Recently claimed
            </span>
          </div>
          <div class="lead-card__top">
            <div>
              <h3>{{ getTeaserName(lead.name) }}</h3>
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

          <NuxtLink to="/gutter-cleaning-leads/login" class="details-button">Login to view details</NuxtLink>
        </article>
      </div>
    </section>

    <section class="pricing-section" id="pricing">
      <div class="section-heading">
        <p class="eyebrow">Simple pricing</p>
        <h2>Unlock the full lead feed</h2>
        <p>Start simple: monthly access with no complicated lead credits.</p>
      </div>

      <div class="pricing-grid">
        <article v-for="plan in plans" :key="plan.name" class="pricing-card"
          :class="{ 'is-highlighted': plan.highlighted }">
          <div>
            <p class="plan-name">{{ plan.name }}</p>
            <h3>{{ plan.price }}<span>/mo</span></h3>
            <p class="plan-description">{{ plan.description }}</p>
          </div>

          <ul>
            <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
          </ul>

          <NuxtLink to="/gutter-cleaning-leads/signup" class="plan-button">{{ plan.cta }}</NuxtLink>
        </article>
      </div>
    </section>

    <section class="login-cta-section">
      <div>
        <p class="eyebrow">Already subscribed?</p>
        <h2>Log in and go straight to your lead feed.</h2>
      </div>
      <NuxtLink to="/gutter-cleaning-leads/login" class="primary-button">Login to Leads</NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.lead-landing {
  min-height: 100vh;
  color: #102018;
  background: #f6f8f3;
}

.hero-section {
  padding: 1rem 0 4rem;
  background:
    radial-gradient(circle at 15% 15%, rgba(80, 148, 94, 0.18), transparent 30%),
    linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
}

.top-nav,
.hero-grid,
.lead-preview-section,
.pricing-section,
.login-cta-section {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 3rem;
}

.brand,
.nav-link,
.nav-button,
.primary-button,
.secondary-button,
.details-button,
.plan-button {
  text-decoration: none;
}

.brand {
  font-weight: 800;
  color: #102018;
  letter-spacing: -0.03em;
}

.nav-actions,
.hero-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.nav-link {
  color: #3d5246;
  font-weight: 700;
}

.nav-button,
.primary-button,
.plan-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0 1rem;
  border-radius: 999px;
  color: #fff;
  background: #1f6f3d;
  font-weight: 800;
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
}

.secondary-button,
.details-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0 1rem;
  border-radius: 999px;
  color: #1f6f3d;
  background: #fff;
  border: 1px solid rgba(31, 111, 61, 0.16);
  font-weight: 800;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 2rem;
  align-items: center;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: #1f6f3d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-copy h1,
.section-heading h2,
.login-cta-section h2 {
  margin: 0;
  color: #102018;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.hero-copy h1 {
  max-width: 800px;
  font-size: clamp(3rem, 7vw, 5.9rem);
}

.hero-description {
  max-width: 680px;
  margin: 1.25rem 0 0;
  color: #536357;
  font-size: 1.15rem;
  line-height: 1.75;
}

.hero-actions {
  margin-top: 1.5rem;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 2rem;
}

.hero-metrics article,
.hero-panel,
.lead-card,
.pricing-card,
.empty-state,
.error-banner,
.login-cta-section {
  border: 1px solid rgba(16, 32, 24, 0.08);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 24px 60px rgba(16, 32, 24, 0.08);
}

.hero-metrics article {
  display: grid;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: 1.2rem;
}

.hero-metrics strong {
  font-size: 1.45rem;
}

.hero-metrics span {
  color: #69766d;
  font-size: 0.92rem;
}

.hero-panel {
  border-radius: 1.8rem;
  padding: 1rem;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #536357;
  font-weight: 800;
  margin-bottom: 1rem;
}

.live-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: #1fbb5c;
  box-shadow: 0 0 0 6px rgba(31, 187, 92, 0.12);
}

.mini-leads {
  display: grid;
  gap: 0.75rem;
}

.mini-lead-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1.1rem;
  background: #f6f8f3;
}

.mini-lead-card div {
  display: grid;
  gap: 0.15rem;
}

.mini-lead-card span,
.mini-lead-card p {
  margin: 0;
  color: #69766d;
}

.mini-lead-card p {
  color: #1f6f3d;
  font-weight: 900;
}

.lead-preview-section,
.pricing-section {
  padding: 4rem 0;
}

.section-heading {
  max-width: 760px;
  margin-bottom: 1.5rem;
}

.section-heading h2,
.login-cta-section h2 {
  font-size: clamp(2.4rem, 5vw, 4.6rem);
}

.section-heading p:not(.eyebrow) {
  color: #69766d;
  font-size: 1.05rem;
  line-height: 1.65;
}

.lead-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.lead-card {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1.3rem;
}

.lead-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.lead-card h3 {
  margin: 0 0 0.2rem;
  font-size: 1.2rem;
}

.lead-card p {
  margin: 0;
  color: #69766d;
}

.quote-pill {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.7rem;
  border-radius: 999px;
  background: rgba(31, 111, 61, 0.1);
  color: #1f6f3d;
  font-weight: 900;
}

.lead-meta {
  display: grid;
  gap: 0.7rem;
  margin: 0;
}

.lead-meta div {
  display: grid;
  gap: 0.15rem;
}

.lead-meta dt {
  color: #7a877e;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lead-meta dd {
  margin: 0;
  color: #102018;
  font-weight: 700;
}

.details-button {
  width: 100%;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.pricing-card {
  display: grid;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 1.5rem;
}

.pricing-card.is-highlighted {
  border-color: rgba(31, 111, 61, 0.4);
  background: #102018;
  color: #fff;
}

.pricing-card.is-highlighted h3,
.pricing-card.is-highlighted .plan-name,
.pricing-card.is-highlighted .plan-description {
  color: #fff;
}

.plan-name {
  margin: 0 0 0.35rem;
  color: #1f6f3d;
  font-weight: 900;
}

.pricing-card h3 {
  margin: 0;
  color: #102018;
  font-size: 3rem;
  letter-spacing: -0.05em;
}

.pricing-card h3 span {
  font-size: 1rem;
  color: #69766d;
}

.plan-description {
  color: #69766d;
  line-height: 1.6;
}

.pricing-card ul {
  display: grid;
  gap: 0.8rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pricing-card li::before {
  content: '✓';
  margin-right: 0.5rem;
  color: #1fbb5c;
  font-weight: 900;
}

.login-cta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 4rem;
  padding: 1.5rem;
  border-radius: 1.6rem;
}

.error-banner,
.empty-state {
  padding: 1rem;
  border-radius: 1rem;
}

.error-banner {
  color: #9f1239;
  border-color: rgba(159, 18, 57, 0.18);
}

.loading-line {
  height: 0.9rem;
  border-radius: 999px;
  background: #dbe4d6;
}

.loading-line.large {
  width: 70%;
  height: 1.2rem;
}

.loading-line.short {
  width: 45%;
}

@media (max-width: 1020px) {

  .hero-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .lead-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {

  .top-nav,
  .nav-actions,
  .hero-actions,
  .login-cta-section {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-metrics,
  .lead-grid {
    grid-template-columns: 1fr;
  }
}

.lead-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.lead-status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.lead-status-badge.is-available {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.lead-status-badge.is-claimed {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.activity-note {
  font-size: 0.78rem;
  color: #64748b;
}
</style>
