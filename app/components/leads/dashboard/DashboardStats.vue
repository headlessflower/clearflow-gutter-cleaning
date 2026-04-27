<template>
  <div class="stats-grid">
    <article class="stat-card">
      <span>Available Leads</span>
      <strong>{{ availableLeads }}</strong>
    </article>

    <article class="stat-card">
      <span>Views Used</span>
      <strong>{{ viewsUsed }} / {{ viewLimitLabel }}</strong>
    </article>

    <article class="stat-card">
      <span>Claimed Leads</span>
      <strong>{{ contactedCount }}</strong>
    </article>

    <article class="stat-card">
      <span>Pipeline Value</span>
      <strong>{{ formattedPipeline }}</strong>
    </article>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  availableLeads: number
  viewsUsed: number
  viewLimit: number
  contactedCount: number
  pipelineValue: number
}>()

const viewLimitLabel = computed(() => {
  return props.viewLimit >= 999 ? 'Unlimited' : props.viewLimit
})

const formattedPipeline = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(props.pipelineValue)
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 20px;
  background: white;
}

.stat-card span {
  display: block;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 1.8rem;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 540px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
