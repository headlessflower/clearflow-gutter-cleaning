<script setup lang="ts">
definePageMeta({
  layout: 'leads'
})
import { computed, onMounted, ref } from 'vue'
import { useRouter, useSupabaseClient, useSupabaseUser } from '#imports'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

type PlanKey = 'starter' | 'pro'

type ContractorProfile = {
  id: string
  company_name: string | null
  contact_name: string | null
  subscription_tier: PlanKey | string | null
  subscription_status: string | null
}

const selectedPlan = ref<PlanKey>('starter')
const profile = ref<ContractorProfile | null>(null)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

const plans = [
  {
    key: 'starter' as const,
    name: 'Starter',
    price: '$49',
    description: 'Full customer details for up to 10 leads per month.',
    features: [
      '10 full lead views per month',
      'Full name, phone, email, and address',
      'Basic city and date filters',
      'Good for solo contractors',
    ],
  },
  {
    key: 'pro' as const,
    name: 'Pro',
    price: '$99',
    description: 'Unlimited full lead access for growing gutter cleaning businesses.',
    features: [
      'Unlimited full lead views',
      'Full customer contact details',
      'Advanced quote and service filters',
      'Best for steady lead volume',
    ],
  },
]

const selectedPlanDetails = computed(() => {
  return plans.find((plan) => plan.key === selectedPlan.value) || plans[0]
})

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error

  const userId = data.user?.id

  if (!userId) {
    await router.push('/gutter-cleaning-leads/login?redirect=/gutter-cleaning-leads/reactivate')
    return null
  }

  return userId
}

async function fetchProfile() {
  const userId = await getCurrentUserId()
  if (!userId) return

  const { data, error } = await supabase
    .from('contractor_profiles')
    .select('id, company_name, contact_name, subscription_tier, subscription_status')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error

  profile.value = data as ContractorProfile | null

  if (!profile.value) {
    errorMessage.value = 'No contractor profile found for this account.'
    return
  }

  if (profile.value.subscription_tier === 'starter' || profile.value.subscription_tier === 'pro') {
    selectedPlan.value = profile.value.subscription_tier
  }
}

