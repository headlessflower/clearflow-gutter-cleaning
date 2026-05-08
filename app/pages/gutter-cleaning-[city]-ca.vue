<template>
  <main v-if="city" class="min-h-screen bg-slate-50">
    <StickyCtaBar :to="bookingLink" phone="+13237095357" :city-name="city.name" />
    <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-300">
      <ol class="flex flex-wrap items-center gap-2">
        <li>
          <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink to="/landing-pages" class="hover:text-white">Service Areas</NuxtLink>
        </li>
        <li>/</li>
        <li class="text-white">Gutter Cleaning {{ city.name }}, CA</li>
      </ol>
    </nav>
    <!-- Hero -->
    <section class="bg-slate-900 text-white">
      <div class="mx-auto max-w-6xl px-4 py-16 lg:flex lg:items-center lg:gap-12">

        <div class="flex-1">
          <p class="text-sm font-semibold uppercase tracking-wide text-amber-300">
            Gutter Cleaning {{ city.name }}, CA
          </p>

          <h1 class="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Gutter Cleaning in {{ city.name }}, CA — Flat-Rate Pricing. Fast Service.
          </h1>

          <p class="mt-4 text-base text-slate-200 sm:text-lg">
            We remove all debris, flush downspouts, and leave your property clean.
            Book online in under 60 seconds.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <NuxtLink :to="bookingLink"
              class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition">
              Get Instant Quote
            </NuxtLink>

            <a href="tel:+13237095357"
              class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-amber-300/70 text-amber-100 hover:bg-white/10 transition">
              Call (323) 709-5357
            </a>

            <a href="#pricing" class="text-sm font-semibold text-amber-200 hover:text-amber-100">
              View flat-rate pricing →
            </a>
          </div>

          <!-- Trust strip -->
          <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              Flat-rate pricing
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              No upsells
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              Fully insured
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              Debris hauled away
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              5-star local service
            </span>
          </div>
        </div>

        <!-- Right card -->
        <div class="mt-10 w-full max-w-md flex-1 lg:mt-0">
          <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/20">
            <h2 class="text-lg font-semibold text-slate-900">Ready to book?</h2>
            <p class="mt-2 text-sm text-slate-500">
              Flat-rate pricing. Fast scheduling. No upsells.
            </p>

            <div class="mt-5">
              <NuxtLink :to="bookingLink"
                class="inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition">
                Get Instant Quote
              </NuxtLink>
            </div>

            <div class="mt-3">
              <a href="tel:+13237095357"
                class="inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-slate-200 text-slate-900 hover:bg-slate-50 transition">
                Call (323) 709-5357
              </a>
            </div>

            <p class="mt-3 text-xs text-slate-500">
              This will prefill your city: <span class="font-semibold">{{ city.name }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why + Areas -->
    <section class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-start">

        <div>
          <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Gutter Cleaning Matters in {{ city.name }}
          </h2>

          <p class="mt-4 text-sm text-slate-600 sm:text-base">
            {{ city.whyIntro }}
          </p>

          <p class="mt-4 text-sm text-slate-700 sm:text-base">
            We provide gutter cleaning throughout {{ city.name }}, CA and nearby San Gabriel Valley communities, with
            straightforward pricing and full cleanup after service.
          </p>
          <p class="mt-4 text-sm text-slate-700 sm:text-base">
            In {{ city.name }}, seasonal leaf drop and wind-driven debris can clog gutters quickly.
            When gutters overflow, water can damage fascia, siding, and foundations.
            Routine cleaning helps prevent costly repairs.
          </p>

          <h3 class="mt-8 text-lg font-semibold text-slate-900">Our service includes:</h3>

          <ul class="mt-6 space-y-3 text-sm text-slate-700 sm:text-base">
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              <span><strong>Full debris removal</strong> (bagged and hauled away)</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              <span><strong>Downspout flushing</strong> and inlet clearing as needed</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              <span><strong>Roofline + gutter inspection</strong> (we flag obvious issues)</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              <span><strong>Cleanup</strong> of all work areas around your home</span>
            </li>
          </ul>
        </div>

        <!-- Neighborhoods -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">
            Serving Homes Throughout {{ city.name }}
          </h3>
          <p class="mt-2 text-sm text-slate-600">
            We cover {{ city.name }} and nearby foothill neighborhoods.
          </p>

          <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
            <span v-for="area in city.areas" :key="area" class="rounded-full bg-slate-50 px-3 py-1">
              {{ area }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="bg-white">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
              Flat-Rate Gutter Cleaning in {{ city.name }}, CA
            </h2>
            <p class="mt-3 text-sm text-slate-600 sm:text-base">
              Know your price before we arrive. Pricing includes full gutter cleaning and debris removal.
            </p>
          </div>

          <NuxtLink :to="bookingLink"
            class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition">
            Schedule a Cleaning
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <div class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 class="text-lg font-semibold text-slate-900">Single-Story Homes</h3>
            <p class="mt-2 text-3xl font-bold text-slate-900">$200</p>
            <p class="mt-2 text-sm text-slate-600">
              Ideal for most one-story {{ city.name }} homes with standard gutter runs.
            </p>
          </div>

          <div class="flex flex-col rounded-2xl border-2 border-amber-400 bg-amber-50 p-6">
            <h3 class="text-lg font-semibold text-slate-900">Two-Story Homes</h3>
            <p class="mt-2 text-3xl font-bold text-slate-900">$300</p>
            <p class="mt-2 text-sm text-slate-600">
              For multi-story homes requiring taller ladder work and more time.
            </p>
          </div>

          <div class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 class="text-lg font-semibold text-slate-900">Over 300 ft of Gutters</h3>
            <p class="mt-2 text-3xl font-bold text-slate-900">From $475</p>
            <p class="mt-2 text-sm text-slate-600">
              Larger properties or complex gutter systems. We confirm final price before work begins.
            </p>
          </div>
        </div>

        <p class="mt-6 text-sm text-slate-600 sm:text-base">
          Pricing includes hand removal of leaves, mud, and roof debris; checking and clearing
          downspout inlets; flushing downspouts as needed; and cleanup of all work areas with debris
          haul away. <span class="font-semibold">No hidden fees. No surprise add-ons.</span>
        </p>
      </div>
    </section>

    <!-- Frequency -->
    <section class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div class="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
            How Often Should You Clean Gutters in {{ city.name }}?
          </h2>
          <p class="mt-3 text-sm text-slate-600 sm:text-base">
            {{ city.frequencyIntro }}
          </p>

          <ul class="mt-6 space-y-2 text-sm text-slate-700 sm:text-base">
            <li><strong>1–2 times per year</strong> for homes with moderate tree coverage.</li>
            <li><strong>2–3 times per year</strong> for heavily treed lots or foothill-adjacent homes.</li>
          </ul>

          <p class="mt-4 text-sm text-slate-700 sm:text-base">
            Clean gutters help prevent overflow, fascia damage, roof leaks, soil erosion,
            and foundation water issues.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">Book Your {{ city.name }} Gutter Cleaning</h3>
          <p class="mt-2 text-sm text-slate-600">
            Schedule now and stay ahead of the next rain.
          </p>

          <div class="mt-6">
            <NuxtLink :to="bookingLink"
              class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition">
              Schedule Your Cleaning
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <BookingSteps :cta-to="bookingLink" cta-label="Get Instant Quote" cta-note="Most bookings take under 60 seconds." />

    <TestimonialCards :kicker="`Homeowners in and around ${city.name}`"
      title="Clean gutters. Clear pricing. Easy booking." subtitle="A few quick notes from customers after service."
      :items="testimonials" />

    <section class="mx-auto max-w-6xl px-4 py-12">
      <h2 class="text-xl font-semibold text-slate-900">
        Nearby Service Areas
      </h2>

      <p class="mt-2 text-sm text-slate-600">
        We also provide gutter cleaning services in nearby areas:
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <NuxtLink v-for="nearby in nearbyCities" :key="nearby.slug" :to="`/gutter-cleaning-${nearby.slug}-ca`">
          {{ nearby.name }}
        </NuxtLink>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-white">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <div class="mt-8 grid gap-6 md:grid-cols-2">
          <div v-for="item in faq" :key="item.q" class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 class="text-base font-semibold text-slate-900">{{ item.q }}</h3>
            <p class="mt-2 text-sm text-slate-700">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="bg-slate-900 text-white">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div class="rounded-3xl border border-slate-700/60 bg-slate-800/40 p-8 sm:p-10">
          <h2 class="text-2xl font-bold sm:text-3xl">
            Ready to Book Gutter Cleaning in {{ city.name }}?
          </h2>
          <p class="mt-3 text-slate-200">Flat-rate pricing. Fast scheduling. No upsells.</p>

          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink :to="bookingLink"
              class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition">
              Get Instant Quote
            </NuxtLink>

            <a href="tel:+13237095357"
              class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-amber-300/70 text-amber-100 hover:bg-white/10 transition">
              Call (323) 709-5357
            </a>

            <a href="#booking"
              class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-amber-100 hover:bg-white/10 transition">
              Jump to booking form →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking (embedded) -->
    <section id="booking" class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div class="mx-auto max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Step 1 of 2</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Get Your Instant Quote
        </h2>
        <p class="mt-3 text-sm text-slate-600 sm:text-base">
          Tell us a few details. We’ll confirm availability and finalize timing after you submit.
        </p>

        <div class="mt-8">
          <ClientOnly>
            <BookForm:prefill-city="city.name" />
            <template #fallback>
              <div class="rounded-2xl border border-slate-200 bg-white p-6">
                <p class="text-sm text-slate-700">Loading booking form…</p>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </section>
  </main>

  <!-- If city not found -->
  <main v-else class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-3xl px-4 py-20">
      <h1 class="text-2xl font-bold text-slate-900">City page not found</h1>
      <p class="mt-3 text-slate-600">That city isn’t in our service list yet.</p>
      <div class="mt-6">
        <NuxtLink to="/booking"
          class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition">
          Go to Booking
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead, useRoute, useRuntimeConfig, useSeoMeta } from "#imports";

import StickyCtaBar from "~/components/StickyCtaBar.vue";
import BookForm from "~/components/BookForm.vue";
import TestimonialCards from "~/components/TestimonialCards.vue";
import BookingSteps from "~/components/BookingSteps.vue";
import {
  cityLandingPages,
  getNearbyCities,
  type CityLandingPageKey,
} from "~~/data/cityLandingPages";


const nearbyCities = computed(() => {
  if (!city.value) return [];
  return getNearbyCities(cityKey.value, 4);
});

type CityKey = keyof typeof cityLandingPages;

const route = useRoute();
const config = useRuntimeConfig();

const cityKey = computed(() => {
  const raw = String(route.params.city || "").toLowerCase();
  return raw as CityKey;
});

const city = computed(() => cityLandingPages[cityKey.value] ?? null);

const cityName = computed(() => {
  if (city.value?.name) return city.value.name;
  return String(route.params.city || "")
    .replace(/-+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
});

const baseUrl = computed(() =>
  String(config.public.siteUrl || "https://www.clearflowgutters.pro").replace(/\/+$/, "")
);

const pageUrl = computed(() => `${baseUrl.value}${route.path}`);

const testimonials = computed(() => {
  if (!city.value) return [];

  return [
    {
      quote:
        "Super straightforward—booked online and they showed up on time. Gutters were cleared fast and everything was cleaned up.",
      name: "A. R.",
      location: city.value.name,
    },
    {
      quote:
        "Flat-rate pricing was exactly what I wanted. No upsell pressure, just clean work and a tidy finish.",
      name: "J. M.",
      location: `Near ${city.value.name}`,
    },
    {
      quote:
        "Our downspouts were backing up and they got everything flowing again. The yard looked the same as before they arrived.",
      name: "K. S.",
      location: "San Gabriel Valley",
    },
  ];
});

const faq = computed(() => {
  if (!city.value) return [] as { q: string; a: string }[];

  return [
    {
      q: `How often should gutters be cleaned in ${city.value.name}?`,
      a: "Most homes benefit from 1–2 cleanings per year. Foothill-adjacent properties or lots with heavy tree coverage may need 2–3 cleanings per year—especially after windy days and fall leaf drop.",
    },
    {
      q: "Do you haul debris away?",
      a: "Yes. We bag and remove all gutter debris from your property, and we clean up the work area when we’re done.",
    },
    {
      q: "Do I need to be home?",
      a: "Not necessarily. As long as we can access the work area and you’ve left any gate/entry instructions, we can complete most cleanings while you’re away.",
    },
    {
      q: "Are you insured?",
      a: "Yes. ClearFlow Gutter Services is fully insured.",
    },
  ];
});

const bookingLink = computed(() => ({
  path: "/booking",
  query: { city: city.value?.name || String(route.params.city || "") },
}));

const SERVICE_AREA_CENTER = { lat: 34.1478, lng: -118.1445 };
const SERVICE_AREA_RADIUS_M = 40234;

const metaTitle = computed(() => {
  if (city.value?.metaTitle) return city.value.metaTitle;
  return `Gutter Cleaning in ${cityName.value}, CA | ClearFlow Gutter Services`;
});

const metaDescription = computed(() => {
  if (city.value?.metaDescription) return city.value.metaDescription;
  return `Professional gutter cleaning in ${cityName.value}, CA. Affordable pricing, fast service, and trusted local experts.`;

});

const jsonLd = computed(() => {
  if (!city.value) return null;


  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl.value}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl.value,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Areas",
        item: `${baseUrl.value}/landing-pages`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Gutter Cleaning ${city.value.name}`,
        item: pageUrl.value,
      },
    ],
  };

  const business = {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${baseUrl.value}#business`,
    name: "ClearFlow Gutter Services",
    url: baseUrl.value,
    logo: `${baseUrl.value}/favicon.ico`,
    image: `${baseUrl.value}/favicon.ico`,
    telephone: "+1-323-709-5357",
    description:
      "Professional gutter cleaning with flat-rate pricing and full debris removal throughout the San Gabriel Valley foothill communities.",
    priceRange: "$200-$475+",
    areaServed: [
      {
        "@type": "City",
        name: city.value.name,
        address: {
          "@type": "PostalAddress",
          addressRegion: "CA",
          addressCountry: "US",
        },
      },
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: SERVICE_AREA_CENTER.lat,
          longitude: SERVICE_AREA_CENTER.lng,
        },
        geoRadius: SERVICE_AREA_RADIUS_M,
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gutter Cleaning Services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Single-story gutter cleaning",
          price: "200",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pageUrl.value,
        },
        {
          "@type": "Offer",
          name: "Two-story gutter cleaning",
          price: "300",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pageUrl.value,
        },
        {
          "@type": "Offer",
          name: "300+ ft gutter cleaning",
          price: "475",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pageUrl.value,
        },
      ],
    },
    makesOffer: {
      "@type": "Service",
      name: `Gutter Cleaning in ${city.value.name}, CA`,
      areaServed: {
        "@type": "City",
        name: city.value.name,
      },
      provider: {
        "@id": `${baseUrl.value}#business`,
      },
    },
    potentialAction: {
      "@type": "ReserveAction",
      name: "Book Gutter Cleaning",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl.value}/booking?city=${encodeURIComponent(city.value.name)}`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  };

  const faqPage =
    faq.value.length > 0
      ? {
        "@type": "FAQPage",
        "@id": `${pageUrl.value}#faq`,
        mainEntity: faq.value.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": faqPage ? [business, faqPage, breadcrumb] : [business, breadcrumb],
  };
});

useSeoMeta(() => {
  if (!city.value) {
    return {
      title: "Gutter Cleaning | ClearFlow Gutter Services",
      robots: "noindex, nofollow",
    };
  }

  return {
    title: metaTitle.value,
    description: metaDescription.value,
    ogTitle: metaTitle.value,
    ogDescription: metaDescription.value,
    ogUrl: pageUrl.value,
    ogImage: `${baseUrl.value}/favicon.ico`,
    robots: "index, follow",
  };
});

useHead(() => {
  if (!city.value) {
    return {
      link: [{ rel: "canonical", href: pageUrl.value }],
      meta: [{ name: "robots", content: "noindex, nofollow" }],
    };
  }

  return {
    link: [{ rel: "canonical", href: pageUrl.value }],
    script: jsonLd.value
      ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd.value),
        },
      ]
      : [],
  };
});


function distance(a: any, b: any) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}


</script>
