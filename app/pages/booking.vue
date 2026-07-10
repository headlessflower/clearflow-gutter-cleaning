<template>
    <main
        class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900"
    >
        <section
            class="container mx-auto grid gap-10 px-6 pb-20 pt-10 lg:grid-cols-5"
        >
            <!-- Intro -->
            <div class="lg:col-span-2">
                <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Book Your Cleaning
                </h1>
                <p class="mt-3 text-slate-700">
                    Fill in a few details and we’ll confirm your appointment by
                    phone or email. Serving Los Angeles County and San
                    Bernardino County.
                </p>

                <ul class="mt-6 space-y-3 text-sm text-slate-700">
                    <li class="flex items-start gap-2">
                        <span class="mt-0.5">✔</span> Flat, transparent rates
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="mt-0.5">✔</span> Professional & safe
                        ladder work
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="mt-0.5">✔</span> Friendly, reliable local
                        service
                    </li>
                </ul>

                <div class="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                    <a
                        href="tel:+13237095357"
                        class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold shadow-sm hover:border-cyan-300"
                        >Call (323) 709‑75357</a
                    >
                    <a
                        href="mailto:solarsustain@gmail.com?subject=Gutter%20Cleaning%20Booking"
                        class="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white shadow hover:bg-cyan-700"
                        >Email Us</a
                    >
                </div>
            </div>

            <!-- Form -->
            <div class="lg:col-span-3">
                <BookForm :prefill-city="cityFromLanding" :prefill-zip="zipFromLanding" />
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
useHead({
    title: "Book Gutter Cleaning | ClearFlow",
    meta: [
        {
            name: "description",
            content:
                "Flat-rate gutter cleaning in Los Angeles & San Bernardino Counties. Book online and we'll confirm your appointment.",
        },
    ],
});
const route = useRoute();
const cityFromLanding = computed(() => String(route.query.city || ""));
const zipFromLanding = computed(() => String(route.query.zip || ""));
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}
</style>
