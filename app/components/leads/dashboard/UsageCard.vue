<template>
  <article class="card">
    <div class="card-header">
      <div>
        <h2>Monthly Views</h2>
        <p>{{ planLabel }} plan usage</p>
      </div>
      <span class="badge">{{ planLabel }}</span>
    </div>

    <div class="usage-row">
      <strong>{{ viewsUsed }}</strong>
      <span>/ {{ limitLabel }}</span>
    </div>

    <div class="progress">
      <div class="progress-fill" :style="{ width: `${progress}%` }" />
    </div>

    <p v-if="plan === 'starter'" class="upgrade-copy">
      Starter includes {{ viewLimit }} full lead views per month.
    </p>

    <NuxtLink v-if="plan === 'starter'" to="/gutter-cleaning-leads/pricing" class="upgrade-link">
      Upgrade to Pro
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  viewsUsed: number
  viewLimit: number
  plan: 'starter' | 'pro'
}>()

const planLabel = computed(() => {
  return props.plan === 'pro' ? 'Pro' : 'Starter'
})

const limitLabel = computed(() => {
  return props.plan === 'pro' ? 'Unlimited' : props.viewLimit
})

const progress = computed(() => {
  if (props.plan === 'pro') return 100
  return Math.min((props.viewsUsed / props.viewLimit) * 100, 100)
})
</script>

<style scoped>
.card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px;
  background: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

h2 {
  margin: 0 0 4px;
}

p {
  color: #64748b;
  margin: 0;
}

.badge {
  background: #f1f5f9;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.85rem;
}

.usage-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.usage-row strong {
  font-size: 2.25rem;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: #111827;
}

.upgrade-copy {
  margin-bottom: 16px;
}

.upgrade-link {
  display: inline-flex;
  background: #111827;
  color: white;
  padding: 9px 14px;
  border-radius: 999px;
  text-decoration: none;
}
</style>
