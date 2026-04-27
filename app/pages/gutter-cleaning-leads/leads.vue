<script setup lang="ts">
definePageMeta({
  layout: 'leads'
})
import LeadFeed from '~/components/LeadFeed.vue'
</script>

<template>
  <main class="leads-page">


    <section class="page-shell">
      <LeadFeed />
    </section>
  </main>
</template>

<style scoped>
.leads-page {
  min-height: 100vh;
  padding-bottom: 4rem;
  color: #102018;
  background:
    radial-gradient(circle at 15% 10%, rgba(80, 148, 94, 0.16), transparent 28%),
    linear-gradient(135deg, #f6f8f3 0%, #e8efe3 100%);
}

.top-nav,
.page-shell {
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

.nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  padding: 0 1rem;
  border-radius: 999px;
  color: #fff;
  background: #1f6f3d;
  font-weight: 900;
  box-shadow: 0 14px 30px rgba(31, 111, 61, 0.2);
}

@media (max-width: 640px) {

  .top-nav,
  .nav-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
