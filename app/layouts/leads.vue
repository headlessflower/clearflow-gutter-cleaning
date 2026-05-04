<template>
  <div class="leads-layout">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <NuxtLink to="/gutter-cleaning-leads" class="logo">
          ClearFlow Leads
        </NuxtLink>

        <nav class="nav">
          <NuxtLink to="/gutter-cleaning-leads/leads">Browse Leads</NuxtLink>
          <NuxtLink to="/gutter-cleaning-leads/my-leads">My Leads</NuxtLink>
          <NuxtLink to="/gutter-cleaning-leads/pricing">Pricing</NuxtLink>


          <span v-if="leadCount !== null" class="lead-count">
            {{ leadCount }} leads available
          </span>
        </nav>

        <div class="actions">
          <template v-if="isLoggedIn">
            <NuxtLink :to="dashboardUrl" class="login">
              Dashboard
            </NuxtLink>

            <button class="logout" type="button" @click="logout">
              Logout
            </button>
          </template>

          <template v-else>
            <NuxtLink to="/gutter-cleaning-leads/login" class="login">Login</NuxtLink>
            <NuxtLink to="/gutter-cleaning-leads/signup" class="cta">Get Access</NuxtLink>
          </template>
        </div>
      </div>
    </header>
    <!-- Page Content -->
    <main class="main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <h3>ClearFlow Leads</h3>
          <p>Gutter cleaning leads for contractors.</p>
        </div>

        <div>
          <h4>Product</h4>
          <ul>
            <li>
              <NuxtLink to="/gutter-cleaning-leads">Leads</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/gutter-cleaning-leads/pricing">Pricing</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4>Legal</h4>
          <ul>
            <li>
              <NuxtLink to="/gutter-cleaning-leads/terms">Terms</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/gutter-cleaning-leads/privacy-policy">Privacy</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <p>clearflowgutterspro@gmail.com</p>
          <p>(323) 709-5357</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} ClearFlow Gutter Services</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const leadCount = ref<number | null>(null)

const isLoggedIn = computed(() => !!user.value)

const dashboardUrl = computed(() => {
  return '/gutter-cleaning-leads/dashboard'
})

onMounted(async () => {
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  leadCount.value = count ?? 0
})

async function logout() {
  await supabase.auth.signOut()
  await navigateTo('/gutter-cleaning-leads')
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.nav {
  display: flex;
  gap: 20px;
}

.actions {
  display: flex;
  gap: 12px;
}

.cta {
  background: black;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
}

.main {
  min-height: 70vh;
  padding: 40px 20px;
}

.footer {
  border-top: 1px solid #eee;
  padding: 40px 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.footer-bottom {
  margin-top: 30px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.lead-count {
  font-size: 0.85rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 8px;
  border-radius: 999px;
  color: #334155;
}

.logout {
  border: 0;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: #555;
}

.logout:hover,
.login:hover,
.nav a:hover {
  text-decoration: underline;
}
</style>
