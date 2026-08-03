<template>
  <button
    type="button"
    :aria-pressed="saved"
    :aria-label="saved ? `Remove ${companyName} from Quicklist` : `Add ${companyName} to Quicklist`"
    :class="[
      'inline-flex items-center justify-center rounded-md border px-4 py-3 text-sm font-black uppercase tracking-wide transition',
      saved
        ? 'border-amber-400 bg-amber-100 text-stone-950 hover:bg-amber-200'
        : 'border-stone-300 bg-white text-stone-900 hover:border-teal-700 hover:text-teal-800',
    ]"
    @click="handleToggle"
  >
    <span aria-hidden="true" class="mr-2">{{ saved ? "✓" : "+" }}</span>
    {{ saved ? "Saved to Quicklist" : "Add to Quicklist" }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  cleanerId: string;
  companyName: string;
}>();

const { has, toggle, count } = useQuicklist();
const saved = computed(() => has(props.cleanerId));

function handleToggle() {
  const wasSaved = saved.value;
  toggle(props.cleanerId);
  useTrackEvent(wasSaved ? "quicklist_remove" : "quicklist_add", {
    company_id: props.cleanerId,
    quicklist_size: count.value,
  });
}
</script>
