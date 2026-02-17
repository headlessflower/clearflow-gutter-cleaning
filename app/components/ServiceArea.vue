<template>
  <section aria-labelledby="service-area-heading" class="py-16 bg-slate-50 border-t border-slate-200">
    <div class="container mx-auto px-6">
      <div class="text-center">
        <h2 id="service-area-heading" class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Our Service Area
        </h2>
        <p class="mt-3 text-lg text-slate-700 m">
          ClearFlow Gutter Cleaning proudly serves homeowners throughout
          <span class="font-semibold">Los Angeles County</span> and
          <span class="font-semibold">San Bernardino County</span>.
        </p>
      </div>

      <!-- Quick county blurbs -->
      <div class="mt-10 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-xl font-bold text-slate-900">Los Angeles County</h3>
          <p class="mt-2 text-slate-600 text-sm">
            San Gabriel Valley, Pasadena, Alhambra, Glendora, Claremont, and more.
          </p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-xl font-bold text-slate-900">San Bernardino County</h3>
          <p class="mt-2 text-slate-600 text-sm">
            Ontario, Rancho Cucamonga, Upland, Chino Hills, and nearby communities.
          </p>
        </article>
      </div>

      <!-- Map container -->
      <div class="mt-12">
        <div class="mx-auto max-w-5xl">
          <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
            <div class="grid gap-4 md:grid-cols-2">
              <!-- LA County Map -->
              <figure class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <picture>
                  <!-- Optional modern formats if you add them -->
                  <source srcset="/los-ang-map.png" type="image/webp" />
                  <img
                      src="/los-ang-map.png"
                      alt="Service area map highlighting Los Angeles County"
                      class="block h-full w-full object-cover"
                      loading="lazy"
                  />
                </picture>
                <figcaption class="px-4 py-3 text-sm text-slate-600">Los Angeles County coverage</figcaption>
              </figure>

              <!-- San Bernardino County Map -->
              <figure class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <picture>
                  <source srcset="/san-berbardino-map.png" type="image/webp" />
                  <img
                      src="/san-berbardino-map.png"
                      alt="Service area map highlighting San Bernardino County"
                      class="block h-full w-full object-cover"
                      loading="lazy"
                  />
                </picture>
                <figcaption class="px-4 py-3 text-sm text-slate-600">San Bernardino County coverage</figcaption>
              </figure>
            </div>

            <!-- Callout below maps -->
            <div class="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
              <p class="text-slate-700">
                Not sure if you're in range? Share your cross streets and we'll confirm availability.
              </p>
              <div class="flex flex-wrap gap-3">
                <a href="/booking" class="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-3 text-white font-semibold shadow hover:bg-cyan-700">Book a Cleaning</a>
                <a href="tel:+13237095357" class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm hover:border-cyan-300">Call (323) 709‑5357</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* No extra styles required; Tailwind handles layout & spacing */
</style>
