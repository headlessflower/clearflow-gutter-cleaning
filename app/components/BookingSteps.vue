<template>
  <section class="s">
    <div class="s__inner">
      <header class="s__head">
        <p v-if="kicker" class="s__kicker">{{ kicker }}</p>
        <h2 class="s__title">{{ title }}</h2>
        <p v-if="subtitle" class="s__sub">{{ subtitle }}</p>
      </header>

      <div class="s__grid">
        <article v-for="(step, i) in stepsToShow" :key="i" class="s__card">
          <div class="s__num">{{ i + 1 }}</div>
          <h3 class="s__h">{{ step.title }}</h3>
          <p class="s__p">{{ step.body }}</p>
        </article>
      </div>

      <div v-if="ctaTo" class="s__cta">
        <NuxtLink :to="ctaTo" class="s__btn">
          {{ ctaLabel }}
        </NuxtLink>
        <p v-if="ctaNote" class="s__note">{{ ctaNote }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Step = { title: string; body: string };
type To = string | { path: string; query?: Record<string, any> };

const props = withDefaults(
    defineProps<{
      kicker?: string;
      title?: string;
      subtitle?: string;
      steps?: Step[];
      ctaTo?: To | null;
      ctaLabel?: string;
      ctaNote?: string;
    }>(),
    {
      kicker: "Simple process",
      title: "What Happens After You Book",
      subtitle: "Clear steps, quick confirmation, and a clean finish—no surprises.",
      steps: () => [
        {
          title: "Submit your details",
          body: "Choose your city, home type, and preferred date. You’ll get an instant quote before you finish.",
        },
        {
          title: "We confirm scheduling",
          body: "We’ll reach out to confirm access details and lock in your appointment time.",
        },
        {
          title: "We clean + haul debris away",
          body: "We remove gutter debris, clear downspouts as needed, and leave your property tidy.",
        },
      ],
      ctaTo: null,
      ctaLabel: "Get Instant Quote",
      ctaNote: "",
    }
);

const stepsToShow = computed(() => props.steps?.slice(0, 3) ?? []);
</script>

<style scoped>
.s {
  background: #fff;
  padding: 3rem 0;
}
.s__inner {
  max-width: 72.5rem;
  margin: 0 auto;
  padding: 0 1rem;
}
.s__head {
  max-width: 56rem;
}
.s__kicker {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(180 83 9); /* amber-700 */
}
.s__title {
  margin-top: 0.5rem;
  font-size: 1.6rem;
  line-height: 1.15;
  font-weight: 900;
  color: rgb(15 23 42); /* slate-900 */
}
.s__sub {
  margin-top: 0.75rem;
  color: rgb(71 85 105); /* slate-600 */
  font-size: 1rem;
}
.s__grid {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
}
.s__card {
  border-radius: 1.25rem;
  border: 1px solid rgb(226 232 240); /* slate-200 */
  background: rgb(248 250 252); /* slate-50 */
  padding: 1.25rem;
  position: relative;
}
.s__num {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: rgb(15 23 42); /* slate-900 */
  background: rgb(251 191 36); /* amber-400 */
}
.s__h {
  margin-top: 0.75rem;
  font-size: 1.05rem;
  font-weight: 900;
  color: rgb(15 23 42); /* slate-900 */
}
.s__p {
  margin-top: 0.5rem;
  color: rgb(30 41 59); /* slate-800 */
  line-height: 1.55;
}

.s__cta {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.s__btn {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  background: rgb(251 191 36); /* amber-400 */
  color: rgb(15 23 42); /* slate-900 */
  font-weight: 900;
  text-decoration: none;
}
.s__btn:hover {
  background: rgb(252 211 77); /* amber-300 */
}
.s__note {
  font-size: 0.9rem;
  color: rgb(100 116 139); /* slate-500 */
}

@media (min-width: 48rem) {
  .s__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }
  .s__title {
    font-size: 2rem;
  }
}
</style>
