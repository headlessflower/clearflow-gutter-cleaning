<template>
    <main v-if="city" class="min-h-screen bg-slate-50">
        <!-- Hero -->
        <section class="bg-slate-900 text-white">
            <div
                class="mx-auto max-w-6xl px-4 py-16 lg:flex lg:items-center lg:gap-12"
            >
                <div class="flex-1">
                    <p
                        class="text-sm font-semibold uppercase tracking-wide text-amber-300"
                    >
                        Gutter Cleaning {{ city.name }}, CA
                    </p>

                    <h1 class="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Keep Your {{ city.name }} Gutters Flowing with ClearFlow
                    </h1>

                    <p class="mt-4 text-base text-slate-200 sm:text-lg">
                        {{ city.metaDescription }}
                    </p>

                    <div class="mt-8 flex flex-wrap items-center gap-4">
                        <NuxtLink
                            :to="bookingLink"
                            class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition"
                        >
                            Book {{ city.name }} Gutter Cleaning
                        </NuxtLink>

                        <a
                            href="#pricing"
                            class="text-sm font-semibold text-amber-200 hover:text-amber-100"
                        >
                            View flat-rate pricing →
                        </a>
                    </div>

                    <dl
                        class="mt-8 grid grid-cols-1 gap-4 text-sm text-slate-200 sm:grid-cols-3"
                    >
                        <div
                            class="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4"
                        >
                            <dt class="font-semibold">Flat-rate pricing</dt>
                            <dd class="mt-1">
                                Know your total before we arrive.
                            </dd>
                        </div>
                        <div
                            class="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4"
                        >
                            <dt class="font-semibold">Full debris removal</dt>
                            <dd class="mt-1">We haul away the mess.</dd>
                        </div>
                        <div
                            class="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4"
                        >
                            <dt class="font-semibold">Fast local service</dt>
                            <dd class="mt-1">
                                Serving {{ city.name }} &amp; the foothills.
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Right card: force to booking (no phone CTA) -->
                <div class="mt-10 w-full max-w-md flex-1 lg:mt-0">
                    <div
                        class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/20"
                    >
                        <h2 class="text-lg font-semibold text-slate-900">
                            Ready to schedule?
                        </h2>
                        <p class="mt-2 text-sm text-slate-500">
                            Book online in under a minute. We’ll confirm details
                            after you submit.
                        </p>

                        <div class="mt-5">
                            <NuxtLink
                                :to="bookingLink"
                                class="inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition"
                            >
                                Go to Booking
                            </NuxtLink>
                        </div>

                        <p class="mt-3 text-xs text-slate-500">
                            This will prefill your city:
                            <span class="font-semibold">{{ city.name }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Section -->
        <section class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
            <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                    <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Why {{ city.name }} Homeowners Choose ClearFlow
                    </h2>

                    <p class="mt-4 text-sm text-slate-600 sm:text-base">
                        {{ city.whyIntro }}
                    </p>

                    <ul
                        class="mt-6 space-y-3 text-sm text-slate-700 sm:text-base"
                    >
                        <li class="flex gap-2">
                            <span
                                class="mt-1 h-2 w-2 rounded-full bg-amber-400"
                            ></span>
                            <span
                                ><strong>Flat-rate pricing</strong> with no
                                upsells at the door</span
                            >
                        </li>
                        <li class="flex gap-2">
                            <span
                                class="mt-1 h-2 w-2 rounded-full bg-amber-400"
                            ></span>
                            <span
                                ><strong>Full debris removal</strong> – we bag
                                and haul away the mess</span
                            >
                        </li>
                        <li class="flex gap-2">
                            <span
                                class="mt-1 h-2 w-2 rounded-full bg-amber-400"
                            ></span>
                            <span
                                ><strong>Before &amp; after photos</strong>
                                available on request</span
                            >
                        </li>
                        <li class="flex gap-2">
                            <span
                                class="mt-1 h-2 w-2 rounded-full bg-amber-400"
                            ></span>
                            <span>
                                <strong>Local to the foothills</strong> – we
                                know the leaf drop patterns in {{ city.name }}
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- Neighborhoods -->
                <div
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <h3 class="text-lg font-semibold text-slate-900">
                        {{ city.name }} Areas We Serve
                    </h3>
                    <p class="mt-2 text-sm text-slate-600">
                        We cover {{ city.name }} and nearby foothill
                        neighborhoods.
                    </p>

                    <div
                        class="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3"
                    >
                        <span
                            v-for="area in city.areas"
                            :key="area"
                            class="rounded-full bg-slate-50 px-3 py-1"
                        >
                            {{ area }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section id="pricing" class="bg-white">
            <div class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
                <div
                    class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
                >
                    <div>
                        <h2
                            class="text-2xl font-bold text-slate-900 sm:text-3xl"
                        >
                            Flat-Rate Gutter Cleaning in {{ city.name }}, CA
                        </h2>
                        <p class="mt-3 text-sm text-slate-600 sm:text-base">
                            Know your price before we arrive. Pricing includes
                            full gutter cleaning and debris removal.
                        </p>
                    </div>

                    <NuxtLink
                        :to="bookingLink"
                        class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition"
                    >
                        Schedule a Cleaning
                    </NuxtLink>
                </div>

                <div class="mt-8 grid gap-6 md:grid-cols-3">
                    <div
                        class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
                    >
                        <h3 class="text-lg font-semibold text-slate-900">
                            Single-Story Homes
                        </h3>
                        <p class="mt-2 text-3xl font-bold text-slate-900">
                            $200
                        </p>
                        <p class="mt-2 text-sm text-slate-600">
                            Ideal for most one-story {{ city.name }} homes with
                            standard gutter runs.
                        </p>
                    </div>

                    <div
                        class="flex flex-col rounded-2xl border-2 border-amber-400 bg-amber-50 p-6"
                    >
                        <h3 class="text-lg font-semibold text-slate-900">
                            Two-Story Homes
                        </h3>
                        <p class="mt-2 text-3xl font-bold text-slate-900">
                            $300
                        </p>
                        <p class="mt-2 text-sm text-slate-600">
                            For multi-story homes requiring taller ladder work
                            and more time.
                        </p>
                    </div>

                    <div
                        class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
                    >
                        <h3 class="text-lg font-semibold text-slate-900">
                            Over 300 ft of Gutters
                        </h3>
                        <p class="mt-2 text-3xl font-bold text-slate-900">
                            From $475
                        </p>
                        <p class="mt-2 text-sm text-slate-600">
                            Larger properties or complex gutter systems. We
                            confirm final price before work begins.
                        </p>
                    </div>
                </div>

                <p class="mt-6 text-sm text-slate-600 sm:text-base">
                    Pricing includes hand removal of leaves, mud, and roof
                    debris; checking and clearing downspout inlets; flushing
                    downspouts as needed; and cleanup of all work areas with
                    debris haul away.
                    <span class="font-semibold"
                        >No hidden fees. No surprise add-ons.</span
                    >
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

                    <ul
                        class="mt-6 space-y-2 text-sm text-slate-700 sm:text-base"
                    >
                        <li>
                            <strong>1–2 times per year</strong> for homes with
                            moderate tree coverage.
                        </li>
                        <li>
                            <strong>2–3 times per year</strong> for heavily
                            treed lots or foothill-adjacent homes.
                        </li>
                    </ul>

                    <p class="mt-4 text-sm text-slate-700 sm:text-base">
                        Clean gutters help prevent overflow, fascia damage, roof
                        leaks, soil erosion, and foundation water issues.
                    </p>
                </div>

                <div
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <h3 class="text-lg font-semibold text-slate-900">
                        Book Your {{ city.name }} Gutter Cleaning
                    </h3>
                    <p class="mt-2 text-sm text-slate-600">
                        Schedule now and stay ahead of the next rain.
                    </p>

                    <div class="mt-6">
                        <NuxtLink
                            :to="bookingLink"
                            class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition"
                        >
                            Schedule Your Cleaning
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- If city not found -->
    <main v-else class="min-h-screen bg-slate-50">
        <section class="mx-auto max-w-3xl px-4 py-20">
            <h1 class="text-2xl font-bold text-slate-900">
                City page not found
            </h1>
            <p class="mt-3 text-slate-600">
                That city isn’t in our service list yet.
            </p>
            <div class="mt-6">
                <NuxtLink
                    to="/booking"
                    class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition"
                >
                    Go to Booking
                </NuxtLink>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead, useRoute, useRuntimeConfig } from "#imports";
import { cityLandingPages } from "~~/data/cityLandingPages";

type CityKey = keyof typeof cityLandingPages;

const route = useRoute();
const config = useRuntimeConfig();

const cityKey = computed(() => {
    const raw = String(route.params.city || "").toLowerCase();
    return raw as CityKey;
});

const city = computed(() => cityLandingPages[cityKey.value]);

// Push everyone to /booking (with city prefilled)
const bookingLink = computed(() => ({
    path: "/booking",
    query: { city: city.value?.name || String(route.params.city || "") },
}));

const baseUrl = computed(() =>
    String(config.public.siteUrl || "https://www.clearflowgutters.pro").replace(
        /\/+$/,
        "",
    ),
);

const pageUrl = computed(() => `${baseUrl.value}${route.path}`);

// Service area radius (25 miles)
const SERVICE_AREA_CENTER = { lat: 34.1478, lng: -118.1445 }; // Pasadena-ish center
const SERVICE_AREA_RADIUS_M = 40234; // 25 miles in meters

const jsonLd = computed(() => {
    if (!city.value) return null;

    return {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "@id": `${baseUrl.value}#business`,
        name: "ClearFlow Gutter Services",
        url: baseUrl.value,
        logo: `${baseUrl.value}/favicon.ico`,
        image: `${baseUrl.value}/favicon.ico`,
        description:
            "Professional gutter cleaning with flat-rate pricing and full debris removal throughout the San Gabriel Valley foothill communities.",
        priceRange: "$175-$375+",

        // City + radius-based service area
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
                    price: "175",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: pageUrl.value,
                },
                {
                    "@type": "Offer",
                    name: "Two-story gutter cleaning",
                    price: "275",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: pageUrl.value,
                },
                {
                    "@type": "Offer",
                    name: "300+ ft gutter cleaning",
                    price: "375",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: pageUrl.value,
                },
            ],
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
});

useHead(() => {
    if (!city.value) {
        return {
            title: "Gutter Cleaning | ClearFlow Gutter Services",
            meta: [{ name: "robots", content: "noindex" }],
        };
    }

    return {
        title: city.value.metaTitle,
        meta: [
            { name: "description", content: city.value.metaDescription },

            // OpenGraph (nice for sharing)
            { property: "og:title", content: city.value.metaTitle },
            { property: "og:description", content: city.value.metaDescription },
            { property: "og:url", content: pageUrl.value },
            { property: "og:image", content: `${baseUrl.value}/favicon.ico` },
        ],
        link: [
            // Canonical for this city page
            { rel: "canonical", href: pageUrl.value },
        ],
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
</script>
