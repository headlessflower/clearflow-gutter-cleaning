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

const workflowSteps = [
  {
    title: 'Browse available leads',
    description: 'Preview recent gutter cleaning requests, including city, service timing, and estimated quote totals.',
  },
  {
    title: 'Unlock lead details',
    description: 'Use your monthly views to access customer contact information and full job details.',
  },
  {
    title: 'Claim the lead',
    description: 'Reserve the lead so you can follow up quickly and keep it out of the public pool.',
  },
  {
    title: 'Close more local jobs',
    description: 'Turn active homeowner requests into booked gutter cleaning work for your business.',
  },
]

const citiesServed = [
  'Los Angeles',
  'Pasadena',
  'Glendale',
  'Burbank',
  'Arcadia',
  'Monrovia',
  'Sierra Madre',
  'South Pasadena',
  'La Cañada Flintridge',
  'Altadena',
  'San Marino',
  'Temple City',

  'Alhambra',
  'Azusa',
  'Baldwin Park',
  'Bellflower',
  'Beverly Hills',
  'Calabasas',
  'Covina',
  'Culver City',
  'Diamond Bar',
  'Downey',
  'Duarte',
  'El Monte',
  'Glendora',
  'La Puente',
  'La Verne',
  'Monterey Park',
  'Montebello',
  'Pomona',
  'Rosemead',
  'San Dimas',
  'San Gabriel',
  'Santa Monica',
  'Walnut',
  'West Covina',
  'Whittier',
]

const starterViewLimit = 10

const starterPotentialSales = computed(() => {
  if (!averageQuote.value) return 0
  return averageQuote.value * starterViewLimit
})

