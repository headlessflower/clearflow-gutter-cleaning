<template>
  <article class="card">
    <div class="card-header">
      <div>
        <h2>Priority Leads</h2>
        <p>Highest-value opportunities first.</p>
      </div>

      <NuxtLink to="/gutter-cleaning-leads/leads">
        View all
      </NuxtLink>
    </div>

    <div v-if="leads.length" class="lead-list">
      <NuxtLink v-for="lead in leads" :key="lead.id" :to="`/gutter-cleaning-leads/leads/${lead.id}`" class="lead-row">
        <div>
          <strong>{{ lead.customer_name }}</strong>
          <span>{{ lead.city }}</span>
        </div>

        <div class="right">
          <strong>{{ formatMoney(lead.quote_total) }}</strong>
          <span>{{ lead.requested_service_day || 'Flexible' }}</span>
        </div>
      </NuxtLink>
    </div>

    <p v-else class="empty">No priority leads yet.</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  leads: Array<{
    id: string
    customer_name: string
    city: string
    quote_total: number
    requested_service_day: string | null
  }>
}>()

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0)
}
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
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 4px;
}

p {
  color: #64748b;
  margin: 0;
}

.lead-list {
  display: grid;
  gap: 12px;
}

.lead-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
}

.lead-row:hover {
  background: #f8fafc;
}

.lead-row span {
  display: block;
  color: #64748b;
  font-size: 0.9rem;
}

.right {
  text-align: right;
}

.empty {
  padding: 18px;
  background: #f8fafc;
  border-radius: 14px;
}
</style>
