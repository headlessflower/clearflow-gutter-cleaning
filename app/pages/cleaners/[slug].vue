<template>
  <main v-if="cleaner" class="min-h-screen bg-[#f7f5ef] text-stone-950">
    <section class="border-b border-stone-200 bg-white">
      <div class="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <NuxtLink class="text-sm font-black uppercase tracking-wide text-teal-800 transition hover:text-teal-950" to="/cleaners">
          Back to cleaner search
        </NuxtLink>

        <div class="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <p class="rounded-md bg-teal-100 px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-teal-800">
                {{ cleaner.plan === "featured" ? "Featured Partner" : "Partner Cleaner" }}
              </p>
              <p v-if="cleaner.insuranceVerified" class="rounded-md bg-stone-100 px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-stone-700">
                Insurance verified
              </p>
              <p v-if="cleaner.photoReports" class="rounded-md bg-stone-100 px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-stone-700">
                Photo reports
              </p>
            </div>

            <h1 class="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              {{ cleaner.companyName }}
            </h1>
            <p class="mt-4 max-w-3xl text-lg leading-8 text-stone-700">
              {{ cleaner.headline }}
            </p>
          </div>

          <aside class="rounded-lg border border-stone-300 bg-[#f7f5ef] p-5">
            <p class="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Directory Rating</p>
            <div class="mt-3 flex items-end gap-3">
              <p class="text-5xl font-black">{{ displayRating }}</p>
              <p class="pb-2 text-sm font-bold text-stone-600">/ 5.0</p>
            </div>
            <p class="mt-3 text-sm leading-6 text-stone-700">
              Based on review signal, response speed, quality, reliability, and verification.
            </p>
          </aside>
        </div>
      </div>
    </section>

    <section class="py-10">
      <div class="mx-auto grid max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-[1fr_360px]">
        <div class="space-y-6">
          <article class="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Profile</p>
            <div class="mt-4 space-y-4 text-lg leading-8 text-stone-750">
              <p>{{ cleaner.profileSummary }}</p>
            </div>
          </article>

          <article class="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-teal-700">What Reviews Point To</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
              <div v-for="theme in cleaner.reviewThemes" :key="theme" class="rounded-md bg-[#f7f5ef] p-4">
                <p class="text-sm font-black text-stone-900">{{ theme }}</p>
              </div>
            </div>
          </article>

          <article class="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Featured Reviews</p>
            <div class="mt-5 grid gap-4">
              <figure v-for="review in cleaner.featuredReviews" :key="`${review.author}-${review.date}`" class="rounded-md border border-stone-200 bg-[#f7f5ef] p-4">
                <blockquote class="leading-7 text-stone-800">
                  "{{ review.text }}"
                </blockquote>
                <figcaption class="mt-3 text-sm font-bold text-stone-600">
                  {{ review.author }} · {{ review.city }} · {{ review.rating.toFixed(1) }} stars
                </figcaption>
              </figure>
            </div>
          </article>

          <article class="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Rating Breakdown</p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <div v-for="metric in ratingMetrics" :key="metric.label" class="rounded-md bg-[#f7f5ef] p-4">
                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm font-black">{{ metric.label }}</p>
                  <p class="text-sm font-black text-teal-800">{{ metric.value }}</p>
                </div>
                <div class="mt-3 h-2 rounded-full bg-stone-200">
                  <div class="h-2 rounded-full bg-teal-700" :style="{ width: `${metric.percent}%` }" />
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside class="space-y-5">
          <section class="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-black">Contact</h2>
            <div class="mt-4 space-y-3 text-sm leading-6 text-stone-700">
              <p><strong>Contact:</strong> {{ cleaner.contactName }}</p>
              <p><strong>Phone:</strong> {{ formattedPhone }}</p>
              <p><strong>Email:</strong> {{ cleaner.email }}</p>
              <p><strong>Response:</strong> {{ responseLabel(cleaner.responseTimeMinutes) }}</p>
            </div>
            <div class="mt-5 grid gap-3">
              <QuicklistToggle
                :cleaner-id="cleaner.id"
                :company-name="cleaner.companyName"
              />
              <a class="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-teal-800" :href="`tel:${cleaner.phone}`">
                Call Cleaner
              </a>
              <a class="inline-flex items-center justify-center rounded-md border border-stone-300 px-4 py-3 text-sm font-black uppercase tracking-wide text-stone-900 transition hover:border-teal-700 hover:text-teal-800" :href="introHref">
                Request Intro
              </a>
            </div>
          </section>

          <section class="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-black">Service Details</h2>
            <dl class="mt-4 space-y-4 text-sm leading-6 text-stone-700">
              <div>
                <dt class="font-black uppercase tracking-wide text-stone-500">Areas</dt>
                <dd>{{ cleaner.serviceAreas.join(", ") }}</dd>
              </div>
              <div>
                <dt class="font-black uppercase tracking-wide text-stone-500">ZIP Coverage</dt>
                <dd>{{ cleaner.zipCodes.join(", ") }}</dd>
              </div>
              <div>
                <dt class="font-black uppercase tracking-wide text-stone-500">Services</dt>
                <dd>{{ cleaner.services.map((service) => serviceLabels[service]).join(", ") }}</dd>
              </div>
              <div>
                <dt class="font-black uppercase tracking-wide text-stone-500">Starting Price</dt>
                <dd>${{ cleaner.minimumJobPrice }}+</dd>
              </div>
              <div>
                <dt class="font-black uppercase tracking-wide text-stone-500">Years in Business</dt>
                <dd>{{ cleaner.yearsInBusiness }}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  getCleanerRatingScore,
  getDisplayRating,
  getPartnerCleanerBySlug,
  serviceLabels,
} from "~~/data/partnerCleaners";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const cleaner = computed(() => getPartnerCleanerBySlug(slug.value));