const totalLeadValue = computed(() => {
  return leads.value.reduce((sum, lead) => {
    return sum + Number(getQuoteTotal(lead) || 0)
  }, 0)
})



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
    .limit(19)

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
          <h1> Local gutter cleaning jobs for contractors</h1>
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
              <strong>350+</strong>
              <span>active leads available</span>
            </article>
            <article>
              <strong>{{ formatCurrency(averageQuote) }}</strong>
              <span>average quote preview</span>
            </article>
            <article>
              <strong>LA - San Bernardino</strong>
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
    <section class="sales-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Why contractors use it</p>
          <h2>Built for local gutter businesses that want faster access to jobs</h2>
        </div>
      </div>

      <div class="sales-grid">
        <article class="sales-card">
          <h3>Real homeowner demand</h3>
          <p>
            These are homeowner requests from people actively looking for gutter cleaning
            and related exterior maintenance services.
          </p>
        </article>

        <article class="sales-card">
          <h3>Lower cost than paid ads</h3>
          <p>
            Instead of spending hundreds testing ad campaigns, start with a lower monthly
            cost and access warm local opportunities.
          </p>
        </article>

        <article class="sales-card">
          <h3>Claim leads before others do</h3>
          <p>
            Once you find a strong opportunity, claim it and move quickly while the lead
            is still fresh.
          </p>
        </article>
      </div>
    </section>

    <section class="preview-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Live preview</p>
          <h2>Recent gutter cleaning leads</h2>
          <p>
            Homeowners are looking for gutter cleaning right now.
          </p>
        </div>

        <div class="preview-metrics">
          <span>{{ visibleLeadCount }} leads shown</span>
          <span v-if="averageQuote">{{ formatCurrency(averageQuote) }} avg. quote</span>
          <span>{{ formatCurrency(totalLeadValue) }} total lead value</span>
        </div>
      </div>

      <div class="lead-preview-grid">
        <article v-for="lead in leads" :key="lead.id" class="lead-card">
          <div class="lead-card-header">
            <span class="lead-status-badge" :class="lead.is_claimed ? 'is-claimed' : 'is-available'">
              {{ lead.is_claimed ? 'Claimed' : 'Available' }}
            </span>

            <span v-if="lead.is_claimed" class="activity-note">
              Recently claimed
            </span>
          </div>

          <div class="lead-card-body">
            <div class="lead-card-main">
              <h3>{{ getTeaserName(lead.name) }}</h3>
              <p class="lead-card-city">
                {{ lead.city || 'Los Angeles area' }}
              </p>
            </div>

            <div class="lead-card-meta">
              <div class="lead-meta-row">
                <span class="lead-meta-label">Service</span>
                <span class="lead-meta-value">
                  {{ formatServiceType(lead.service_type) }}
                </span>
              </div>

              <div class="lead-meta-row">
                <span class="lead-meta-label">Requested</span>
                <span class="lead-meta-value">
                  {{ formatDate(lead.preferred_date) }}
                </span>
              </div>
            </div>
          </div>

          <div class="lead-card-footer">
            <div class="lead-value-stack">
              <span class="lead-value-label">Estimated quote</span>
              <span class="lead-card-quote">
                {{ formatCurrency(getQuoteTotal(lead)) }}
              </span>
            </div>
          </div>
        </article>

        <article class="lead-card lead-card--cta">
          <div>
            <p class="eyebrow">Want more?</p>
            <h3>See the full lead feed</h3>
            <p>
              Create your contractor account to unlock more leads, full customer details,
              and lead claiming.
            </p>
          </div>

          <div class="lead-card-cta-actions">
            <NuxtLink to="/gutter-cleaning-leads/signup" class="primary-btn">
              Get started
            </NuxtLink>

            <NuxtLink to="/gutter-cleaning-leads/leads" class="secondary-btn">
              View more leads
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
    <section class="workflow-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">How it works</p>
          <h2>A simple local lead workflow</h2>
          <p>
            ClearFlow Leads is built to help gutter contractors move from lead discovery
            to customer contact quickly.
          </p>
        </div>
      </div>

      <div class="workflow-grid">
        <article v-for="(step, index) in workflowSteps" :key="step.title" class="workflow-card">
          <span class="workflow-step-number">0{{ index + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
    </section>
    <section class="cities-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Coverage</p>
          <h2>Cities we serve</h2>
          <p>
            We focus on homeowner service requests in Los Angeles County and nearby areas.
          </p>
        </div>
      </div>

      <div class="cities-grid">
        <span v-for="city in citiesServed" :key="city" class="city-pill">
          {{ city }}
        </span>
      </div>
    </section>
    <section class="value-section">
      <div class="value-card">
        <div>
          <p class="eyebrow">Starter plan value</p>
          <h2>$49 can open the door to real local revenue</h2>
          <p>
            With the Starter plan, you get access to up to {{ starterViewLimit }} lead views per month.
            Based on the current average quote in the feed, that represents a potential
            <strong>{{ formatCurrency(starterPotentialSales) }}</strong> in quoted job opportunities.
          </p>

          <p class="value-note">
            That’s a small monthly cost for access to homeowner requests already looking for gutter service.
          </p>
        </div>

        <div class="value-metrics">
          <div class="value-metric">
            <span>Starter price</span>
            <strong>$49/mo</strong>
          </div>

          <div class="value-metric">
            <span>Avg. quote</span>
            <strong>{{ averageQuote ? formatCurrency(averageQuote) : '—' }}</strong>
          </div>

          <div class="value-metric">
            <span>Preview feed value</span>
            <strong>{{ formatCurrency(totalLeadValue) }}</strong>
          </div>
        </div>
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

/* Shared layout widths */
.top-nav,
.hero-grid,
.lead-preview-section,
.pricing-section,
.login-cta-section,
.workflow-section,
.cities-section,
.value-section,
.sales-section {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

/* Hero */
.hero-section {
  padding: 1rem 0 4rem;
  background:
    radial-gradient(circle at 15% 15%, rgba(80, 148, 94, 0.18), transparent 30%),
    linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
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
.plan-button,
.primary-btn,
.secondary-btn {
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
.plan-button,
.primary-btn {
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
.details-button,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0 1rem;
  border-radius: 999px;
  color: #13231a;
  background: #eaf0e8;
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
.login-cta-section,
.workflow-card,
.sales-card,
.value-card {
  border: 1px solid rgba(16, 32, 24, 0.08);
  background: rgba(255, 255, 255, 0.86);
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

/* Sections */
.lead-preview-section,
.pricing-section,
.workflow-section,
.cities-section,
.value-section,
.sales-section {
  padding: 4rem 0;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) auto;
  gap: 1.5rem 2rem;
  align-items: end;
  margin-bottom: 2rem;
}

.section-heading h2 {
  max-width: 8ch;
  font-size: clamp(3rem, 6vw, 5.8rem);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.section-heading p:not(.eyebrow) {
  max-width: 36rem;
  margin: 0.85rem 0 0;
  color: #5b685f;
  font-size: 1.3rem;
  line-height: 1.45;
}

.preview-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  padding-bottom: 0.5rem;
}

.preview-metrics span {
  display: inline-flex;
  align-items: center;
  min-height: 2.7rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: #f3f5f0;
  color: #4a5563;
  font-size: 1rem;
  font-weight: 800;
}

/* Lead preview cards */
.lead-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.15rem;
}

.lead-card {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 1.2rem 1.15rem 1.1rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 14px 32px rgba(16, 32, 24, 0.05);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.lead-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 18px 38px rgba(16, 32, 24, 0.08);
}

.lead-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.35rem;
}

.lead-status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 800;
}

.lead-status-badge.is-available {
  color: #166534;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.28);
}

.lead-status-badge.is-claimed {
  color: #c2410c;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.28);
}

.activity-note {
  color: #7a8796;
  font-size: 0.85rem;
  font-weight: 700;
}

.lead-card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.lead-card-main {
  margin-bottom: 1.15rem;
}

.lead-card h3 {
  margin: 0;
  color: #13231a;
  font-size: 1.05rem;
  line-height: 1.2;
  font-weight: 800;
}

.lead-card p {
  margin: 0;
  color: #69766d;
}

.lead-card-city {
  margin: 0.65rem 0 0;
  color: #5a675e;
  font-size: 1.05rem;
}

.lead-card-meta {
  display: grid;
  gap: 0.85rem;
  margin-top: auto;
}

.lead-meta-row {
  display: grid;
  gap: 0.2rem;
}

.lead-meta-label,
.lead-value-label,
.lead-meta dt {
  color: #93a098;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lead-meta-value,
.lead-meta dd {
  color: #5f6d64;
  font-size: 1rem;
  line-height: 1.35;
}

.lead-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(16, 32, 24, 0.07);
}

.lead-value-stack {
  display: grid;
  gap: 0.3rem;
}

.lead-card-quote {
  color: #102018;
  font-size: 1.9rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
}

/* CTA card at end of preview feed */
.lead-card--cta {
  justify-content: space-between;
  background: linear-gradient(180deg, #f7f9f4 0%, #eef3ec 100%);
}

.lead-card--cta h3 {
  margin: 0.35rem 0 0.85rem;
  color: #102018;
  font-size: 1.55rem;
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.lead-card--cta p {
  margin: 0;
  color: #5b685f;
  line-height: 1.55;
}

.lead-card-cta-actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

/* Workflow / sales / cities */
.workflow-grid,
.sales-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.workflow-card,
.sales-card {
  border-radius: 1.25rem;
  padding: 1.2rem;
  background: #fff;
}

.workflow-card h3,
.sales-card h3 {
  margin: 0 0 0.6rem;
  color: #102018;
}

.workflow-card p,
.sales-card p {
  margin: 0;
  color: #536357;
  line-height: 1.6;
}

.workflow-step-number {
  display: inline-flex;
  margin-bottom: 0.8rem;
  color: #1f6f3d;
  font-size: 0.85rem;
  font-weight: 900;
}

.cities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.city-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.4rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  font-weight: 700;
}

/* Value section */
.value-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.8fr);
  gap: 1.5rem;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, #ffffff 0%, #f6f8f3 100%);
}

.value-note {
  margin-top: 1rem;
  color: #536357;
}

.value-metrics {
  display: grid;
  gap: 1rem;
}

.value-metric {
  border-radius: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid rgba(16, 32, 24, 0.06);
}

.value-metric span {
  display: block;
  margin-bottom: 0.35rem;
  color: #69766d;
}

.value-metric strong {
  color: #102018;
  font-size: 1.5rem;
}

/* Pricing */
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
  color: #69766d;
  font-size: 1rem;
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

/* Final CTA */
.login-cta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 4rem;
  padding: 1.5rem;
  border-radius: 1.6rem;
}

.login-cta-section h2 {
  font-size: clamp(2.4rem, 5vw, 4.6rem);
}

.login-cta-section p {
  color: #536357;
}

/* Loading / empty / errors */
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

/* Responsive */
@media (max-width: 1300px) {
  .lead-preview-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {

  .hero-grid,
  .pricing-grid,
  .value-card {
    grid-template-columns: 1fr;
  }

  .workflow-grid,
  .sales-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .section-heading {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .section-heading h2 {
    max-width: none;
  }

  .preview-metrics {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .lead-preview-grid {
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
  .lead-preview-grid,
  .workflow-grid,
  .sales-grid {
    grid-template-columns: 1fr;
  }

  .lead-card {
    min-height: auto;
  }
}
</style>
