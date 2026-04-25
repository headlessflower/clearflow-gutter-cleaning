<template>
  <main class="admin">
    <header class="admin__header">
      <div class="admin__title">
        <h1>Admin · Pipeline</h1>
        <p>Leads → Contacted → Scheduled → Completed</p>
      </div>

      <div class="admin__controls">
        <input
            v-model.trim="q"
            class="admin__search"
            type="search"
            placeholder="Search name, phone, email, city…"
        />
        <button class="btn btn--ghost" :disabled="loading" @click="refresh">
          Refresh
        </button>
      </div>
    </header>

    <nav class="tabs" aria-label="Pipeline tabs">
      <button
          v-for="t in TABS"
          :key="t.key"
          class="tabs__tab"
          :class="{ 'tabs__tab--active': tab === t.key }"
          @click="tab = t.key"
      >
        {{ t.label }}
        <span class="tabs__count">{{ counts[t.key] ?? 0 }}</span>
      </button>
    </nav>

    <section class="panel">
      <div class="panel__meta">
        <div class="panel__left">
          <strong>{{ activeLabel }}</strong>
          <span v-if="tab === 'scheduled'">· sorted by soonest</span>
          <span v-else>· newest first</span>
          <span v-if="q">· filtered</span>
        </div>
        <div class="panel__right">
          <span v-if="loading">Loading…</span>
          <span v-else-if="error" class="err">{{ error }}</span>
        </div>
      </div>

      <div class="tablewrap">
        <table class="table">
          <thead>
          <tr>
            <th>Customer</th>
            <th>City</th>
            <th>Preferred</th>
            <th v-if="tab === 'scheduled'">Scheduled for</th>
            <th>Quote</th>
            <th>Status</th>
            <th class="table__actions"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-if="!loading && rows.length === 0">
            <td colspan="7" class="empty">No results.</td>
          </tr>

          <tr v-for="r in rows" :key="r.id">
            <td>
              <div class="who">
                <div class="who__name">{{ r.name }}</div>
                <div class="who__sub">
                  <a :href="`tel:${r.phone}`">{{ r.phone }}</a>
                  <span> · </span>
                  <a :href="`mailto:${r.email}`">{{ r.email }}</a>
                </div>
              </div>

              <details class="details">
                <summary>Details</summary>
                <div class="details__grid">
                  <div>
                    <div class="k">Address</div>
                    <div class="v">{{ r.address }}</div>
                  </div>
                  <div>
                    <div class="k">Service</div>
                    <div class="v">
                      {{ serviceLabel(r.service_type) }}
                      <span v-if="r.approx_ft"> · {{ r.approx_ft }} ft</span>
                    </div>
                  </div>
                  <div>
                    <div class="k">Add-ons</div>
                    <div class="v">{{ (r.add_ons?.length ? r.add_ons.join(", ") : "—") }}</div>
                  </div>
                  <div>
                    <div class="k">Created</div>
                    <div class="v">{{ fmt(r.created_at) }}</div>
                  </div>
                </div>

                <div class="notes">
                  <label class="notes__label">Admin notes</label>
                  <textarea
                      class="notes__input"
                      :value="r.admin_notes || ''"
                      rows="2"
                      placeholder="Gate code, access notes, follow-up notes…"
                      @change="onNotesChange(r.id, ($event.target as HTMLTextAreaElement).value)"
                  />
                </div>
              </details>
            </td>

            <td>
              <div class="cell-main">{{ r.city }}</div>
              <div class="cell-sub">{{ r.zip || "" }} {{ r.county || "" }}</div>
            </td>

            <td>
              <div class="cell-main">{{ r.preferred_date || "—" }}</div>
              <div class="cell-sub" v-if="r.contacted_at && tab !== 'lead'">
                contacted {{ fmt(r.contacted_at) }}
              </div>
            </td>

            <td v-if="tab === 'scheduled'">
              <div class="cell-main">{{ r.scheduled_for ? fmt(r.scheduled_for) : "—" }}</div>
              <div class="cell-sub" v-if="r.scheduled_for">
                upcoming
              </div>
            </td>

            <td>
              <div class="cell-main">{{ money(r.discounted_total_quote ?? r.total_quote) }}</div>
              <div class="cell-sub" v-if="r.discounted_total_quote">discounted</div>
            </td>

            <td>
              <span class="pill" :class="`pill--${r.status}`">{{ r.status }}</span>
            </td>

            <td class="table__actions">
              <div class="actions">
                <!-- LEAD -->
                <button
                    v-if="tab === 'lead'"
                    class="btn btn--primary"
                    :disabled="mutatingId === r.id"
                    @click="setStatus(r.id, 'contacted')"
                >
                  Mark contacted
                </button>

                <!-- CONTACTED -->
                <button
                    v-else-if="tab === 'contacted'"
                    class="btn btn--primary"
                    :disabled="mutatingId === r.id"
                    @click="openSchedule(r)"
                >
                  Schedule
                </button>

                <!-- SCHEDULED -->
                <button
                    v-else-if="tab === 'scheduled'"
                    class="btn btn--primary"
                    :disabled="mutatingId === r.id"
                    @click="setStatus(r.id, 'completed')"
                >
                  Mark completed
                </button>

                <!-- COMPLETED -->
                <button
                    v-else
                    class="btn btn--ghost"
                    :disabled="mutatingId === r.id"
                    @click="setStatus(r.id, 'scheduled')"
                    title="Reopen as scheduled"
                >
                  Reopen
                </button>

                <button
                    class="btn btn--ghost"
                    :disabled="mutatingId === r.id"
                    @click="setStatus(r.id, 'canceled')"
                    title="Cancel"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Schedule modal -->
    <div v-if="scheduleOpen" class="modal" role="dialog" aria-modal="true" @click.self="closeSchedule">
      <div class="modal__card">
        <div class="modal__head">
          <h2>Schedule job</h2>
          <button class="btn btn--ghost" @click="closeSchedule">Close</button>
        </div>

        <p class="modal__sub">
          {{ scheduleRow?.name }} · {{ scheduleRow?.city }}
        </p>

        <label class="field">
          <span class="field__label">Scheduled for</span>
          <input v-model="scheduledForLocal" class="field__input" type="datetime-local" />
          <span class="field__hint">Tip: choose local time. We’ll sort Scheduled by this value.</span>
        </label>

        <div class="modal__actions">
          <button class="btn btn--ghost" @click="closeSchedule">Cancel</button>
          <button class="btn btn--primary" :disabled="!scheduledForLocal || mutatingId" @click="confirmSchedule">
            Confirm scheduled
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,                // important for static generate + auth
  middleware: ["admin"],
});

