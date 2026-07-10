<template>
    <form
        @submit.prevent="handleSubmit"
        class="mx-auto w-full max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow"
    >
        <header class="space-y-1">
            <h3 class="text-2xl font-bold">Book Your Cleaning</h3>
            <p class="text-sm text-slate-600">
                Basic details to get you scheduled. We’ll confirm by phone or
                email.
            </p>
        </header>

        <!-- Contact -->
        <div class="grid gap-4 sm:grid-cols-2">
            <div>
                <label
                    for="name"
                    class="block text-sm font-medium text-slate-700"
                    >Full name</label
                >
                <input
                    v-model.trim="form.name"
                    id="name"
                    type="text"
                    required
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
            <div>
                <label
                    for="phone"
                    class="block text-sm font-medium text-slate-700"
                    >Phone</label
                >
                <input
                    v-model.trim="form.phone"
                    id="phone"
                    type="tel"
                    required
                    placeholder="(323) 555-1234"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
            <div class="sm:col-span-2">
                <label
                    for="email"
                    class="block text-sm font-medium text-slate-700"
                    >Email</label
                >
                <input
                    v-model.trim="form.email"
                    id="email"
                    type="email"
                    required
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
        </div>

        <!-- Address -->
        <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                <label
                    for="city"
                    class="block text-sm font-medium text-slate-700"
                    >City</label
                >
                <input
                    v-model.trim="form.city"
                    id="city"
                    type="text"
                    required
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
            <div>
                <label
                    for="zip"
                    class="block text-sm font-medium text-slate-700"
                    >ZIP</label
                >
                <input
                    v-model.trim="form.zip"
                    id="zip"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]{5}"
                    placeholder="90032"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
            <div>
                <label
                    for="county"
                    class="block text-sm font-medium text-slate-700"
                    >County</label
                >
                <select
                    v-model="form.county"
                    id="county"
                    class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-cyan-500 focus:outline-none"
                >
                    <option value="Los Angeles County">
                        Los Angeles County
                    </option>
                    <option value="San Bernardino County">
                        San Bernardino County
                    </option>
                    <option value="Other">Other (we will confirm)</option>
                </select>
            </div>
            <div>
                <label
                    for="date"
                    class="block text-sm font-medium text-slate-700"
                    >Preferred date</label
                >
                <input
                    v-model="form.preferred_date"
                    id="date"
                    type="date"
                    required
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
        </div>

        <!-- Service -->
        <div class="grid gap-4 sm:grid-cols-2">
            <div>
                <label
                    for="service_type"
                    class="block text-sm font-medium text-slate-700"
                    >Service</label
                >
                <select
                    v-model="form.service_type"
                    id="service_type"
                    required
                    class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-cyan-500 focus:outline-none"
                >
                    <option value="single_story">Single-Story Home</option>
                    <option value="two_story">Two-Story Home</option>
                    <option value="multi_story">Large / Multi-Story</option>
                </select>
            </div>
            <div>
                <label
                    for="approx_ft"
                    class="block text-sm font-medium text-slate-700"
                    >Approx. gutter ft (optional)</label
                >
                <input
                    v-model.number="form.approx_ft"
                    id="approx_ft"
                    type="number"
                    min="0"
                    step="10"
                    placeholder="150"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                />
            </div>
        </div>

        <!-- Add-ons -->
        <fieldset class="rounded-xl border border-slate-200 p-4">
            <legend class="px-2 text-sm font-semibold text-slate-800">
                Add-Ons (select as needed)
            </legend>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <label class="flex items-start gap-3">
                    <input
                        type="checkbox"
                        value="heavy_debris"
                        v-model="form.add_ons"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700"
                        >Heavy tree cover / extra debris (+$50–$100)</span
                    >
                </label>
                <label class="flex items-start gap-3">
                    <input
                        type="checkbox"
                        value="difficult_access"
                        v-model="form.add_ons"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700"
                        >Difficult access (steep roof, tight yard, special
                        ladder) (+$50)</span
                    >
                </label>
                <label class="flex items-start gap-3">
                    <input
                        type="checkbox"
                        value="gutter_guards"
                        v-model="form.add_ons"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700"
                        >Gutter guards or screens (+$50)</span
                    >
                </label>
                <label class="flex items-start gap-3">
                    <input
                        type="checkbox"
                        value="oversized_gutters"
                        v-model="form.add_ons"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700"
                        >Oversized/custom gutters (6-in, copper, etc.)
                        (+$25–$50)</span
                    >
                </label>
            </div>
        </fieldset>

        <!-- Options -->
        <div class="grid gap-4 sm:grid-cols-2">
            <label
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
                <span class="text-sm font-medium text-slate-800"
                    >Water access available?</span
                >
                <input
                    v-model="form.water_access"
                    type="checkbox"
                    class="h-5 w-5"
                />
            </label>
            <label
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
                <span class="text-sm font-medium text-slate-800">
                    Gutter guard removal needed?
                    <span class="font-normal text-slate-500"
                        >(not installation)</span
                    >
                </span>
                <input
                    v-model="form.gutter_guard_removal"
                    type="checkbox"
                    class="h-5 w-5"
                />
            </label>
        </div>

        <!-- Maintenance Plans -->
        <fieldset class="rounded-xl border border-slate-200 p-4">
            <legend class="px-2 text-sm font-semibold text-slate-800">
                Maintenance Plans
            </legend>

            <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <label class="flex items-start gap-3">
                    <input
                        type="radio"
                        value="seasonal"
                        v-model="form.maintenance_plan"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700">
                        Seasonal Plan (2 cleanings/year) →
                        <strong>10% OFF</strong>
                    </span>
                </label>

                <label class="flex items-start gap-3">
                    <input
                        type="radio"
                        value="quarterly"
                        v-model="form.maintenance_plan"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700">
                        Quarterly Plan (4 cleanings/year) →
                        <strong>15% OFF</strong>
                    </span>
                </label>

                <label class="flex items-start gap-3 sm:col-span-2">
                    <input
                        type="radio"
                        value=""
                        v-model="form.maintenance_plan"
                        class="mt-1"
                    />
                    <span class="text-sm text-slate-700">
                        No maintenance plan
                    </span>
                </label>
            </div>
        </fieldset>

        <!-- Notes -->
        <div>
            <label for="notes" class="block text-sm font-medium text-slate-700"
                >Notes (access instructions, pets, timing, etc.)</label
            >
            <textarea
                v-model.trim="form.notes"
                id="notes"
                rows="4"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
            ></textarea>
        </div>

        <!-- Quote Summary -->
        <section class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Estimated total
                    </p>
                    <p class="text-xs text-slate-600">
                        Based on your selections. Final price confirmed after
                        review.
                    </p>
                </div>

                <div class="text-right">
                    <p class="text-2xl font-extrabold text-slate-900">
                        {{ formatCurrency(totalQuote) }}
                    </p>

                    <p
                        v-if="discountedTotalQuote !== null"
                        class="mt-1 text-sm text-emerald-700"
                    >
                        Discounted:
                        <span class="font-semibold">{{
                            formatCurrency(discountedTotalQuote)
                        }}</span>
                        <span class="ml-2 text-slate-500 line-through">{{
                            formatCurrency(totalQuote)
                        }}</span>
                    </p>

                    <p v-else class="mt-1 text-xs text-slate-500">
                        No discounts applied.
                    </p>
                </div>
                <!-- Estimated yearly savings (maintenance plans only) -->
                <div
                    v-if="planYearly !== null"
                    class="mt-4 rounded-lg border border-slate-200 bg-white p-4"
                >
                    <div
                        class="flex flex-wrap items-start justify-between gap-3"
                    >
                        <div>
                            <p class="text-sm font-semibold text-slate-900">
                                Estimated yearly savings
                            </p>
                            <p class="text-xs text-slate-600">
                                Based on your current selections and the plan
                                frequency.
                            </p>
                        </div>

                        <div class="text-right">
                            <p class="text-lg font-extrabold text-emerald-700">
                                Save ~{{
                                    formatCurrency(planYearly.savings)
                                }}/year
                            </p>
                            <p class="text-xs text-slate-500">
                                {{ planYearly.cleaningsPerYear }} cleanings/year
                                • {{ planYearly.planLabel }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-3 grid gap-2 text-sm text-slate-700">
                        <div class="flex items-center justify-between">
                            <span>Estimated annual total (no plan)</span>
                            <span class="font-semibold">{{
                                formatCurrency(planYearly.annualNoPlan)
                            }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span>Estimated annual total (with plan)</span>
                            <span class="font-semibold">{{
                                formatCurrency(planYearly.annualWithPlan)
                            }}</span>
                        </div>
                    </div>

                    <p class="mt-3 text-xs text-slate-500">
                        Final pricing and plan enrollment are confirmed after
                        review. Add-ons may vary per visit.
                    </p>
                </div>
            </div>
        </section>

        <!-- Submit -->
        <div class="flex items-center justify-between gap-4">
            <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

            <p v-if="success" class="text-sm text-emerald-700">
                Thanks! We received your request. You’ll receive a confirmation
                email within <strong>3 days</strong>. If we do not hear back
                from you within that time, your requested time slot may be
                released.
            </p>

            <button
                :disabled="pending"
                type="submit"
                class="ml-auto inline-flex cursor-pointer items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white shadow hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <svg
                    v-if="pending"
                    class="mr-2 h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                Submit Booking
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
//const trackEvent = useTrackEvent();

const props = withDefaults(
    defineProps<{
        prefillCity?: string;
        prefillZip?: string;
    }>(),
    {
        prefillCity: "",
        prefillZip: "",
    },
);

type ServiceType = "single_story" | "two_story" | "multi_story";
type AddOnKey =
    | "heavy_debris"
    | "difficult_access"
    | "gutter_guards"
    | "oversized_gutters";
type MaintenancePlan = "" | "seasonal" | "quarterly";

const PRICING = {
    baseByService: {
        single_story: 200,
        two_story: 300,
        multi_story: 475, // starting at
    } as Record<ServiceType, number>,

    ftThreshold: 300,
    minOverFt: 400,

    addOns: {
        heavy_debris: 75, // shown as +$50–$100
        difficult_access: 50,
        gutter_guards: 50,
        oversized_gutters: 35, // shown as +$25–$50
    } as Record<AddOnKey, number>,

    options: {
        gutter_guard_removal: 25,
    },

    maintenancePlans: {
        seasonal: 0.1,
        quarterly: 0.15,
    } as Record<Exclude<MaintenancePlan, "">, number>,

    referralOff: 25,
};

const form = reactive({
    name: "",
    phone: "",
    email: "",
    city: "",
    zip: "",
    county: "Los Angeles County",
    preferred_date: "",
    service_type: "single_story" as ServiceType,
    approx_ft: "" as any,
    add_ons: [] as AddOnKey[],
    water_access: false,
    gutter_guard_removal: false,
    notes: "",

    // NEW
    maintenance_plan: "" as MaintenancePlan,
    referrals: 0,
});

const lastAppliedPrefillCity = ref("");
const lastAppliedPrefillZip = ref("");

watch(
    () => props.prefillCity,
    (value) => {
        const city = String(value || "").trim();
        if (!city) return;
        if (form.city.trim() && form.city !== lastAppliedPrefillCity.value) {
            return;
        }

        form.city = city;
        lastAppliedPrefillCity.value = city;
    },
    { immediate: true },
);

watch(
    () => props.prefillZip,
    (value) => {
        const zip = String(value || "").trim();
        if (!zip) return;
        if (form.zip.trim() && form.zip !== lastAppliedPrefillZip.value) {
            return;
        }

        form.zip = zip;
        lastAppliedPrefillZip.value = zip;
    },
    { immediate: true },
);

const pending = ref(false);
const errorMessage = ref<string | null>(null);
const success = ref(false);

function toNumberOrNull(v: unknown): number | null {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

const approxFtNumber = computed(() => toNumberOrNull(form.approx_ft));

const basePrice = computed(() => {
    const base = PRICING.baseByService[form.service_type];
    const ft = approxFtNumber.value;
    if (ft !== null && ft >= PRICING.ftThreshold) {
        return Math.max(base, PRICING.minOverFt);
    }
    return base;
});

const addOnTotal = computed(() => {
    let total = 0;
    for (const key of form.add_ons) total += PRICING.addOns[key] ?? 0;
    return total;
});

const optionTotal = computed(() => {
    let total = 0;
    if (form.gutter_guard_removal)
        total += PRICING.options.gutter_guard_removal;
    return total;
});

const totalQuote = computed(
    () => basePrice.value + addOnTotal.value + optionTotal.value,
);

const maintenanceDiscountRate = computed(() => {
    if (!form.maintenance_plan) return 0;
    if (form.maintenance_plan === "seasonal")
        return PRICING.maintenancePlans.seasonal;
    if (form.maintenance_plan === "quarterly")
        return PRICING.maintenancePlans.quarterly;
    return 0;
});

const referralDiscountAmount = computed(() => {
    const count = Math.max(0, Number(form.referrals) || 0);
    return count * PRICING.referralOff;
});

const discountedTotalQuote = computed<number | null>(() => {
    const baseTotal = totalQuote.value;
    const percentOff = maintenanceDiscountRate.value;
    const percentDiscount =
        percentOff > 0 ? Math.round(baseTotal * percentOff) : 0;
    const referralDiscount = referralDiscountAmount.value;
    const totalDiscount = percentDiscount + referralDiscount;
    if (totalDiscount <= 0) return null;
    return Math.max(baseTotal - totalDiscount, 0);
});

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

/** Estimated yearly savings (plan only; excludes referrals) */
const cleaningsPerYear = computed<number | null>(() => {
    if (form.maintenance_plan === "seasonal") return 2;
    if (form.maintenance_plan === "quarterly") return 4;
    return null;
});

function planLabel(plan: MaintenancePlan) {
    if (plan === "seasonal") return "Seasonal Plan (10% OFF)";
    if (plan === "quarterly") return "Quarterly Plan (15% OFF)";
    return "";
}

function normalizeAnalyticsValue(value: string | number | boolean | null | undefined) {
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
        return normalized || "unknown";
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === "boolean") {
        return value ? "yes" : "no";
    }

    return "unknown";
}

function trackBookingSubmitted() {
    const approxFt = approxFtNumber.value;
    const referralCount = Math.max(0, Number(form.referrals) || 0);
    const estimatedValue = discountedTotalQuote.value ?? totalQuote.value;

    trackEvent("generate_lead", {
        form_name: "booking_form",
        lead_type: "booking_request",
        service_type: normalizeAnalyticsValue(form.service_type),
        city: normalizeAnalyticsValue(form.city),
        county: normalizeAnalyticsValue(form.county),
        home_size: normalizeAnalyticsValue(form.service_type),
        maintenance_plan: normalizeAnalyticsValue(form.maintenance_plan || "none"),
        add_on_count: form.add_ons.length,
        add_ons: form.add_ons.length
            ? form.add_ons.map((item) => normalizeAnalyticsValue(item)).join("|")
            : "none",
        gutter_guard_removal: normalizeAnalyticsValue(form.gutter_guard_removal),
        water_access: normalizeAnalyticsValue(form.water_access),
        referral_count: referralCount,
        estimated_value: estimatedValue,
        currency: "USD",
        preferred_date: form.preferred_date || "unknown",
        approx_ft: approxFt ?? 0,
    });
}

const planYearly = computed<null | {
    cleaningsPerYear: number;
    planLabel: string;
    annualNoPlan: number;
    annualWithPlan: number;
    savings: number;
}>(() => {
    const n = cleaningsPerYear.value;
    const rate = maintenanceDiscountRate.value;
    if (!n || !rate) return null;

    const annualNoPlan = totalQuote.value * n;
    const savings = Math.round(annualNoPlan * rate);
    const annualWithPlan = Math.max(annualNoPlan - savings, 0);

    return {
        cleaningsPerYear: n,
        planLabel: planLabel(form.maintenance_plan),
        annualNoPlan,
        annualWithPlan,
        savings,
    };
});

async function handleSubmit() {
    errorMessage.value = null;
    success.value = false;

    // validation
    if (!form.name.trim())
        return (errorMessage.value = "Please enter your name.");
    if (!form.phone.trim())
        return (errorMessage.value = "Please enter your phone number.");
    if (!/.+@.+\..+/.test(form.email))
        return (errorMessage.value = "Please enter a valid email.");
   if (!form.city.trim() || !form.zip.trim()) {
  errorMessage.value = 'Please enter your city and ZIP code.'
  return
}
    if (!form.preferred_date.trim())
        return (errorMessage.value = "Please choose a preferred date.");

    pending.value = true;

    try {
        const approxFt = approxFtNumber.value;
        const total = totalQuote.value;
        const discountedTotal = discountedTotalQuote.value; // null if none

        const referralCount = Math.max(0, Number(form.referrals) || 0);

        const payload = {
            name: form.name,
            phone: form.phone,
            email: form.email,
            city: form.city,
            zip: form.zip || null,
            county: form.county,
            preferred_date: form.preferred_date,
            service_type: form.service_type,
            approx_ft: approxFt,
            add_ons: form.add_ons,
            water_access: form.water_access,
            gutter_guard_removal: form.gutter_guard_removal,
            notes: form.notes || null,

            // NEW totals + plan/referrals
            total_quote: total,
            discounted_total_quote: discountedTotal,
            maintenance_plan: form.maintenance_plan || null,
            referral_count: referralCount,
            status: "lead",
        };

        const { error } = await supabase.from("bookings").insert([payload]);

        if (error) {
            errorMessage.value = error.message || "Failed to submit booking.";
            return;
        }

        //trackBookingSubmitted();
        success.value = true;

        // reset
        Object.assign(form, {
            name: "",
            phone: "",
            email: "",
            city: String(props.prefillCity || "").trim(),
            zip: String(props.prefillZip || "").trim(),
            county: "Los Angeles County",
            preferred_date: "",
            service_type: "single_story",
            approx_ft: "",
            add_ons: [],
            water_access: false,
            gutter_guard_removal: false,
            notes: "",
            maintenance_plan: "",
            referrals: 0,
        });
    } catch (err: any) {
        console.error(err);
        errorMessage.value =
            err?.message || "Unexpected error submitting booking.";
    } finally {
        pending.value = false;
    }
}
</script>

<style scoped></style>
