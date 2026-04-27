<template>
  <section class="dashboard-page">
    <div class="dashboard-header">
      <div>
        <p class="eyebrow">Contractor Dashboard</p>
        <h1>Lead Overview</h1>
        <p class="intro">
          Track available leads, monthly views, contacted jobs, and estimated pipeline value.
        </p>
        <p class="contractor-chip">
          Logged in as
          <strong>{{ contractorCompany || contractorContact || 'Contractor account' }}</strong>
        </p>
      </div>

      <NuxtLink to="/gutter-cleaning-leads/leads" class="primary-btn">
        View Leads
      </NuxtLink>
    </div>

    <DashboardStats :available-leads="availableLeads" :views-used="viewsUsed" :view-limit="viewLimit"
      :contacted-count="claimedCount" :pipeline-value="pipelineValue" />

    <div class="dashboard-grid">
      <UsageCard :views-used="viewsUsed" :view-limit="viewLimit" :plan="subscriptionTier" />

      <PriorityLeads :leads="priorityLeads" />

      <RecentActivity :items="recentActivity" />
    </div>
  </section>
</template>

<script setup lang="ts">
import DashboardStats from '~/components/leads/dashboard/DashboardStats.vue'
import UsageCard from '~/components/leads/dashboard/UsageCard.vue'
import PriorityLeads from '~/components/leads/dashboard/PriorityLeads.vue'
import RecentActivity from '~/components/leads/dashboard/RecentActivity.vue'

definePageMeta({
  layout: 'leads'
})

type Lead = {
  id: string
  customer_name: string
  city: string
  quote_total: number
  requested_service_day: string | null
}

type ActivityItem = {
  id: string
  label: string
  description: string
  date: string
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const subscriptionTier = ref<'starter' | 'pro'>('starter')
const subscriptionStatus = ref('active')
const viewLimit = ref(10)
const viewsUsed = ref(0)

const availableLeads = ref(0)
const claimedCount = ref(0)
const pipelineValue = ref(0)

const priorityLeads = ref<Lead[]>([])
const recentActivity = ref<ActivityItem[]>([])

const contractorCompany = ref('')
const contractorContact = ref('')

const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  await refreshDashboard()
})

async function refreshDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    const userId = await getCurrentUserId()
    if (!userId) return

    await Promise.all([
      loadProfile(userId),
      loadLeadStats(userId),
      loadPriorityLeads(),
      loadRecentActivity(userId)
    ])
  } catch (error: any) {
    console.error('Dashboard error:', error)
    errorMessage.value = error?.message || 'Could not load dashboard.'
  } finally {
    loading.value = false
  }
}

async function loadProfile(userId: string) {
  const { data, error } = await supabase
    .from('contractor_profiles')
    .select(`
      company_name,
      contact_name,
      subscription_tier,
      subscription_status,
      monthly_lead_view_limit
    `)
    .eq('id', userId)
    .single()

  if (error) throw error

  contractorCompany.value = data?.company_name || ''
  contractorContact.value = data?.contact_name || ''
  subscriptionTier.value = data?.subscription_tier === 'pro' ? 'pro' : 'starter'
  subscriptionStatus.value = data?.subscription_status || 'active'
  viewLimit.value = data?.monthly_lead_view_limit ?? 10
}

