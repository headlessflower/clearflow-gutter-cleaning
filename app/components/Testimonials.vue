<template>
  <section aria-labelledby="testimonials-heading" class="py-16 bg-white">
    <div class="container mx-auto px-6">
      <div class="mx-auto max-w-2xl text-center">
        <h2 id="testimonials-heading" class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          What Neighbors Are Saying
        </h2>
        <p class="mt-3 text-slate-600">Real feedback from homes across Los Angeles and San Bernardino Counties.</p>
      </div>

      <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(t, idx) in testimonials" :key="idx" class="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <figure>
            <blockquote class="text-slate-700">
              <p class="line-clamp-5">“{{ t.quote }}”</p>
            </blockquote>
            <figcaption class="mt-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-full bg-cyan-600 text-white font-bold shadow-sm">
                  {{ initials(t.name) }}
                </div>
                <div>
                  <p class="font-semibold text-slate-900">{{ t.name }}</p>
                  <p class="text-sm text-slate-500">{{ t.city }} • {{ t.county }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center justify-end" aria-label="Rating">
                  <span v-for="n in 5" :key="n" class="ml-1">
                    <svg v-if="n <= t.rating" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 fill-yellow-400" aria-hidden="true"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 fill-slate-200" aria-hidden="true"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28L5.5 10.5l4.38-.38L12 6.1l2.12 4.02 4.38.38-3.74 3.89 1 4.28z"/></svg>
                  </span>
                </div>
                <p class="mt-1 text-xs text-slate-500">{{ t.service }} • {{ t.date }}</p>
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>

      <div class="mt-12 text-center">
        <a href="/booking" class="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-6 py-3 text-white font-semibold shadow hover:bg-cyan-700">
          Book Your Cleaning
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import testimonials from "~~/data/testimonials";
// Helper to create initials from a name
const initials = (name: string) => name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
</script>

<style scoped>
/***** Optional line clamp for quotes *****/
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>