async function continueToCheckout() {
  const userId = await getCurrentUserId()
  if (!userId) return

  submitting.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase
      .from('contractor_profiles')
      .update({
        subscription_tier: selectedPlan.value,
        subscription_status: 'inactive',
        monthly_lead_view_limit: selectedPlan.value === 'starter' ? 10 : null,
        monthly_lead_views_used: 0,
      })
      .eq('id', userId)

    if (error) throw error

    await router.push(`/gutter-cleaning-leads/checkout?plan=${selectedPlan.value}&mode=reactivate`)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not update your plan. Please try again.'
  } finally {
    submitting.value = false
  }
}
onMounted(async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await fetchProfile()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load your contractor profile.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="reactivate-page">
    <nav class="top-nav" aria-label="Lead marketplace navigation">
      <NuxtLink to="/gutter-cleaning-leads/" class="brand">ClearFlow Leads</NuxtLink>

      <div class="nav-actions">
        <NuxtLink to="/gutter-cleaning-leads/leads" class="nav-link">Lead Feed</NuxtLink>
        <NuxtLink to="/gutter-cleaning-leads/login" class="nav-button">Login</NuxtLink>
      </div>
    </nav>

    <section class="hero">
      <div>
        <p class="eyebrow">Reactivate access</p>
        <h1>Choose a plan for your existing account.</h1>
        <p>
          Use this page if you already created a contractor account. You will not create a duplicate account or trigger
          another signup email.
        </p>
      </div>

      <aside class="account-card">
        <span>Signed in as</span>
        <strong>{{ profile?.company_name || profile?.contact_name || user?.email || 'Contractor' }}</strong>
        <p>Current status: {{ profile?.subscription_status || 'inactive' }}</p>
      </aside>
    </section>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <section v-if="loading" class="empty-card">
      <h2>Loading your account...</h2>
      <p>Checking your existing contractor profile.</p>
    </section>

    <section v-else class="reactivate-grid">
      <button v-for="plan in plans" :key="plan.key" type="button" class="plan-card"
        :class="{ selected: selectedPlan === plan.key }" @click="selectedPlan = plan.key">
        <div class="plan-top">
          <div>
            <p class="plan-name">{{ plan.name }}</p>
            <h2>{{ plan.price }}<span>/mo</span></h2>
          </div>
          <span class="radio-dot" aria-hidden="true"></span>
        </div>

        <p class="plan-description">{{ plan.description }}</p>

        <ul>
          <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
        </ul>
      </button>
    </section>

    <section v-if="!loading" class="checkout-card">
      <div>
        <p class="eyebrow">Selected plan</p>
        <h2>{{ selectedPlanDetails.name }} — {{ selectedPlanDetails.price }}/month</h2>
        <p>Continue to checkout to reactivate access for your existing contractor account.</p>
      </div>

      <button type="button" class="primary-button" :disabled="submitting" @click="continueToCheckout">
        {{ submitting ? 'Preparing checkout...' : 'Continue to Checkout' }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.reactivate-page {
  min-height: 100vh;
  padding-bottom: 4rem;
  color: #102018;
  background:
    radial-gradient(circle at 15% 10%, rgba(80, 148, 94, 0.16), transparent 28%),
    linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
}

.top-nav,
.hero,
.reactivate-grid,
.checkout-card,
.empty-card,
.error-message {
  width: min(1100px, calc(100% - 2rem));
  margin-left: auto;
  margin-right: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0 3rem;
}

.brand,
.nav-link,
.nav-button {
  text-decoration: none;
}

.brand {
  color: #102018;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.nav-link {
  color: #3d5246;
  font-weight: 800;
}

.nav-button,
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0 1rem;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: #1f6f3d;
  font-weight: 900;
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
  cursor: pointer;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
  align-items: end;
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

.hero h1 {
  max-width: 820px;
  margin: 0;
  font-size: clamp(3rem, 7vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.hero p:not(.eyebrow) {
  max-width: 680px;
  color: #536357;
  line-height: 1.7;
}

.account-card,
.plan-card,
.checkout-card,
.empty-card,
.error-message {
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
  font-size: 1.25rem;
}

.error-message {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1.1rem;
  color: #9f1239;
  background: rgba(159, 18, 57, 0.08);
  font-weight: 800;
}

.empty-card {
  padding: 1.25rem;
  border-radius: 1.3rem;
}

.reactivate-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.plan-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.5rem;
  color: #102018;
  text-align: left;
  cursor: pointer;
}

.plan-card.selected {
  background: #102018;
  color: #fff;
  border-color: rgba(31, 111, 61, 0.45);
}

.plan-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.plan-name {
  margin: 0 0 0.4rem;
  color: #1f6f3d;
  font-weight: 900;
}

.plan-card.selected .plan-name {
  color: #7be495;
}

.plan-card h2 {
  margin: 0;
  font-size: 3rem;
  letter-spacing: -0.05em;
}

.plan-card h2 span {
  font-size: 1rem;
  color: #69766d;
}

.plan-card.selected h2 span,
.plan-card.selected .plan-description {
  color: #c9d8ce;
}

.plan-description {
  margin: 0;
  color: #536357;
  line-height: 1.6;
}

.radio-dot {
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid rgba(31, 111, 61, 0.45);
  border-radius: 999px;
}

.plan-card.selected .radio-dot {
  border-color: #7be495;
  background: #7be495;
  box-shadow: inset 0 0 0 4px #102018;
}

.plan-card ul {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.plan-card li::before {
  content: '✓';
  margin-right: 0.5rem;
  color: #1fbb5c;
  font-weight: 900;
}

.checkout-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1.25rem;
  border-radius: 1.4rem;
}

.checkout-card h2,
.checkout-card p {
  margin: 0;
}

.checkout-card p:not(.eyebrow) {
  color: #536357;
  margin-top: 0.35rem;
}

@media (max-width: 860px) {

  .hero,
  .reactivate-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {

  .top-nav,
  .nav-actions,
  .checkout-card {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