async function loadLeadStats(userId: string) {
  const monthStart = getMonthStartIso()

  const { count: leadCount, error: leadCountError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'lead')

  if (leadCountError) throw leadCountError

  availableLeads.value = leadCount ?? 0

  const { count: viewCount, error: viewCountError } = await supabase
    .from('lead_views')
    .select('*', { count: 'exact', head: true })
    .eq('contractor_id', userId)
    .gte('viewed_at', monthStart)

  if (viewCountError) throw viewCountError

  viewsUsed.value = viewCount ?? 0

  const { count: claimCount, error: claimCountError } = await supabase
    .from('lead_claims')
    .select('*', { count: 'exact', head: true })
    .eq('contractor_id', userId)
    .in('status', ['claimed', 'contacted', 'scheduled', 'completed'])

  if (claimCountError) throw claimCountError

  claimedCount.value = claimCount ?? 0

  const { data: claimedQuotes, error: claimedQuoteError } = await supabase
    .from('lead_claims')
    .select(`
    id,
    bookings (
      total_quote,
      discounted_total_quote
    )
  `)
    .eq('contractor_id', userId)
    .in('status', ['claimed', 'contacted', 'scheduled', 'completed'])

  if (claimedQuoteError) throw claimedQuoteError

  pipelineValue.value = claimedQuotes?.reduce((sum, claim: any) => {
    return sum + getQuoteTotal(claim.bookings || {})
  }, 0) ?? 0

  async function loadPriorityLeads(userId: string) {
    const { data, error } = await supabase
      .from('lead_claims')
      .select(`
      id,
      booking_id,
      status,
      claimed_at,
      bookings (
        id,
        name,
        city,
        preferred_date,
        total_quote,
        discounted_total_quote
      )
    `)
      .eq('contractor_id', userId)
      .in('status', ['claimed', 'contacted', 'scheduled'])
      .order('claimed_at', { ascending: false })
      .limit(10)

    if (error) throw error

    priorityLeads.value = (data ?? [])
      .map((claim: any) => {
        const booking = claim.bookings

        return {
          id: booking?.id || claim.booking_id,
          customer_name: booking?.name || 'New Customer',
          city: booking?.city || 'Los Angeles',
          quote_total: getQuoteTotal(booking || {}),
          requested_service_day: booking?.preferred_date || null,
        }
      })
      .sort((a, b) => b.quote_total - a.quote_total)
      .slice(0, 5)
  }

  async function loadRecentActivity(userId: string) {
    const { data, error } = await supabase
      .from('lead_claims')
      .select(`
      id,
      status,
      claimed_at,
      contacted_at,
      booking_id,
      bookings (
        name,
        city,
        total_quote,
        discounted_total_quote
      )
    `)
      .eq('contractor_id', userId)
      .in('status', ['claimed', 'contacted', 'scheduled', 'completed'])
      .order('claimed_at', { ascending: false })
      .limit(5)

    if (error) throw error

    recentActivity.value = data?.map((item: any) => ({
      id: item.id,
      label: item.status || 'claimed',
      description: item.bookings
        ? `${item.bookings.name || 'Customer'} in ${item.bookings.city || 'Los Angeles'} — ${formatMoney(getQuoteTotal(item.bookings))}`
        : 'Lead claimed',
      date: item.contacted_at || item.claimed_at
    })) ?? []
  }
  function getQuoteTotal(lead: {
    total_quote?: number | null
    discounted_total_quote?: number | null
  }) {
    return Number(lead.discounted_total_quote || lead.total_quote || 0)
  }

  function getMonthStartIso() {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  }

  function formatMoney(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value || 0)
  }
  async function getCurrentUserId() {
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error

    const userId = data.user?.id

    if (!userId) {
      await navigateTo('/gutter-cleaning-leads/login')
      return null
    }

    return userId
  }
</script>
<style scoped>
.dashboard-page {
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 8px;
}

h1 {
  font-size: clamp(2rem, 4vw, 3.25rem);
  margin: 0 0 12px;
}

.intro {
  max-width: 620px;
  color: #475569;
}

.primary-btn {
  background: #111827;
  color: white;
  padding: 10px 16px;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.dashboard-grid> :last-child {
  grid-column: span 2;
}

@media (max-width: 760px) {
  .dashboard-header {
    flex-direction: column;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid> :last-child {
    grid-column: span 1;
  }
}

.contractor-chip {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  margin-top: 1rem;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.95rem;
}

.contractor-chip strong {
  color: #111827;
}
</style>
