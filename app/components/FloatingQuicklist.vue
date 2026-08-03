<template>
  <div v-if="ready && count" class="quicklist-float">
    <Transition name="quicklist-panel">
      <section
        v-if="isOpen"
        id="floating-quicklist-panel"
        class="quicklist-float__panel"
        aria-label="Quicklist preview"
      >
        <div class="quicklist-float__header">
          <div>
            <p class="quicklist-float__eyebrow">Saved companies</p>
            <h2 class="quicklist-float__title">Your Quicklist</h2>
          </div>
          <button class="quicklist-float__close" type="button" aria-label="Close Quicklist preview" @click="isOpen = false">
            ×
          </button>
        </div>

        <ul class="quicklist-float__items">
          <li v-for="cleaner in cleaners" :key="cleaner.id" class="quicklist-float__item">
            <NuxtLink class="quicklist-float__company" :to="`/cleaners/${cleaner.slug}`" @click="isOpen = false">
              {{ cleaner.companyName }}
            </NuxtLink>
            <button class="quicklist-float__remove" type="button" :aria-label="`Remove ${cleaner.companyName} from Quicklist`" @click="removeCleaner(cleaner.id)">
              Remove
            </button>
          </li>
        </ul>

        <div class="quicklist-float__actions">
          <NuxtLink class="quicklist-float__secondary" to="/quicklist" @click="isOpen = false">View Quicklist</NuxtLink>
          <NuxtLink class="quicklist-float__primary" to="/booking" @click="startBooking">Request Quotes</NuxtLink>
        </div>
      </section>
    </Transition>

    <button
      class="quicklist-float__trigger"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="floating-quicklist-panel"
      @click="togglePanel"
    >
      <span class="quicklist-float__icon" aria-hidden="true">✓</span>
      <span>Quicklist</span>
      <span class="quicklist-float__count">{{ count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { partnerCleaners } from "~~/data/partnerCleaners";

const route = useRoute();
const { ids, count, ready, remove } = useQuicklist();
const isOpen = ref(false);
const cleaners = computed(() => partnerCleaners.filter((cleaner) => ids.value.includes(cleaner.id)));

watch(() => route.fullPath, () => {
  isOpen.value = false;
});

watch(count, (value) => {
  if (!value) isOpen.value = false;
});

function togglePanel() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) useTrackEvent("quicklist_float_open", { quicklist_size: count.value });
}

function removeCleaner(id: string) {
  remove(id);
  useTrackEvent("quicklist_remove", { company_id: id, quicklist_size: count.value });
}

function startBooking() {
  isOpen.value = false;
  useTrackEvent("quicklist_booking_start", { quicklist_size: count.value, source: "floating_quicklist" });
}
</script>

<style scoped>
.quicklist-float {
  position: fixed;
  right: max(16px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.quicklist-float__trigger {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  gap: 9px;
  border: 1px solid #0f766e;
  border-radius: 999px;
  background: #0f766e;
  padding: 8px 10px 8px 14px;
  color: white;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  cursor: pointer;
}

.quicklist-float__trigger:hover { background: #115e59; }

.quicklist-float__icon {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.quicklist-float__count {
  display: inline-flex;
  min-width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #fef3c7;
  color: #292524;
}

.quicklist-float__panel {
  width: min(370px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid #d6d3d1;
  border-radius: 16px;
  background: white;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.22);
}

.quicklist-float__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-bottom: 1px solid #e7e5e4;
}

.quicklist-float__eyebrow { margin: 0; color: #0f766e; font-size: 10px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; }
.quicklist-float__title { margin: 4px 0 0; color: #1c1917; font-size: 20px; font-weight: 900; }
.quicklist-float__close { border: 0; background: transparent; color: #57534e; font-size: 28px; line-height: 1; cursor: pointer; }

.quicklist-float__items {
  max-height: min(300px, 40vh);
  margin: 0;
  padding: 8px 18px;
  overflow-y: auto;
  list-style: none;
}

.quicklist-float__item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid #f5f5f4; }
.quicklist-float__item:last-child { border-bottom: 0; }
.quicklist-float__company { color: #292524; font-size: 14px; font-weight: 800; text-decoration: none; }
.quicklist-float__company:hover { color: #0f766e; }
.quicklist-float__remove { border: 0; background: transparent; color: #78716c; font-size: 11px; font-weight: 800; text-decoration: underline; cursor: pointer; }

.quicklist-float__actions { display: grid; grid-template-columns: 1fr 1.2fr; gap: 8px; padding: 14px 18px 18px; background: #fafaf9; }
.quicklist-float__secondary, .quicklist-float__primary { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; border-radius: 9px; padding: 8px 10px; font-size: 12px; font-weight: 900; text-align: center; text-decoration: none; }
.quicklist-float__secondary { border: 1px solid #d6d3d1; background: white; color: #292524; }
.quicklist-float__primary { background: #0f766e; color: white; }

.quicklist-panel-enter-active, .quicklist-panel-leave-active { transition: opacity 150ms ease, transform 150ms ease; }
.quicklist-panel-enter-from, .quicklist-panel-leave-to { opacity: 0; transform: translateY(8px) scale(0.98); }

@media (max-width: 640px) {
  .quicklist-float { bottom: max(12px, env(safe-area-inset-bottom)); }
  .quicklist-float__panel { max-height: calc(100vh - 100px); }
}
</style>
