<template>
  <section class="home-hero">
    <div class="home-hero__inner">
      <!-- Copy -->
      <div class="home-hero__copy">
        <p class="home-hero__kicker">{{ kicker }}</p>

        <h1 class="home-hero__title">
          {{ title }}
        </h1>

        <p class="home-hero__subtitle">
          {{ subtitle }}
        </p>

        <div class="home-hero__cta-row">
          <NuxtLink :to="bookingsHref" class="home-hero__cta">
            Book a Cleaning
            <span class="home-hero__cta-icon" aria-hidden="true">↗</span>
          </NuxtLink>

          <NuxtLink :to="jobsHref" class="home-hero__cta home-hero__cta--ghost">
            We’re hiring
          </NuxtLink>
        </div>

        <ul class="home-hero__checks" aria-label="Highlights">
          <li>Fast scheduling</li>
          <li>Before/after photos</li>
          <li>Respectful, tidy crews</li>
          <li>Clear pricing</li>
        </ul>
      </div>

      <!-- Before/After media -->
      <figure class="home-hero__media" aria-label="Before and after gutter cleaning">
        <div class="home-hero__media-grid">
          <div class="home-hero__shot">
            <div class="home-hero__badge">Before</div>
            <img
                class="home-hero__img"
                :src="beforeImageSrc"
                :alt="beforeAlt"
                loading="lazy"
            />
            <p class="home-hero__caption">Clogged gutters cause overflow and staining.</p>
          </div>

          <div class="home-hero__shot">
            <div class="home-hero__badge">After</div>
            <img
                class="home-hero__img"
                :src="afterImageSrc"
                :alt="afterAlt"
                loading="lazy"
            />
            <p class="home-hero__caption">Clean channels + proper drainage restored.</p>
          </div>
        </div>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

type MarketKey = "la" | "sb" | "default";

const route = useRoute();

/**
 * Same market logic as the nav/footer:
 * - /la/* or /sb/* => market prefix
 * - ?market=la|sb => market hint
 */
const market = computed<MarketKey>(() => {
  const p = String(route.path || "");
  if (p === "/la" || p.startsWith("/la/")) return "la";
  if (p === "/sb" || p.startsWith("/sb/")) return "sb";

  const q = String(route.query.market || "");
  if (q === "la") return "la";
  if (q === "sb") return "sb";

  return "default";
});

const marketBase = computed(() => {
  if (market.value === "la") return "/la";
  if (market.value === "sb") return "/sb";
  return "";
});

const bookingsHref = computed(() => `${marketBase.value}/booking`);
const jobsHref = computed(() => `${marketBase.value}/jobs`);

withDefaults(
    defineProps<{
      kicker?: string;
      title?: string;
      subtitle?: string;

      // Put images in /public/images/
      beforeImageSrc?: string;
      afterImageSrc?: string;

      beforeAlt?: string;
      afterAlt?: string;
    }>(),
    {
      kicker: "ClearFlow Gutter Services",
      title: "Gutter cleaning that prevents expensive water damage.",
      subtitle:
          "We clear debris, flush downspouts, and leave your property tidy. Book in minutes and get clean, documented results.",
      beforeImageSrc: "/clearflow-before.png",
      afterImageSrc: "/clearflow-after.png",
      beforeAlt: "Before: clogged gutter filled with leaves and debris",
      afterAlt: "After: clean gutter channel with debris removed",
    }
);
</script>

<style scoped>
.home {
  background: #f2f2f0;
  color: #0a0a0a;
  min-height: 100vh;
}

.home__content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 16px 60px;
}
.home-hero {
  border-bottom: 1px solid rgba(10, 10, 10, 0.12);
  background: rgba(242, 242, 240, 0.9);
}

.home-hero__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 54px 16px 34px;
  display: grid;
  gap: 18px;
}

.home-hero__kicker {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.55);
  font-weight: 800;
}

.home-hero__title {
  margin: 0;
  font-size: 40px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-weight: 950;
  color: #0a0a0a;
  max-width: 20ch;
}

.home-hero__subtitle {
  margin: 14px 0 0;
  max-width: 70ch;
  color: rgba(10, 10, 10, 0.75);
  font-size: 16px;
  line-height: 1.65;
}

.home-hero__cta-row {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.home-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 2px solid rgba(10, 10, 10, 0.25);
  background: #ffffff;
  color: #0a0a0a;
  text-decoration: none;
  font-weight: 950;
  letter-spacing: 0.02em;
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.15);
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.home-hero__cta:hover {
  transform: translateY(-1px);
  border-color: rgba(10, 10, 10, 0.4);
  box-shadow: 0 3px 0 rgba(10, 10, 10, 0.18);
}

.home-hero__cta-icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(10, 10, 10, 0.18);
  font-size: 13px;
  line-height: 1;
}

.home-hero__cta--ghost {
  background: transparent;
  border-color: rgba(10, 10, 10, 0.18);
  box-shadow: none;
}

.home-hero__checks {
  margin: 16px 0 0;
  padding-left: 18px;
  color: rgba(10, 10, 10, 0.72);
  line-height: 1.7;
  font-size: 14px;
}

/* Media */
.home-hero__media {
  margin: 0;
}

.home-hero__media-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.home-hero__shot {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(10, 10, 10, 0.12);
  background: #ffffff;
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.06);
}

.home-hero__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(10, 10, 10, 0.14);
  background: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.85);
}

.home-hero__img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}

.home-hero__caption {
  margin: 0;
  padding: 12px 14px 14px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(10, 10, 10, 0.68);
  border-top: 1px solid rgba(10, 10, 10, 0.08);
}

@media (min-width: 980px) {
  .home-hero__inner {
    grid-template-columns: 1.05fr 0.95fr;
    align-items: start;
    gap: 22px;
  }

  .home-hero__media-grid {
    grid-template-columns: 1fr 1fr;
  }

  .home-hero__img {
    height: 240px;
  }
}
</style>
