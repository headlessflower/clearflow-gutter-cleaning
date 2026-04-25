<template>
  <main class="mx-auto max-w-md p-6">
    <h1 class="text-2xl font-bold">Admin login</h1>
    <p class="mt-1 text-sm text-slate-600">Sign in to view bookings.</p>

    <form class="mt-6 space-y-4" @submit.prevent="signIn">
      <input v-model="email" type="email" required placeholder="Email"
             class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" />
      <input v-model="password" type="password" required placeholder="Password"
             class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" />

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button :disabled="pending"
              class="w-full rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">
        Sign in
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const pending = ref(false);

async function signIn() {
  error.value = null;
  pending.value = true;
  try {
    const { error: e } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (e) throw e;
    await navigateTo("/admin");
  } catch (err: any) {
    error.value = err?.message || "Login failed.";
  } finally {
    pending.value = false;
  }
}

const route = useRoute();

const dest =
    typeof route.query.redirect === "string" ? route.query.redirect : "/admin";

await navigateTo(dest, { replace: true });

</script>
