const QUICKLIST_STORAGE_KEY = "clearflow:quicklist:v1";

const quicklistIds = ref<string[]>([]);
const quicklistReady = ref(false);
let listenerAttached = false;

function parseStoredIds(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === "string" && id.trim().length > 0))];
  } catch {
    return [];
  }
}

function persist() {
  if (!import.meta.client) return;
  localStorage.setItem(QUICKLIST_STORAGE_KEY, JSON.stringify(quicklistIds.value));
}

export function useQuicklist() {
  function hydrate() {
    if (!import.meta.client || quicklistReady.value) return;
    quicklistIds.value = parseStoredIds(localStorage.getItem(QUICKLIST_STORAGE_KEY));
    quicklistReady.value = true;

    if (!listenerAttached) {
      window.addEventListener("storage", (event) => {
        if (event.key === QUICKLIST_STORAGE_KEY) {
          quicklistIds.value = parseStoredIds(event.newValue);
        }
      });
      listenerAttached = true;
    }
  }

  function has(id: string) {
    return quicklistIds.value.includes(id);
  }

  function add(id: string) {
    hydrate();
    if (has(id)) return;
    quicklistIds.value = [...quicklistIds.value, id];
    persist();
  }

  function remove(id: string) {
    hydrate();
    quicklistIds.value = quicklistIds.value.filter((item) => item !== id);
    persist();
  }

  function toggle(id: string) {
    if (has(id)) remove(id);
    else add(id);
  }

  function clear() {
    quicklistIds.value = [];
    persist();
  }

  function replace(ids: string[]) {
    quicklistIds.value = [...new Set(ids)];
    persist();
  }

  onMounted(hydrate);

  return {
    ids: readonly(quicklistIds),
    count: computed(() => quicklistIds.value.length),
    ready: readonly(quicklistReady),
    hydrate,
    has,
    add,
    remove,
    toggle,
    clear,
    replace,
  };
}
