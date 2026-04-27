<script setup lang="ts">
definePageMeta({
  layout: 'leads'
})
const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Perfect for solo contractors getting started with leads.',
    features: [
      '10 full lead views per month',
      'Full customer details (name, phone, email, address)',
      'Basic filters (city, date)',
      'Cancel anytime',
    ],
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'Best for contractors who want consistent lead volume.',
    features: [
      'Unlimited lead views',
      'Full customer details included',
      'Advanced filters (quote, service type)',
      'Priority access to newest leads',
    ],
    highlighted: true,
  },
]
</script>

<template>
  <main class="pricing-page">
    <nav class="top-nav">
      <NuxtLink to="/gutter-cleaning-leads/" class="brand">ClearFlow Leads</NuxtLink>

      <div class="nav-actions">
        <NuxtLink to="/gutter-cleaning-leads/login" class="nav-link">Login</NuxtLink>
        <NuxtLink to="/gutter-cleaning-leads/signup" class="nav-button">Sign Up</NuxtLink>
      </div>
    </nav>

    <section class="hero">
      <p class="eyebrow">Simple pricing</p>
      <h1>Get access to local gutter cleaning leads</h1>
      <p class="subtitle">
        No contracts. No complicated credits. Just real customer quote requests in your area.
      </p>
    </section>

    <section class="pricing-grid">
      <article v-for="plan in plans" :key="plan.name" class="pricing-card" :class="{ highlighted: plan.highlighted }">
        <div>
          <p class="plan-name">{{ plan.name }}</p>
          <h2>{{ plan.price }}<span>/mo</span></h2>
          <p class="plan-description">{{ plan.description }}</p>
        </div>

        <ul>
          <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
        </ul>

        <NuxtLink to="/gutter-cleaning-leads/signup" class="cta-button">
          Get Started
        </NuxtLink>
      </article>
    </section>

    <section class="login-cta">
      <h2>Already have an account?</h2>
      <NuxtLink to="/gutter-cleaning-leads/login" class="secondary-button">
        Log In
      </NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.pricing-page {
  min-height: 100vh;
  padding-bottom: 4rem;
  background: linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
  color: #102018;
}

.top-nav,
.hero,
.pricing-grid,
.login-cta {
  width: min(1100px, calc(100% - 2rem));
  margin: 0 auto;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0 3rem;
}

.brand {
  font-weight: 900;
  text-decoration: none;
  color: #102018;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  font-weight: 700;
  color: #3d5246;
}

.nav-button,
.cta-button {
  text-decoration: none;
  background: #1f6f3d;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  font-weight: 800;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.eyebrow {
  color: #1f6f3d;
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.hero h1 {
  font-size: 3rem;
  margin: 0.5rem 0;
}

.subtitle {
  color: #536357;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.pricing-card {
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.pricing-card.highlighted {
  background: #102018;
  color: white;
}

.plan-name {
  font-weight: 900;
  color: #1f6f3d;
}

.pricing-card.highlighted .plan-name {
  color: #7be495;
}

.pricing-card h2 {
  font-size: 2.5rem;
  margin: 0.5rem 0;
}

.pricing-card ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.pricing-card li::before {
  content: '✓';
  margin-right: 0.5rem;
  color: #1fbb5c;
}

.login-cta {
  margin-top: 3rem;
  text-align: center;
}

.secondary-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: white;
  border: 1px solid #1f6f3d;
  color: #1f6f3d;
  font-weight: 800;
  text-decoration: none;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
