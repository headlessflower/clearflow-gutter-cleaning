<template>
  <main class="accept-terms-page">
    <section class="card">
      <h1>Accept Terms</h1>

      <p>
        Before continuing, please review and accept our
        <NuxtLink to="/terms">Terms & Conditions</NuxtLink>
        and
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.
      </p>

      <label class="terms-check">
        <input v-model="acceptedTerms" type="checkbox" />
        <span>I agree to the Terms & Conditions and Privacy Policy.</span>
      </label>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button :disabled="loading" @click="acceptTerms">
        {{ loading ? 'Saving...' : 'Continue' }}
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const TERMS_VERSION = 'v1'

const acceptedTerms = ref(false)
const loading = ref(false)
const errorMessage = ref('')

definePageMeta({
  layout: 'leads'
})

async function acceptTerms() {
  errorMessage.value = ''

  if (!user.value) {
    return router.push('/login')
  }

  if (!acceptedTerms.value) {
    errorMessage.value = 'You must accept the terms to continue.'
    return
  }

  loading.value = true

  const acceptedAt = new Date().toISOString()

  const { error } = await supabase
    .from('contractor_profiles')
    .update({
      accepted_terms: true,
      accepted_terms_at: acceptedAt,
      terms_version: TERMS_VERSION
    })
    .eq('id', user.value.id)

  if (error) {
    errorMessage.value = error.message
    loading.value = false
    return
  }

  await supabase.auth.updateUser({
    data: {
      accepted_terms: true,
      accepted_terms_at: acceptedAt,
      terms_version: TERMS_VERSION
    }
  })

  loading.value = false
  router.push('/leads')
}
</script>
