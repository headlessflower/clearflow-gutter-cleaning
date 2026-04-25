<template>
  <section class="t">
    <div class="t__head">
      <p v-if="kicker" class="t__kicker">{{ kicker }}</p>
      <h2 class="t__title">{{ title }}</h2>
      <p v-if="subtitle" class="t__sub">{{ subtitle }}</p>
    </div>

    <div class="t__grid">
      <article v-for="(item, i) in items" :key="i" class="t__card">
        <div class="t__stars" aria-label="5 star rating">
          <span v-for="n in 5" :key="n" class="t__star">★</span>
        </div>

        <p class="t__quote">“{{ item.quote }}”</p>

        <div class="t__meta">
          <p class="t__name">{{ item.name }}</p>
          <p v-if="item.location" class="t__loc">{{ item.location }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
type Testimonial = {
  quote: string;
  name: string;
  location?: string;
};

const props = withDefaults(
    defineProps<{
      title?: string;
      subtitle?: string;
      kicker?: string;
      items: Testimonial[];
    }>(),
    {
      title: "Real Results. Clean Gutters. Happy Homeowners.",
      subtitle: "",
      kicker: "Trusted locally",
    }
);
</script>

<style scoped>
.t {
  padding: 3rem 0;
}
.t__head {
  margin: 0 auto;
  max-width: 56rem;
  padding: 0 1rem;
  text-align: left;
}
.t__kicker {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(180 83 9); /* amber-700 */
}
.t__title {
  margin-top: 0.5rem;
  font-size: 1.6rem;
  line-height: 1.15;
  font-weight: 900;
  color: rgb(15 23 42); /* slate-900 */
}
.t__sub {
  margin-top: 0.75rem;
  font-size: 1rem;
  color: rgb(71 85 105); /* slate-600 */
}
.t__grid {
  margin: 1.5rem auto 0;
  max-width: 72.5rem;
  padding: 0 1rem;
  display: grid;
  gap: 1rem;
}
.t__card {
  border-radius: 1.25rem;
  border: 1px solid rgb(226 232 240); /* slate-200 */
  background: rgb(248 250 252); /* slate-50 */
  padding: 1.25rem;
}
.t__stars {
  display: inline-flex;
  gap: 0.125rem;
  color: rgb(251 191 36); /* amber-400 */
  font-size: 0.95rem;
}
.t__star {
  line-height: 1;
}
.t__quote {
  margin-top: 0.75rem;
  color: rgb(30 41 59); /* slate-800 */
  font-size: 0.975rem;
  line-height: 1.55;
}
.t__meta {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.t__name {
  font-weight: 800;
  color: rgb(15 23 42); /* slate-900 */
}
.t__loc {
  font-size: 0.85rem;
  color: rgb(100 116 139); /* slate-500 */
}

@media (min-width: 48rem) {
  .t__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }
  .t__title {
    font-size: 2rem;
  }
}
</style>
