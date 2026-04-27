<script setup lang="ts">

definePageMeta({
  layout: 'leads'
})

import { ref } from 'vue'
import { useRouter, useSupabaseClient } from '#imports'

const router = useRouter()
const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    await router.push('/gutter-cleaning-leads/leads')
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not log in. Please check your email and password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <nav class="top-nav" aria-label="Lead marketplace navigation">
      <NuxtLink to="/gutter-cleaning-leads/" class="brand">ClearFlow Leads</NuxtLink>

      <div class="nav-actions">
        <NuxtLink to="/gutter-cleaning-leads/" class="nav-link">View Leads</NuxtLink>
        <NuxtLink to="/gutter-cleaning-leads/signup" class="nav-button">Sign Up</NuxtLink>
      </div>
    </nav>

    <section class="login-shell">
      <div class="login-copy">
        <p class="eyebrow">Contractor login</p>
        <h1>Access your gutter cleaning lead feed.</h1>
        <p>
          Log in to view customer quote details, contact information, requested service dates,
          and available local gutter cleaning jobs.
        </p>
      </div>

      <form class="login-card" @submit.prevent="handleLogin">
        <div class="form-heading">
          <p class="eyebrow">Welcome back</p>
          <h2>Log in</h2>
        </div>

        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" autocomplete="email" required />
        </label>

        <label class="field">
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button class="submit-button" type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>

        <div class="signup-callout">
          <p>Need contractor access?</p>
          <NuxtLink to="/gutter-cleaning-leads/signup">Create an account</NuxtLink>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  color: #102018;
  background:
    radial-gradient(circle at 15% 10%, rgba(80, 148, 94, 0.16), transparent 28%),
    linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
}

.top-nav,
.login-shell {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0 4rem;
}

.brand,
.nav-link,
.nav-button,
.signup-callout a {
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
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
  cursor: pointer;
}

.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 2rem;
  align-items: center;
  padding-bottom: 4rem;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: #1f6f3d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.login-copy h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(3rem, 7vw, 5.6rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.login-copy p:not(.eyebrow) {
  max-width: 630px;
  color: #536357;
  font-size: 1.1rem;
  line-height: 1.7;
}

.login-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(16, 32, 24, 0.08);
  border-radius: 1.6rem;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 60px rgba(16, 32, 24, 0.08);
}

.form-heading h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  letter-spacing: -0.05em;
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

.error-message {
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  color: #9f1239;
  background: rgba(159, 18, 57, 0.08);
  font-weight: 800;
}

.submit-button {
  width: 100%;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.signup-callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1.1rem;
  background: #f6f8f3;
}

.signup-callout p {
  margin: 0;
  color: #536357;
  font-weight: 800;
}

.signup-callout a {
  color: #1f6f3d;
  font-weight: 900;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {

  .top-nav,
  .nav-actions,
  .signup-callout {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
