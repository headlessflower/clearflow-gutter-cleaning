<template>
  <div class="cta" aria-label="Quick actions">
    <div class="cta__inner">
      <NuxtLink :to="to" class="cta__btn cta__btn--primary">
        Get Instant Quote<span v-if="cityName" class="cta__city"> · {{ cityName }}</span>
      </NuxtLink>

      <a :href="telHref" class="cta__btn cta__btn--secondary">
        Call
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
type To = string | { path: string; query?: Record<string, any> };

const props = defineProps<{ to: To; phone: string; cityName?: string }>();

const telHref = computed(() => {
  const p = String(props.phone || "").trim();
  return p.startsWith("tel:") ? p : `tel:${p}`;
});
</script>

<style scoped>
/* Mobile-first sticky bar */
.cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;

  padding: 0.75rem;

  background: linear-gradient(to top, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0));
  pointer-events: none;
}

.cta__inner {
  pointer-events: auto;
  margin-inline: auto;
  max-width: 72.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.625rem;
}

.cta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.85rem 1rem;
  border-radius: 999px;

  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1;
  text-decoration: none;

  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.cta__btn--primary {
  background: #fbbf24; /* amber-400 */
  color: #0f172a; /* slate-900 */
}

.cta__btn--primary:hover {
  background: #fcd34d; /* amber-300 */
}

.cta__btn--secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.55);
  color: #fff;
}

.cta__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}

.cta__city {
  font-weight: 600;
  opacity: 0.9;
}

/* Hide on desktop (desktop CTAs already exist in hero) */
@media (min-width: 64rem) {
  .cta {
    display: none;
  }
}
</style>
