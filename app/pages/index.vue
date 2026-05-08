<template>
  <main class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
    <!-- Hero -->
    <section aria-labelledby="hero-heading" class="relative overflow-hidden">
      <!-- Decorative background -->
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute -left-32 top-[-10rem] h-[36rem] w-[36rem] rounded-full bg-cyan-200/30 blur-3xl" />
        <div class="absolute -right-24 bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-emerald-200/30 blur-3xl" />
      </div>
    </section>

    <AppHero />

    <!-- Pricing -->
    <section id="pricing" aria-labelledby="pricing-heading" class="border-t border-slate-200 bg-white py-16">
      <div class="container mx-auto px-6">
        <div class="mx-auto max-w-2xl text-center">
          <h2 id="pricing-heading" class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Flat‑Rate Pricing
          </h2>
          <p class="mt-3 text-slate-600">
            No hidden fees. Choose the option that best matches your
            home.
          </p>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Single Story -->
          <article
            class="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div
              class="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Base
            </div>
            <h3 class="text-xl font-bold">Single‑Story Home</h3>
            <p class="mt-1 text-sm text-slate-600">
              Up to <span class="font-medium">150 ft</span> of
              gutters
            </p>
            <p class="mt-4 text-4xl font-extrabold tracking-tight">
              $200
            </p>
            <ul class="mt-4 space-y-2 text-sm text-slate-700">
              <li>✔ Clean gutters & downspout inlets</li>
              <li>✔ Bag & remove debris</li>
              <li>✔ Visual roofline check</li>
            </ul>
            <a href="/booking"
              class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white shadow hover:bg-cyan-700">Book
              this service</a>
          </article>

          <!-- Two Story -->
          <article
            class="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div
              class="absolute right-4 top-4 rounded-full bg-cyan-600/10 px-3 py-1 text-xs font-semibold text-cyan-700">
              Popular
            </div>
            <h3 class="text-xl font-bold">Two‑Story Home</h3>
            <p class="mt-1 text-sm text-slate-600">
              Up to <span class="font-medium">200 ft</span> of
              gutters
            </p>
            <p class="mt-4 text-4xl font-extrabold tracking-tight">
              $300
            </p>
            <ul class="mt-4 space-y-2 text-sm text-slate-700">
              <li>✔ Includes second‑story ladder work</li>
              <li>✔ Clean gutters & downspout inlets</li>
              <li>✔ Debris bagging & haul‑away</li>
            </ul>
            <a href="/booking"
              class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white shadow hover:bg-cyan-700">Book
              this service</a>
          </article>

          <!-- Large / Multi -->
          <article
            class="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div
              class="absolute right-4 top-4 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
              Best for Large Homes
            </div>
            <h3 class="text-xl font-bold">Large / Multi‑Story</h3>
            <p class="mt-1 text-sm text-slate-600">
              <span class="font-medium">250–300+ ft</span> of
              gutters
            </p>
            <p class="mt-4 text-4xl font-extrabold tracking-tight">
              Starting at $475
            </p>
            <ul class="mt-4 space-y-2 text-sm text-slate-700">
              <li>✔ Complex rooflines & access</li>
              <li>✔ Thorough clean & debris removal</li>
              <li>✔ Photo report on request</li>
            </ul>
            <a href="/booking"
              class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white shadow hover:bg-cyan-700">Get
              custom quote</a>
          </article>
        </div>

        <!-- Add‑ons & Plans -->
        <div class="mt-10 grid gap-6 lg:grid-cols-3">
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 class="text-lg font-bold">Add‑Ons (if needed)</h3>
            <ul class="mt-3 space-y-2 text-slate-700">
              <li>
                • Heavy tree cover / extra debris →
                <span class="font-medium">+ $50–$100</span>
              </li>
              <li>
                • Difficult access (steep roof, tight yard,
                special ladder setup) →
                <span class="font-medium">+ $50</span>
              </li>
              <li>
                • Gutter guards or screens →
                <span class="font-medium">+ $50</span>
              </li>
              <li>
                • Oversized/custom gutters (6‑inch, copper,
                etc.) →
                <span class="font-medium">+ $25–$50</span>
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 class="text-lg font-bold">Maintenance Plans</h3>
            <ul class="mt-3 space-y-2 text-slate-700">
              <li>
                • Seasonal Plan (2 cleanings/year) →
                <span class="font-medium">10% OFF</span>
              </li>
              <li>
                • Quarterly Plan (4 cleanings/year) →
                <span class="font-medium">15% OFF</span>
              </li>
              <li>
                • Neighbor/Referral Discount →
                <span class="font-medium">$25 OFF</span> per
                referral
              </li>
            </ul>
            <a href="/booking"
              class="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700">Ask
              about plans</a>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 class="text-lg font-bold">Why Choose ClearFlow?</h3>
            <ul class="mt-3 space-y-2 text-slate-700">
              <li>✔ Flat, transparent rates</li>
              <li>✔ Professional & safe ladder work</li>
              <li>
                ✔ Keep your home protected from water damage
              </li>
              <li>✔ Friendly, reliable local service</li>
            </ul>
            <div class="mt-5 flex flex-wrap gap-3 text-sm">
              <a href="tel:+13237095357"
                class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold shadow-sm hover:border-cyan-300">Call
                (323) 709‑5357</a>
              <a href="mailto:solarsustain@gmail.com"
                class="inline-flex items-center rounded-lg bg-cyan-600 px-3 py-2 font-semibold text-white shadow hover:bg-cyan-700">Email
                Us</a>
            </div>
          </article>
        </div>

        <!-- Testimonials -->
        <Testimonials />

        <!-- Service Area -->
        <ServiceArea />

        <!-- Sticky CTA -->
        <div id="book" class="mt-12 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
          <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p class="text-lg font-semibold">
                Ready to schedule your cleaning?
              </p>
              <p class="text-slate-300">
                Book now or call for a fast quote. Most homes
                scheduled within a week.
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <a href="tel:+13237095357"
                class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 font-semibold text-slate-900 shadow hover:bg-slate-100 hover:text-slate-300">Call
                (323) 709‑5357</a>
              <a href="mailto:clearflowgutterspro@gmail.com?subject=Gutter%20Cleaning%20Booking&body=Hi%20ClearFlow%2C%20I'd%20like%20to%20book%20a%20gutter%20cleaning.%20My%20city%20and%20ZIP%20code%20are%3A%20_____%20Home%20type%3A%20(1%2F2%2Fmulti)%20Approx.%20gutter%20ft%3A%20_____%20Preferred%20dates%3A%20_____""
                class=" inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-3 font-semibold
                text-white shadow hover:bg-cyan-700">Request
                by Email</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Testimonials from "~/components/Testimonials.vue";
import ServiceArea from "~/components/ServiceArea.vue";
useHead({
  title: "ClearFlow Gutter Cleaning | Reliable • Safe • Affordable",
  meta: [
    {
      name: "description",
      content:
        "ClearFlow Gutter Cleaning provides flat-rate, professional gutter cleaning services throughout Los Angeles and San Bernardino Counties. Reliable, safe, and affordable.",
    },
    { property: "og:title", content: "ClearFlow Gutter Cleaning" },
    {
      property: "og:description",
      content:
        "Flat-rate gutter cleaning with no hidden fees. Serving Los Angeles & San Bernardino Counties.",
    },
    {
      property: "og:image",
      content: "/images/clearflow-social.jpg", // update this path if you have a banner
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "ClearFlow Gutter Cleaning" },
    {
      name: "twitter:description",
      content:
        "Protect your home from water damage. Professional gutter cleaning in Los Angeles & San Bernardino Counties.",
    },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/favicon.png" },
    { rel: "canonical", href: "https://www.clearflowgutters.pro/" }, // replace with your actual domain
  ],
});
</script>

<style>
/***** Optional: smooth anchor scroll *****/
html {
  scroll-behavior: smooth;
}
</style>
