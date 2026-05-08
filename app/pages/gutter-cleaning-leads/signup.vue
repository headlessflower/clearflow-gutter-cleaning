<script setup lang="ts">
definePageMeta({
  layout: 'leads'
})
import { computed, ref } from 'vue'
import { useRouter, useSupabaseClient } from '#imports'

const router = useRouter()
const supabase = useSupabaseClient()

const TERMS_VERSION = 'v1'
const acceptedAt = new Date().toISOString()
const acceptedTerms = ref(false)
const showPassword = ref(false)

type PlanKey = 'starter' | 'pro'

type SignupForm = {
  company_name: string
  contact_name: string
  email: string
  phone: string
  password: string
  service_area: string
}

const selectedPlan = ref<PlanKey>('starter')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref<SignupForm>({
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  password: '',
  service_area: '',
})

const plans = [
  {
    key: 'starter' as const,
    name: 'Starter',
    price: '$49',
    description: 'Best for solo contractors who want a steady flow of local leads.',
    features: [
      '10 full lead views per month',
      'Full customer details after unlock',
      'Phone, email, city, zip, and  service notes',
      'Basic city and date filters',
    ],
  },
  {
    key: 'pro' as const,
    name: 'Pro',
    price: '$99',
    description: 'Best for companies that want unlimited access to the lead feed.',
    features: [
      'Unlimited full lead views',
      'Full customer details included',
      'Advanced filters and lead badges',
      'Priority access to newest leads',
    ],
  },
]

const selectedPlanDetails = computed(() => {
  return plans.find((plan) => plan.key === selectedPlan.value) || plans[0]
})

function splitServiceArea(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

async function ensureContractorProfile(userId: string, acceptedAt: string) {
  const { error } = await supabase
    .from('contractor_profiles')
    .upsert(
      {
        id: userId,
        company_name: form.value.company_name,
        contact_name: form.value.contact_name,
        phone: form.value.phone,
        service_area: splitServiceArea(form.value.service_area),
        subscription_tier: selectedPlan.value,
        subscription_status: 'active',
        monthly_lead_view_limit: selectedPlan.value === 'starter' ? 10 : 9999,
        monthly_lead_views_used: 0,
        accepted_terms: true,
        accepted_terms_at: acceptedAt,
        terms_version: TERMS_VERSION,
      },
      { onConflict: 'id' },
    )

  if (error) throw error
} async function handleSignup() {
  if (loading.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!acceptedTerms.value) {
    errorMessage.value = 'You must accept the Terms & Conditions'
    loading.value = false
    return
  }

  const acceptedAt = new Date().toISOString()

  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          company_name: form.value.company_name,
          contact_name: form.value.contact_name,
          phone: form.value.phone,
          service_area: form.value.service_area,
          selected_plan: selectedPlan.value,
          accepted_terms: true,
          accepted_terms_at: acceptedAt,
          terms_version: TERMS_VERSION,
        },
      },
    })

    if (error) throw error

    if (!data.user) {
      throw new Error('User not returned from signup.')
    }

    await ensureContractorProfile(data.user.id, acceptedAt)

    await router.push(`/gutter-cleaning-leads/checkout?plan=${selectedPlan.value}`)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not create account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="signup-page">


    <section class="signup-hero">
      <div class="hero-copy">
        <p class="eyebrow">Contractor signup</p>
        <h1>Start accessing local gutter cleaning leads.</h1>
        <p>
          Create your contractor account, choose a plan, and unlock full customer quote details after checkout.
        </p>
      </div>

      <aside class="summary-card">
        <span>Selected plan</span>
        <strong>{{ selectedPlanDetails.name }}</strong>
        <p>{{ selectedPlanDetails.price }}/month</p>
      </aside>
    </section>

    <section class="signup-grid">
      <form class="signup-form" @submit.prevent="handleSignup">
        <div class="form-heading">
          <p class="eyebrow">Account details</p>
          <h2>Create your account</h2>
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Company name</span>
            <input v-model="form.company_name" type="text" autocomplete="organization" required />
          </label>

          <label class="field">
            <span>Contact name</span>
            <input v-model="form.contact_name" type="text" autocomplete="name" required />
          </label>

          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" autocomplete="email" required />
          </label>

          <label class="field">
            <span>Phone</span>
            <input v-model="form.phone" type="tel" autocomplete="tel" required />
          </label>

          <label class="field field--full">
            <span>Password</span>

            <div class="password-field">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password"
                minlength="8" required />

              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </label>

          <label class="field field--full">
            <span>Service areas</span>
            <input v-model="form.service_area" type="text" placeholder="Pasadena, Arcadia, Monrovia, Los Angeles"
              required />
            <small>Separate cities with commas.</small>
          </label>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <button class="submit-button" type="submit" :disabled="loading">
          {{ loading ? 'Creating account...' : `Continue with ${selectedPlanDetails.name}` }}
        </button>

        <div class="terms-checkbox">
          <label>
            <input type="checkbox" v-model="acceptedTerms" />
            I agree to the
            <NuxtLink to="/gutter-cleaning-leads/terms">Terms & Conditions</NuxtLink>
            and
            <NuxtLink to="/gutter-cleaning-leads/privacy-policy">Privacy Policy</NuxtLink>
          </label>
        </div>
      </form>

      <aside class="plans-panel">
        <div class="form-heading">
          <p class="eyebrow">Choose your plan</p>
          <h2>Simple monthly access</h2>
        </div>

        <div class="plans-list">
          <button v-for="plan in plans" :key="plan.key" type="button" class="plan-card"
            :class="{ 'is-selected': selectedPlan === plan.key }" @click="selectedPlan = plan.key">
            <div class="plan-card__top">
              <div>
                <span class="plan-name">{{ plan.name }}</span>
                <strong>{{ plan.price }}<small>/mo</small></strong>
              </div>
              <span class="radio-dot" aria-hidden="true"></span>
            </div>

            <p>{{ plan.description }}</p>

            <ul>
              <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
            </ul>
          </button>
        </div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.signup-page {
  min-height: 100vh;
  padding-bottom: 4rem;
  color: #102018;
  background:
    radial-gradient(circle at 15% 10%, rgba(80, 148, 94, 0.16), transparent 28%),
    linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
}