if (!cleaner.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Cleaner profile not found",
  });
}

const displayRating = computed(() => (cleaner.value ? getDisplayRating(cleaner.value) : "0.0"));
const ratingScore = computed(() => (cleaner.value ? getCleanerRatingScore(cleaner.value) : 0));

const ratingMetrics = computed(() => {
  if (!cleaner.value) return [];

  return [
    {
      label: "Review signal",
      value: `${cleaner.value.rating.reviewAverage.toFixed(1)} from ${cleaner.value.rating.reviewCount} reviews`,
      percent: Math.round((cleaner.value.rating.reviewAverage / 5) * 100),
    },
    {
      label: "Response",
      value: `${cleaner.value.rating.responseScore}/100`,
      percent: cleaner.value.rating.responseScore,
    },
    {
      label: "Quality",
      value: `${cleaner.value.rating.qualityScore}/100`,
      percent: cleaner.value.rating.qualityScore,
    },
    {
      label: "Reliability",
      value: `${cleaner.value.rating.reliabilityScore}/100`,
      percent: cleaner.value.rating.reliabilityScore,
    },
    {
      label: "Verification",
      value: `${cleaner.value.rating.verificationScore}/100`,
      percent: cleaner.value.rating.verificationScore,
    },
    {
      label: "Overall directory score",
      value: `${ratingScore.value}/100`,
      percent: ratingScore.value,
    },
  ];
});

const formattedPhone = computed(() => {
  if (!cleaner.value) return "";
  const digits = cleaner.value.phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return cleaner.value.phone;
});

const introHref = computed(() => {
  if (!cleaner.value) return "#";
  const subject = encodeURIComponent(`Gutter cleaner intro request: ${cleaner.value.companyName}`);
  const body = encodeURIComponent(`Hi, I'd like to contact ${cleaner.value.companyName} for gutter cleaning.`);
  return `mailto:${cleaner.value.email}?subject=${subject}&body=${body}`;
});

function responseLabel(minutes: number) {
  if (minutes <= 90) return "Usually responds within 90 minutes";
  if (minutes < 240) return "Usually responds within a few hours";
  if (minutes <= 480) return "Usually responds same day";
  return "Usually responds within 1 business day";
}

useHead({
  title: computed(() =>
    cleaner.value
      ? `${cleaner.value.companyName} Reviews, Rating & Contact | ClearFlow Directory`
      : "Cleaner Profile | ClearFlow Directory",
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        cleaner.value
          ? `${cleaner.value.companyName} profile with ratings, review themes, services, service areas, and contact information.`
          : "Cleaner profile in the ClearFlow gutter cleaning directory.",
      ),
    },
  ],
});
</script>
