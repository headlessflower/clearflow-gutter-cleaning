<template>
  <main class="min-h-screen bg-[#f7f5ef] text-stone-950">
    <section class="border-b border-stone-200 bg-[#f7f5ef]">
      <div class="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
        <div class="flex flex-col justify-center">
          <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
            Los Angeles County Gutter Cleaning Directory
          </p>
          <h1 class="mt-4 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Find top-rated gutter cleaners near you.
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            Compare trusted gutter cleaning options across Los Angeles County, learn what to ask before hiring, and request contact from available cleaners in your area.
          </p>

          <form class="mt-7 grid gap-3 rounded-lg border border-stone-300 bg-white p-3 shadow-sm sm:grid-cols-[1fr_auto]" @submit.prevent="goToQuote">
            <label class="sr-only" for="zip">ZIP code or city</label>
            <input
              id="zip"
              v-model="searchLocation"
              class="min-h-12 rounded-md border border-stone-200 px-4 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Enter ZIP or city in LA County"
              type="text"
            />
            <button class="min-h-12 rounded-md bg-teal-700 px-5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-teal-800" type="submit">
              Find Cleaners
            </button>
          </form>

          <div class="mt-5 flex flex-wrap gap-2 text-sm font-bold text-stone-700">
            <a
              v-for="city in quickCities"
              :key="city"
              class="rounded-md border border-stone-300 bg-white px-3 py-2 transition hover:border-teal-600 hover:text-teal-800"
              :href="cleanersHref(city)"
            >
              {{ city }}
            </a>
          </div>
        </div>

        <aside class="self-end rounded-lg border border-stone-300 bg-white shadow-sm">
          <div class="border-b border-stone-200 p-5">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-stone-500">
              Directory Snapshot
            </p>
            <div class="mt-5 grid grid-cols-3 gap-3">
              <div v-for="stat in stats" :key="stat.label" class="rounded-md bg-stone-100 p-3">
                <p class="text-2xl font-black text-stone-950">{{ stat.value }}</p>
                <p class="mt-1 text-xs font-bold uppercase tracking-wide text-stone-600">{{ stat.label }}</p>
              </div>
            </div>
          </div>
          <div class="p-5">
            <p class="text-lg font-black">What homeowners usually need</p>
            <div class="mt-4 space-y-3">
              <div v-for="need in homeownerNeeds" :key="need.title" class="flex gap-3">
                <span class="mt-1 h-3 w-3 shrink-0 rounded-sm bg-amber-500" aria-hidden="true" />
                <div>
                  <p class="font-black">{{ need.title }}</p>
                  <p class="text-sm leading-6 text-stone-700">{{ need.copy }}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section id="best-cleaners" class="bg-white py-14">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
              Find The Best Fit
            </p>
            <h2 class="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Browse cleaners by the job you need done.
            </h2>
          </div>
          <NuxtLink class="inline-flex w-fit items-center justify-center rounded-md bg-stone-950 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-stone-800" to="/cleaners">
            Request Matches
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article v-for="category in serviceCategories" :key="category.title" class="rounded-lg border border-stone-200 bg-[#f7f5ef] p-5">
            <p class="text-sm font-black uppercase tracking-[0.18em] text-stone-500">{{ category.tag }}</p>
            <h3 class="mt-3 text-xl font-black">{{ category.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-stone-700">{{ category.copy }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="featured" class="border-y border-stone-200 bg-[#eef5f1] py-14">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="max-w-3xl">
          <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
            Featured Cleaners
          </p>
          <h2 class="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
            Featured LA County cleaner match profiles.
          </h2>
          <p class="mt-4 leading-7 text-stone-700">
            Directory profiles are organized around homeowner needs: service area, response speed, job type, documentation, and seasonal availability.
          </p>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-3">
          <article v-for="cleaner in featuredCleaners" :key="cleaner.name" class="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-black">{{ cleaner.name }}</h3>
                <p class="mt-1 text-sm font-bold text-teal-800">{{ cleaner.area }}</p>
              </div>
              <div class="rounded-md bg-amber-100 px-3 py-2 text-right">
                <p class="text-sm font-black text-stone-950">{{ cleaner.rating }}</p>
                <p class="text-xs font-bold uppercase tracking-wide text-stone-600">Match</p>
              </div>
            </div>
            <p class="mt-4 text-sm leading-6 text-stone-700">{{ cleaner.copy }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="tag in cleaner.tags" :key="tag" class="rounded-md bg-stone-100 px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-stone-600">
                {{ tag }}
              </span>
            </div>
            <NuxtLink class="mt-5 inline-flex w-full items-center justify-center rounded-md border border-teal-700 px-4 py-3 text-sm font-black uppercase tracking-wide text-teal-800 transition hover:bg-teal-700 hover:text-white" :to="`/cleaners?city=${encodeURIComponent(cleaner.area)}`">
              Contact Similar Cleaners
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section id="ratings" class="bg-white py-14">
      <div class="mx-auto grid max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
            How We Rate
          </p>
          <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Our cleaner score looks beyond a star rating.
          </h2>
          <p class="mt-4 leading-7 text-stone-700">
            The goal is to help homeowners reach cleaners who are a practical match for the property, not just a name in a list.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <article v-for="criterion in ratingCriteria" :key="criterion.title" class="rounded-lg border border-stone-200 bg-[#f7f5ef] p-5">
            <p class="text-3xl font-black text-teal-800">{{ criterion.score }}</p>
            <h3 class="mt-3 text-lg font-black">{{ criterion.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-stone-700">{{ criterion.copy }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="areas" class="border-y border-stone-200 bg-stone-950 py-14 text-white">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
              LA County Coverage
            </p>
            <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Search by city, neighborhood, or property type.
            </h2>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <a
              v-for="area in serviceAreas"
              :key="area"
              class="rounded-md border border-white/15 bg-white/8 px-4 py-3 text-sm font-black transition hover:border-amber-300 hover:bg-white/12"
              :href="cleanersHref(area)"
            >
              {{ area }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="guide" class="bg-[#f7f5ef] py-14">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="max-w-3xl">
          <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
            Hiring Guide
          </p>
          <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Ask better questions before you hire.
          </h2>
        </div>
        <div class="mt-8 grid gap-5 lg:grid-cols-3">
          <article v-for="tip in hiringTips" :key="tip.title" class="rounded-lg border border-stone-300 bg-white p-5">
            <h3 class="text-xl font-black">{{ tip.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-stone-700">{{ tip.copy }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="contact-cleaners" class="bg-teal-800 py-12 text-white">
      <div class="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-100">
            Ready For Cleaner Contact?
          </p>
          <h2 class="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
            Tell us where the property is and we’ll route your request to available gutter cleaners.
          </h2>
        </div>
        <div class="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <NuxtLink class="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-teal-900 transition hover:bg-teal-50" to="/cleaners">
            Get Cleaner Contacts
          </NuxtLink>
          <a class="inline-flex items-center justify-center rounded-md border border-white/50 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/10" href="tel:+13237095357">
            Call (323) 709-5357
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const searchLocation = ref("");

const quickCities = ["Los Angeles", "Pasadena", "Long Beach", "Burbank", "Santa Monica"];

const stats = [
  { value: "80+", label: "LA Cities" },
  { value: "4", label: "Rating Checks" },
  { value: "24h", label: "Lead Routing" },
];

const homeownerNeeds = [
  {
    title: "Fast seasonal cleanups",
    copy: "Great for homes under trees, post-wind debris, and pre-rain maintenance.",
  },
  {
    title: "Multi-story access",
    copy: "Match with cleaners comfortable with second-story gutters, slopes, and tighter lots.",
  },
  {
    title: "Proof of completed work",
    copy: "Ask for before-and-after photos, downspout checks, and visible debris removal.",
  },
];

const serviceCategories = [
  {
    tag: "Residential",
    title: "Standard gutter cleaning",
    copy: "For routine debris removal, downspout clearing, and basic roofline checks on single-family homes.",
  },
  {
    tag: "Urgent",
    title: "Overflow and blockage help",
    copy: "For gutters spilling during rain, backed-up downspouts, or visible water staining near fascia.",
  },
  {
    tag: "Complex",
    title: "Two-story and hillside homes",
    copy: "Find cleaners equipped for taller access, uneven lots, steep driveways, and longer gutter runs.",
  },
  {
    tag: "Recurring",
    title: "Seasonal maintenance",
    copy: "Compare cleaners who can support spring, fall, or quarterly visits in leafy neighborhoods.",
  },
];

const featuredCleaners = [
  {
    name: "Central LA Residential Specialists",
    area: "Los Angeles",
    rating: "4.9",
    copy: "A strong fit for routine home cleanings, quick scheduling windows, and dense neighborhood access.",
    tags: ["Fast response", "Photo updates", "Residential"],
  },
  {
    name: "Foothill Heavy-Debris Cleaners",
    area: "Pasadena",
    rating: "4.8",
    copy: "Useful for tree-heavy properties near the foothills where seasonal debris can build up quickly.",
    tags: ["Heavy debris", "Two-story", "Maintenance"],
  },
  {
    name: "South Bay Downspout Cleaners",
    area: "Long Beach",
    rating: "4.8",
    copy: "A practical match for coastal and South Bay homes needing gutter clearing before wet weather.",
    tags: ["Downspouts", "Townhomes", "Flexible times"],
  },
];

const ratingCriteria = [
  {
    score: "01",
    title: "Local service fit",
    copy: "We prioritize cleaners whose service areas line up with the property location and job type.",
  },
  {
    score: "02",
    title: "Clear scope",
    copy: "Strong profiles explain debris removal, downspout handling, cleanup, and photo expectations.",
  },
  {
    score: "03",
    title: "Homeowner response",
    copy: "Cleaner availability, quote speed, and follow-through are important signals for lead routing.",
  },
  {
    score: "04",
    title: "Property readiness",
    copy: "We look for cleaners who can handle access constraints, height, gutter guards, and heavy tree cover.",
  },
];

const serviceAreas = [
  "Los Angeles",
  "Long Beach",
  "Pasadena",
  "Glendale",
  "Burbank",
  "Santa Monica",
  "Torrance",
  "Whittier",
  "Downey",
  "Inglewood",
  "San Gabriel Valley",
  "South Bay",
];

const hiringTips = [
  {
    title: "Confirm what is included",
    copy: "Ask whether the quote includes debris bagging, downspout clearing, cleanup, and photos after the job.",
  },
  {
    title: "Share property details early",
    copy: "Mention stories, approximate gutter length, roof pitch, gutter guards, trees, and tight side-yard access.",
  },
  {
    title: "Book before rain",
    copy: "Cleaners fill up quickly before storms. Seasonal requests usually get better availability and pricing.",
  },
];

function cleanersHref(city: string) {
  return `/cleaners?city=${encodeURIComponent(city)}`;
}

function goToQuote() {
  const query = searchLocation.value.trim();
  if (!query) {
    navigateTo("/booking");
    return;
  }

  const queryParam = /^\d{5}$/.test(query) ? "zip" : "city";
  navigateTo(`/cleaners?${queryParam}=${encodeURIComponent(query)}`);
}

useHead({
  title: "Top-Rated Gutter Cleaners in Los Angeles County | ClearFlow Directory",
  meta: [
    {
      name: "description",
      content:
        "Find and compare top-rated gutter cleaners in Los Angeles County. Browse featured cleaners, see how we rate them, and request contact from available local pros.",
    },
    {
      property: "og:title",
      content: "Top-Rated Gutter Cleaners in Los Angeles County",
    },
    {
      property: "og:description",
      content:
        "A useful LA County gutter cleaning directory for comparing cleaners and requesting local contact.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
  link: [{ rel: "canonical", href: "https://www.clearflowgutters.pro/" }],
});
</script>