.top-nav,
.signup-hero,
.signup-grid {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
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
.submit-button {
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
  text-decoration: none;
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
  cursor: pointer;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.signup-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 1.5rem;
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

.hero-copy h1 {
  max-width: 850px;
  margin: 0;
  font-size: clamp(3rem, 7vw, 5.6rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.hero-copy p:not(.eyebrow) {
  max-width: 650px;
  color: #536357;
  font-size: 1.1rem;
  line-height: 1.7;
}

.summary-card,
.signup-form,
.plans-panel {
  border: 1px solid rgba(16, 32, 24, 0.08);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 60px rgba(16, 32, 24, 0.08);
}

.summary-card {
  display: grid;
  gap: 0.25rem;
  padding: 1.2rem;
  border-radius: 1.4rem;
}

.summary-card span,
.summary-card p {
  color: #69766d;
}

.summary-card strong {
  font-size: 1.6rem;
}

.summary-card p {
  margin: 0;
  color: #1f6f3d;
  font-weight: 900;
}

.signup-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 1rem;
  align-items: start;
}

.signup-form,
.plans-panel {
  padding: 1.25rem;
  border-radius: 1.6rem;
}

.form-heading h2 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field--full {
  grid-column: 1 / -1;
}

.field span {
  color: #3d5246;
  font-size: 0.9rem;
  font-weight: 900;
}

.field input {
  width: 100%;
  min-height: 3.1rem;
  box-sizing: border-box;
  border: 1px solid rgba(16, 32, 24, 0.12);
  border-radius: 1rem;
  background: #fff;
  color: #102018;
  padding: 0 1rem;
  font: inherit;
}

.field small {
  color: #69766d;
}

.error-message,
.success-message {
  margin: 1rem 0 0;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  font-weight: 800;
}

.error-message {
  color: #9f1239;
  background: rgba(159, 18, 57, 0.08);
}

.success-message {
  color: #166534;
  background: rgba(22, 101, 52, 0.08);
}

.submit-button {
  width: 100%;
  margin-top: 1.25rem;
}

.plans-list {
  display: grid;
  gap: 1rem;
}

.plan-card {
  display: grid;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(16, 32, 24, 0.1);
  border-radius: 1.25rem;
  background: #f6f8f3;
  color: #102018;
  text-align: left;
  cursor: pointer;
}

.plan-card.is-selected {
  border-color: rgba(31, 111, 61, 0.55);
  background: #102018;
  color: #fff;
}

.plan-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.plan-name {
  display: block;
  color: #1f6f3d;
  font-weight: 900;
  margin-bottom: 0.25rem;
}

.plan-card.is-selected .plan-name {
  color: #7be495;
}

.plan-card strong {
  display: block;
  font-size: 2.2rem;
  letter-spacing: -0.05em;
}

.plan-card small {
  font-size: 0.9rem;
  color: #69766d;
}

.plan-card.is-selected small,
.plan-card.is-selected p {
  color: #c9d8ce;
}

.radio-dot {
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid rgba(31, 111, 61, 0.45);
  border-radius: 999px;
}

.plan-card.is-selected .radio-dot {
  border-color: #7be495;
  background: #7be495;
  box-shadow: inset 0 0 0 4px #102018;
}

.plan-card p {
  margin: 0;
  color: #69766d;
  line-height: 1.55;
}

.plan-card ul {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.plan-card li::before {
  content: '✓';
  margin-right: 0.45rem;
  color: #1fbb5c;
  font-weight: 900;
}

@media (max-width: 920px) {

  .signup-hero,
  .signup-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {

  .top-nav,
  .nav-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 5rem;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.65rem;
  transform: translateY(-50%);
  min-height: 2.1rem;
  border: 0;
  border-radius: 999px;
  padding: 0 0.8rem;
  background: #f6f8f3;
  color: #1f6f3d;
  font-weight: 900;
  cursor: pointer;
}

.terms-checkbox {
  margin-top: 1rem;
}

.terms-checkbox label {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  color: #102018;
  line-height: 1.45;
}

.terms-checkbox input {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.15rem;
  accent-color: #1f6f3d;
}

.terms-checkbox a {
  color: #1f6f3d;
  font-weight: 900;
}
</style>
