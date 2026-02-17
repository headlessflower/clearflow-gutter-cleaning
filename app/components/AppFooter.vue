<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <p class="footer__name">ClearFlow Gutter Services</p>
        <p class="footer__tagline">
          Professional gutter cleaning for homes in Southern California.
        </p>
      </div>

      <nav class="footer__links" aria-label="Footer">
        <NuxtLink :to="bookingsHref" class="footer__link">Book Service</NuxtLink>
        <NuxtLink :to="jobsHref" class="footer__link">Jobs</NuxtLink>
      </nav>

      <div class="footer__meta">
        <p class="footer__small">© {{ year }} ClearFlow. All rights reserved.</p>
        <p class="footer__small footer__small--muted">
          built by <a href="https://headlessflower.dev">headlessflower</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const year = new Date().getFullYear();

type MarketKey = "la" | "sb" | "default";

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
</script>

<style scoped>
.footer {
  background: #f2f2f0;
  border-top: 1px solid rgba(10, 10, 10, 0.1);
}

.footer__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 26px 16px;
  display: grid;
  gap: 16px;
}

.footer__name {
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.02em;
  color: #0a0a0a;
}

.footer__tagline {
  margin: 6px 0 0;
  color: rgba(10, 10, 10, 0.65);
  line-height: 1.6;
  font-size: 14px;
  max-width: 60ch;
}

.footer__links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.footer__link {
  text-decoration: none;
  font-weight: 900;
  font-size: 13px;
  color: rgba(10, 10, 10, 0.78);
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(10, 10, 10, 0.12);
  background: #ffffff;
}

.footer__link:hover {
  color: #0a0a0a;
  border-color: rgba(10, 10, 10, 0.22);
}

.footer__meta {
  padding-top: 6px;
  border-top: 1px solid rgba(10, 10, 10, 0.08);
}

.footer__small {
  margin: 8px 0 0;
  font-size: 12px;
  color: rgba(10, 10, 10, 0.62);
}

.footer__small--muted {
  color: rgba(10, 10, 10, 0.5);
}

@media (min-width: 880px) {
  .footer__inner {
    grid-template-columns: 1.3fr 1fr 1fr;
    align-items: start;
  }
  .footer__meta {
    border-top: none;
    padding-top: 0;
  }
}
</style>
