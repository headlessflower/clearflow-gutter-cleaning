<template>
  <main class="min-h-screen bg-[#f7f5ef] text-stone-950">
    <section class="border-b border-stone-200 bg-white">
      <div class="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Your saved companies</p>
        <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="text-4xl font-black tracking-tight sm:text-5xl">Quicklist</h1>
            <p class="mt-4 max-w-2xl text-lg leading-8 text-stone-700">
              Compare companies while you browse, then choose who can receive your quote request.
            </p>
          </div>
          <button v-if="cleaners.length" class="text-sm font-black text-stone-600 underline hover:text-stone-950" type="button" @click="clearQuicklist">
            Clear Quicklist
          </button>
        </div>
      </div>
    </section>

    <section class="py-10">
      <div class="mx-auto max-w-5xl px-5 md:px-8">
        <div v-if="cleaners.length" class="grid gap-5">
          <article v-for="cleaner in cleaners" :key="cleaner.id" class="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <NuxtLink :to="`/cleaners/${cleaner.slug}`" class="text-2xl font-black hover:text-teal-800">
                  {{ cleaner.companyName }}
                </NuxtLink>
                <p class="mt-2 leading-7 text-stone-700">{{ cleaner.headline }}</p>
                <p class="mt-3 text-sm font-bold text-stone-600">
                  {{ cleaner.serviceAreas.join(", ") }} · ${{ cleaner.minimumJobPrice }}+
                </p>
              </div>
              <QuicklistToggle :cleaner-id="cleaner.id" :company-name="cleaner.companyName" />
            </div>
          </article>

          <div class="flex flex-col gap-3 rounded-lg bg-stone-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xl font-black">Ready to request quotes?</p>
              <p class="mt-1 text-sm text-stone-300">You’ll choose exactly which saved companies can be contacted.</p>
            </div>
            <NuxtLink class="rounded-md bg-teal-600 px-5 py-3 text-center text-sm font-black uppercase tracking-wide hover:bg-teal-500" to="/booking" @click="trackBookingStart">
              Continue to request
            </NuxtLink>
          </div>
        </div>

        <div v-else class="rounded-lg border border-stone-300 bg-white p-8 text-center shadow-sm">
          <h2 class="text-2xl font-black">Your Quicklist is empty</h2>
          <p class="mt-3 text-stone-700">Save companies from the directory to compare them here.</p>
          <NuxtLink class="mt-6 inline-flex rounded-md bg-teal-700 px-5 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-teal-800" to="/cleaners">
            Browse cleaners
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { partnerCleaners } from "~~/data/partnerCleaners";

const { ids, count, clear, replace } = useQuicklist();
const cleaners = computed(() => partnerCleaners.filter((cleaner) => ids.value.includes(cleaner.id)));

onMounted(() => {
  const validIds = ids.value.filter((id) => partnerCleaners.some((cleaner) => cleaner.id === id));
  if (validIds.length !== ids.value.length) replace(validIds);
  useTrackEvent("quicklist_view", { quicklist_size: validIds.length });
});

function clearQuicklist() {
  clear();
  useTrackEvent("quicklist_clear", { quicklist_size: 0 });
}

function trackBookingStart() {
  useTrackEvent("quicklist_booking_start", { quicklist_size: count.value });
}

useHead({
  title: "Your Quicklist | ClearFlow",
  meta: [{ name: "description", content: "Review gutter cleaning companies saved to your ClearFlow Quicklist." }],
});
</script>
