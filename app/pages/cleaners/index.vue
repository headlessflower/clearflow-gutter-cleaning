<template>
  <main class="min-h-screen bg-[#f7f5ef] text-stone-950">
    <section class="border-b border-stone-200 bg-white">
      <div class="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
          Partnered Cleaner Index
        </p>
        <h1 class="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Gutter cleaners for {{ locationLabel }}
        </h1>
        <p class="mt-4 max-w-3xl text-lg leading-8 text-stone-700">
          Results are ranked by ZIP coverage, city fit, requested services, verification, response speed, and rating quality.
        </p>

        <form class="mt-7 grid gap-3 rounded-lg border border-stone-300 bg-[#f7f5ef] p-3 shadow-sm sm:max-w-2xl sm:grid-cols-[1fr_auto]" @submit.prevent="search">
          <label class="sr-only" for="location">ZIP code or city</label>
          <input
            id="location"
            v-model="locationInput"
            class="min-h-12 rounded-md border border-stone-200 px-4 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Enter ZIP or city in LA County"
            type="text"
          />
          <button class="min-h-12 rounded-md bg-teal-700 px-5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-teal-800" type="submit">
            Search
          </button>
        </form>
      </div>
    </section>

    <section class="py-10">
      <div class="mx-auto grid max-w-7xl gap-5 px-5 md:px-8 lg:grid-cols-[1fr_320px]">
        <div class="space-y-5">
          <article v-for="result in cleaners" :key="result.cleaner.id" class="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <NuxtLink
                    class="text-2xl font-black transition hover:text-teal-800"
                    :to="`/cleaners/${result.cleaner.slug}`"
                  >
                    {{ result.cleaner.companyName }}
                  </NuxtLink>
                  <span v-if="result.cleaner.plan === 'featured'" class="rounded-md bg-teal-100 px-2 py-1 text-xs font-black uppercase tracking-wide text-teal-800">
                    Featured
                  </span>
                </div>
                <p class="mt-2 leading-7 text-stone-700">{{ result.cleaner.headline }}</p>
              </div>
              <div class="rounded-md bg-amber-100 px-3 py-2 text-left md:text-right">
                <p class="text-lg font-black">{{ getDisplayRating(result.cleaner) }}</p>
                <p class="text-xs font-bold uppercase tracking-wide text-stone-600">Directory rating</p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="reason in result.matchReasons" :key="reason" class="rounded-md bg-stone-100 px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-stone-600">
                {{ reason }}
              </span>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-4">
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Service Areas</p>
                <p class="mt-2 text-sm leading-6 text-stone-700">{{ result.cleaner.serviceAreas.join(", ") }}</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Services</p>
                <p class="mt-2 text-sm leading-6 text-stone-700">{{ result.cleaner.services.map((service) => serviceLabels[service]).join(", ") }}</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Response</p>
                <p class="mt-2 text-sm leading-6 text-stone-700">{{ responseLabel(result.cleaner.responseTimeMinutes) }}</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Starting Price</p>
                <p class="mt-2 text-sm leading-6 text-stone-700">${{ result.cleaner.minimumJobPrice }}+</p>
              </div>
            </div>

            <div class="mt-5 grid gap-3 rounded-md bg-[#f7f5ef] p-4 sm:grid-cols-3">
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Review Signal</p>
                <p class="mt-1 text-sm font-bold">{{ result.cleaner.rating.reviewAverage.toFixed(1) }} from {{ result.cleaner.rating.reviewCount }} reviews</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Quality Score</p>
                <p class="mt-1 text-sm font-bold">{{ result.cleaner.rating.qualityScore }}/100</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-stone-500">Reliability Score</p>
                <p class="mt-1 text-sm font-bold">{{ result.cleaner.rating.reliabilityScore }}/100</p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-3">
              <NuxtLink
                class="inline-flex items-center justify-center rounded-md bg-stone-950 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-stone-800"
                :to="`/cleaners/${result.cleaner.slug}`"
              >
                View Profile
              </NuxtLink>
              <a
                v-if="result.cleaner.phone"
                class="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-teal-800"
                :href="`tel:${result.cleaner.phone}`"
              >
                Call Cleaner
              </a>
              <a
                v-if="result.cleaner.email"
                class="inline-flex items-center justify-center rounded-md border border-stone-300 px-4 py-3 text-sm font-black uppercase tracking-wide text-stone-900 transition hover:border-teal-700 hover:text-teal-800"
                :href="introHref(result.cleaner)"
              >
                Request Intro
              </a>
            </div>
          </article>

          <div v-if="!cleaners.length" class="rounded-lg border border-stone-300 bg-white p-6">
            <h2 class="text-2xl font-black">No exact cleaner match yet</h2>
            <p class="mt-3 leading-7 text-stone-700">
              Try a nearby city or ZIP code. The partner index can expand as more cleaners are added by service area.
            </p>
          </div>
        </div>

        <aside class="h-fit rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
          <h2 class="text-xl font-black">How this index works</h2>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            <li>Search matches exact ZIPs first, then city and nearby ZIP prefixes.</li>
            <li>Directory rating blends reviews, response speed, quality, reliability, and verification.</li>
            <li>Signed-up lead contractors can map into this same profile shape later.</li>
          </ul>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  findPartnerCleaners,
  getDisplayRating,
  serviceLabels,
  type CleanerProfile,
} from "~~/data/partnerCleaners";

const route = useRoute();
const locationInput = ref("");

const location = computed(() => {
  return String(route.query.zip || route.query.city || route.query.location || "").trim();
});

const locationLabel = computed(() => location.value || "Los Angeles County");
const cleaners = computed(() => findPartnerCleaners(location.value));

watch(
  location,
  (value) => {
    locationInput.value = value;
  },
  { immediate: true },
);

function search() {
  const query = locationInput.value.trim();
  if (!query) {
    navigateTo("/cleaners");
    return;
  }

  const queryParam = /^\d{5}$/.test(query) ? "zip" : "city";
  navigateTo(`/cleaners?${queryParam}=${encodeURIComponent(query)}`);
}

function responseLabel(minutes: number) {
  if (minutes <= 90) return "Usually responds within 90 minutes";
  if (minutes < 240) return "Usually responds within a few hours";
  if (minutes <= 480) return "Usually responds same day";
  return "Usually responds within 1 business day";
}

function introHref(cleaner: CleanerProfile) {
  const subject = encodeURIComponent(`Gutter cleaner intro request: ${cleaner.companyName}`);
  const body = encodeURIComponent(`Hi, I'd like to contact ${cleaner.companyName} for gutter cleaning in ${locationLabel.value}.`);
  return `mailto:${cleaner.email}?subject=${subject}&body=${body}`;
}

useHead({
  title: computed(() => `Partnered Gutter Cleaners for ${locationLabel.value} | ClearFlow Directory`),
  meta: [
    {
      name: "description",
      content:
        "Search ClearFlow's partnered gutter cleaner index by city or ZIP code and contact relevant cleaners directly.",
    },
  ],
});
</script>
