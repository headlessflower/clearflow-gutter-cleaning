<template>
  <article class="card">
    <div class="card-header">
      <div>
        <h2>Recent Activity</h2>
        <p>Your latest lead updates.</p>
      </div>

      <NuxtLink to="/gutter-cleaning-leads/contacted">
        Contacted list
      </NuxtLink>
    </div>

    <div v-if="items.length" class="activity-list">
      <div v-for="item in items" :key="item.id" class="activity-row">
        <div>
          <strong>{{ formatLabel(item.label) }}</strong>
          <p>{{ item.description }}</p>
        </div>

        <time>{{ formatDate(item.date) }}</time>
      </div>
    </div>

    <p v-else class="empty">
      No lead activity yet. Start by viewing available leads.
    </p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    id: string
    label: string
    description: string
    date: string
  }>
}>()

function formatLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(value))
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

.activity-list {
  display: grid;
  gap: 12px;
}

.activity-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.activity-row p {
  margin-top: 4px;
}

time {
  color: #64748b;
  font-size: 0.9rem;
  white-space: nowrap;
}

.empty {
  padding: 18px;
  background: #f8fafc;
  border-radius: 14px;
}
</style>