import type {Database} from "~~/types/supabase"

const supabase = useSupabaseClient<Database>();

type TabKey = "lead" | "contacted" | "scheduled" | "completed";

type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
type Status = BookingRow["status"];


const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "lead", label: "Leads" },
  { key: "contacted", label: "Contacted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
];

const tab = ref<TabKey>("lead");
const q = ref("");

const loading = ref(false);
const error = ref<string | null>(null);
const mutatingId = ref<string | null>(null);

const rows = ref<BookingRow[]>([]);
const counts = reactive<Record<TabKey, number>>({
  lead: 0,
  contacted: 0,
  scheduled: 0,
  completed: 0,
});

const activeLabel = computed(() => TABS.find(t => t.key === tab.value)?.label ?? "Pipeline");

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function fmt(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function serviceLabel(v: BookingRow["service_type"]) {
  if (v === "single_story") return "Single-story";
  if (v === "two_story") return "Two-story";
  return "Large / multi-story";
}

function applyClientSearch(data: BookingRow[]) {
  const s = q.value.trim().toLowerCase();
  if (!s) return data;

  return data.filter((r) => {
    return (
        (r.name || "").toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s) ||
        (r.email || "").toLowerCase().includes(s) ||
        (r.city || "").toLowerCase().includes(s) ||
        (r.address || "").toLowerCase().includes(s)
    );
  });
}

