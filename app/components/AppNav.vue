<template>
  <header class="nav" :class="{ 'nav--open': isOpen }">
    <div class="nav__inner">
      <!-- Brand -->
      <NuxtLink :to="homeHref" class="nav__brand" @click="close()">
        ClearFlow
        <span class="nav__brand-accent">Gutter Services</span>
      </NuxtLink>

      <!-- Desktop links -->
      <nav class="nav__links" aria-label="Primary">
        <NuxtLink
            :to="bookingsHref"
            class="nav__link"
            active-class="nav__link--active"
        >
          Find Cleaners
        </NuxtLink>

        <NuxtLink
            :to="cleanerLeadsHref"
            class="nav__link"
            active-class="nav__link--active"
        >
          For Cleaners
        </NuxtLink>

        <NuxtLink to="/quicklist" class="nav__link" active-class="nav__link--active">
          Quicklist <span v-if="quicklistCount" class="nav__count">{{ quicklistCount }}</span>
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="nav__right">
        <!-- Desktop CTA -->
        <NuxtLink :to="bookingsHref" class="nav__cta">
          Request Quotes
        </NuxtLink>

        <!-- Mobile toggle -->
        <button
            class="nav__toggle"
            type="button"
            :aria-expanded="isOpen ? 'true' : 'false'"
            aria-controls="nav-mobile"
            @click="toggle()"
        >
          <span class="nav__toggle-label sr-only">Toggle menu</span>
          <span class="nav__burger" aria-hidden="true">
            <span class="nav__burger-line"></span>
            <span class="nav__burger-line"></span>
            <span class="nav__burger-line"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile panel -->
    <div id="nav-mobile" class="nav__mobile" :hidden="!isOpen">
      <div class="nav__mobile-inner">
        <NuxtLink
            :to="bookingsHref"
            class="nav__mobile-link"
            active-class="nav__mobile-link--active"
            @click="close()"
        >
          Find Cleaners
        </NuxtLink>

        <NuxtLink
            :to="cleanerLeadsHref"
            class="nav__mobile-link"
            active-class="nav__mobile-link--active"
            @click="close()"
        >
          For Cleaners
        </NuxtLink>

        <NuxtLink to="/quicklist" class="nav__mobile-link" active-class="nav__mobile-link--active" @click="close()">
          Quicklist <span v-if="quicklistCount" class="nav__count">{{ quicklistCount }}</span>
        </NuxtLink>

        <NuxtLink :to="bookingsHref" class="nav__mobile-cta" @click="close()">
          Request Quotes
          <span class="nav__cta-icon" aria-hidden="true">↗</span>
        </NuxtLink>

        <p class="nav__market-note" v-if="marketLabel">
          Market: <strong>{{ marketLabel }}</strong>
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

type MarketKey = "la" | "sb" | "default";

const route = useRoute();
const isOpen = ref(false);
const { count: quicklistCount } = useQuicklist();

/**
 * Market detection strategy (no assumptions about your routing):
 * - If path starts with /la or /sb, treat that as market prefix
 * - Else, if query ?market=la|sb exists, use it
 * - Else default
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

const marketLabel = computed(() => {
  if (market.value === "la") return "Los Angeles";
  if (market.value === "sb") return "San Bernardino";
  return "";
});

const homeHref = computed(() => `${marketBase.value || "/"}`);
const bookingsHref = computed(() => `${marketBase.value}/booking`);
const cleanerLeadsHref = "/gutter-cleaning-leads";

function open() {
  isOpen.value = true;
  document.documentElement.style.overflow = "hidden";
}

function close() {
  isOpen.value = false;
  document.documentElement.style.overflow = "";
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) close();
}

// Close menu on route changes
watch(
    () => route.fullPath,
    () => {
      if (isOpen.value) close();
    }
);

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
/* a11y utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(242, 242, 240, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(10, 10, 10, 0.1);
}

.nav__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.nav__brand {
  text-decoration: none;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: 18px;
  color: #0a0a0a;
}

.nav__brand-accent {
  display: block;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.55);
  font-weight: 700;
  margin-top: 2px;
}

/* Desktop links */
.nav__links {
  display: none;
  align-items: center;
  gap: 22px;
}

.nav__link {
  position: relative;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  color: rgba(10, 10, 10, 0.72);
  padding: 8px 2px;
  transition: color 140ms ease;
}

/* Smooth underline animation */
.nav__link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 2px;
  border-radius: 2px;
  background: rgba(10, 10, 10, 0.82);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 160ms ease;
  opacity: 0.9;
}

.nav__link:hover {
  color: #0a0a0a;
}

.nav__link:hover::after {
  transform: scaleX(1);
}

.nav__link--active {
  color: #0a0a0a;
}

.nav__link--active::after {
  transform: scaleX(1);
}

.nav__count {
  display: inline-flex;
  min-width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  border-radius: 999px;
  background: #fef3c7;
  color: #292524;
  font-size: 11px;
}

.nav__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Desktop CTA */
.nav__cta {
  display: none;
  text-decoration: none;
  padding: 10px 14px;
  border-radius: 14px;
  border: 2px solid rgba(10, 10, 10, 0.25);
  background: #ffffff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.03em;
  color: #0a0a0a;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.15);
}

.nav__cta:hover {
  transform: translateY(-1px);
  border-color: rgba(10, 10, 10, 0.4);
  box-shadow: 0 3px 0 rgba(10, 10, 10, 0.18);
}

/* Mobile toggle */
.nav__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 40px;
  border-radius: 14px;
  border: 2px solid rgba(10, 10, 10, 0.18);
  background: #ffffff;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.12);
}

.nav__toggle:hover {
  transform: translateY(-1px);
  border-color: rgba(10, 10, 10, 0.32);
  box-shadow: 0 3px 0 rgba(10, 10, 10, 0.16);
}

.nav__burger {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
}

.nav__burger-line {
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: rgba(10, 10, 10, 0.9);
}

/* Mobile panel */
.nav__mobile {
  border-top: 1px solid rgba(10, 10, 10, 0.08);
  background: rgba(242, 242, 240, 0.98);
}

.nav__mobile-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 16px 16px;
  display: grid;
  gap: 10px;
}

.nav__mobile-link {
  text-decoration: none;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(10, 10, 10, 0.12);
  background: #ffffff;
  font-weight: 900;
  color: rgba(10, 10, 10, 0.85);
}

.nav__mobile-link--active {
  border-color: rgba(10, 10, 10, 0.28);
}

.nav__mobile-cta {
  margin-top: 4px;
  text-decoration: none;
  padding: 12px 12px;
  border-radius: 14px;
  border: 2px solid rgba(10, 10, 10, 0.22);
  background: #ffffff;
  font-weight: 950;
  color: #0a0a0a;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
}

.nav__cta-icon {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(10, 10, 10, 0.18);
  font-size: 13px;
}

.nav__market-note {
  margin: 6px 2px 0;
  font-size: 13px;
  color: rgba(10, 10, 10, 0.6);
}

/* Desktop breakpoint */
@media (min-width: 880px) {
  .nav__links {
    display: inline-flex;
  }
  .nav__cta {
    display: inline-flex;
  }
  .nav__toggle {
    display: none;
  }
  .nav__mobile {
    display: none;
  }
}
</style>