async function loadTab(which: TabKey) {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase.from("bookings").select("*").eq("status", which);

    // Sorting per tab
    if (which === "scheduled") {
      query = query.order("scheduled_for", { ascending: true, nullsFirst: false });
    } else if (which === "completed") {
      query = query.order("completed_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    } else if (which === "contacted") {
      query = query.order("contacted_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error: e } = await query;
    if (e) throw new Error(e.message);

    rows.value = applyClientSearch((data as BookingRow[]) || []);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadCounts() {
  // Minimal count approach without needing RPC:
  // do 4 small queries selecting only id (cheap at your volume).
  try {
    const [a, b, c, d] = await Promise.all([
      supabase.from("bookings").select("id").eq("status", "lead"),
      supabase.from("bookings").select("id").eq("status", "contacted"),
      supabase.from("bookings").select("id").eq("status", "scheduled"),
      supabase.from("bookings").select("id").eq("status", "completed"),
    ]);

    counts.lead = a.data?.length ?? 0;
    counts.contacted = b.data?.length ?? 0;
    counts.scheduled = c.data?.length ?? 0;
    counts.completed = d.data?.length ?? 0;
  } catch {
    // counts are non-critical; ignore errors here
  }
}

async function refresh() {
  await Promise.all([loadCounts(), loadTab(tab.value)]);
}

watch(tab, async () => {
  await loadTab(tab.value);
});

watch(q, () => {
  // reapply search client-side without refetch
  rows.value = applyClientSearch(rows.value);
});

onMounted(refresh);

// ---- actions ----

async function setStatus(id: string, next: Status) {
  mutatingId.value = id;
  error.value = null;

  try {
    const { data, error: e } = await supabase
        .from("bookings")
        .update({ status: next })
        .eq("id", id)
        .select("id,status,contacted_at,scheduled_for,completed_at")
        .maybeSingle(); // ✅ allows 0 or 1 row without throwing

    console.log("setStatus result:", { id, next, data, e });

    if (e) throw new Error(e.message);

    // If no row came back, update didn't happen (usually RLS or wrong id)
    if (!data) {
      throw new Error(
          "Update returned no row. This usually means Row Level Security blocked the update or the id did not match any row."
      );
    }

    await refresh();

    // Optional UX: jump to tab that matches new status
    if (next === "contacted") tab.value = "contacted";
    if (next === "scheduled") tab.value = "scheduled";
    if (next === "completed") tab.value = "completed";
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    mutatingId.value = null;
  }
}



let notesTimer: any = null;
async function onNotesChange(id: string, value: string) {
  // lightweight debounce so typing doesn’t spam updates
  if (notesTimer) clearTimeout(notesTimer);
  notesTimer = setTimeout(async () => {
    mutatingId.value = id;
    try {
      const { error: e } = await supabase
          .from("bookings")
          .update({ admin_notes: value })
          .eq("id", id);

      if (e) throw new Error(e.message);
      await refresh();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      mutatingId.value = null;
    }
  }, 250);
}

// ---- scheduling modal ----
const scheduleOpen = ref(false);
const scheduleRow = ref<BookingRow | null>(null);
const scheduledForLocal = ref<string>("");

function openSchedule(r: BookingRow) {
  scheduleRow.value = r;
  scheduleOpen.value = true;

  // Prefill from preferred_date if available
  if (r.scheduled_for) {
    // convert ISO -> "YYYY-MM-DDTHH:mm"
    const d = new Date(r.scheduled_for);
    scheduledForLocal.value = toLocalInputValue(d);
  } else if (r.preferred_date) {
    // default to 09:00 local on preferred date
    scheduledForLocal.value = `${r.preferred_date}T09:00`;
  } else {
    scheduledForLocal.value = "";
  }
}

function closeSchedule() {
  scheduleOpen.value = false;
  scheduleRow.value = null;
  scheduledForLocal.value = "";
}

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function confirmSchedule() {
  if (!scheduleRow.value) return;
  if (!scheduledForLocal.value) return;

  const id = scheduleRow.value.id;
  mutatingId.value = id;
  error.value = null;

  try {
    const iso = new Date(scheduledForLocal.value).toISOString();

    const { data, error: e } = await supabase
        .from("bookings")
        .update({ status: "scheduled", scheduled_for: iso })
        .eq("id", id)
        .select("id,status,scheduled_for,contacted_at")
        .maybeSingle();

    console.log("confirmSchedule result:", { id, iso, data, e });

    if (e) throw new Error(e.message);
    if (!data) {
      throw new Error(
          "Schedule update returned no row. This usually means RLS blocked the update or the id did not match."
      );
    }

    closeSchedule();
    await refresh();
    tab.value = "scheduled";
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    mutatingId.value = null;
  }
}

</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  padding: 1.25rem;
}

.admin__header {
  max-width: 72.5rem;
  margin: 0 auto 1rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin__title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
}
.admin__title p {
  margin: 0.25rem 0 0;
  color: #475569;
}

.admin__controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.admin__search {
  width: min(22rem, 80vw);
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.6rem 0.9rem;
  background: #fff;
}

.tabs {
  max-width: 72.5rem;
  margin: 0 auto 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tabs__tab {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}
.tabs__tab--active {
  border-color: rgba(251, 191, 36, 0.9);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}
.tabs__count {
  display: inline-flex;
  min-width: 1.6rem;
  justify-content: center;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 0.85rem;
}

.panel {
  max-width: 72.5rem;
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.panel__meta {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: #475569;
}
.err { color: #b91c1c; font-weight: 700; }

.tablewrap { overflow-x: auto; }
.table {
  width: 100%;
  min-width: 980px;
  border-collapse: separate;
  border-spacing: 0;
}
.table th {
  text-align: left;
  font-size: 0.85rem;
  color: #64748b;
  padding: 0.85rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
.table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}
.table__actions { width: 18rem; }

.empty {
  padding: 2rem 1rem;
  color: #64748b;
}

.who__name { font-weight: 900; }
.who__sub { color: #475569; font-size: 0.9rem; }
.who__sub a { color: inherit; text-decoration: underline; text-decoration-color: rgba(100,116,139,0.5); }

.cell-main { font-weight: 800; }
.cell-sub { color: #64748b; font-size: 0.85rem; margin-top: 0.25rem; }

.pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  font-weight: 900;
  font-size: 0.8rem;
}
.pill--lead { background: #fff7ed; border-color: #fed7aa; color: #9a3412; }
.pill--contacted { background: #ecfeff; border-color: #a5f3fc; color: #155e75; }
.pill--scheduled { background: #eef2ff; border-color: #c7d2fe; color: #3730a3; }
.pill--completed { background: #ecfdf5; border-color: #bbf7d0; color: #166534; }
.pill--canceled { background: #f8fafc; border-color: #e2e8f0; color: #334155; }

.actions { display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }

.btn {
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
  font-weight: 900;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
}
.btn--primary {
  background: #fbbf24;
  border-color: rgba(251,191,36,0.85);
  color: #0f172a;
}
.btn--primary:hover { background: #fcd34d; }
.btn--ghost:hover { background: #f8fafc; }

.details { margin-top: 0.6rem; }
.details summary { cursor: pointer; color: #334155; font-weight: 800; }
.details__grid {
  margin-top: 0.8rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.k { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b; }
.v { color: #0f172a; }

.notes { margin-top: 0.85rem; }
.notes__label { display: block; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b; }
.notes__input {
  margin-top: 0.35rem;
  width: 100%;
  border-radius: 0.85rem;
  border: 1px solid #e2e8f0;
  padding: 0.65rem 0.75rem;
  resize: vertical;
}

/* modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 80;
}
.modal__card {
  width: min(36rem, 100%);
  background: #fff;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  padding: 1rem;
}
.modal__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.modal__head h2 { margin: 0; font-size: 1.25rem; font-weight: 900; }
.modal__sub { margin: 0.5rem 0 0.75rem; color: #475569; }

.field { display: grid; gap: 0.35rem; }
.field__label { font-weight: 900; color: #0f172a; }
.field__input {
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  padding: 0.7rem 0.75rem;
}
.field__hint { font-size: 0.9rem; color: #64748b; }

.modal__actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
