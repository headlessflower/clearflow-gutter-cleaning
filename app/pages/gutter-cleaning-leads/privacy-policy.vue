<template>
  <div class="privacy">
    <div class="container">
      <h1>Privacy Policy</h1>
      <p class="updated">Last updated: {{ today }}</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect the following information:</p>
        <ul>
          <li>Account details (name, email, company)</li>
          <li>Usage data (leads viewed, interactions)</li>
          <li>Payment and subscription information</li>
          <li>Customer lead data submitted through our platform</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Information</h2>
        <ul>
          <li>Provide access to leads</li>
          <li>Improve service performance</li>
          <li>Communicate with users</li>
          <li>Process payments</li>
        </ul>
      </section>

      <section>
        <h2>3. Lead Data Usage</h2>
        <p>
          Lead information is provided to contractors for the sole purpose of contacting potential customers regarding
          their service request.
        </p>
        <p>
          You agree not to store, resell, or distribute lead data outside of your direct business use.
        </p>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>
          Leads may be shared with multiple contractors. We do not guarantee exclusivity.
        </p>
      </section>

      <section>
        <h2>5. Data Accuracy</h2>
        <p>
          We do not guarantee the accuracy or completeness of any submitted lead data.
        </p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>
          We take reasonable measures to protect your data but cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>7. Cookies & Tracking</h2>
        <p>
          We may use cookies and analytics tools to improve user experience and track performance.
        </p>
      </section>

      <section>
        <h2>8. Your Responsibilities</h2>
        <ul>
          <li>Use data ethically and legally</li>
          <li>Comply with local outreach and marketing laws</li>
        </ul>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          We may update this policy at any time. Continued use of the service constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>Email: clearflowgutterspro@gmail.com</p>
        <p>Phone: (323) 709-5357</p>
      </section>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'leads'
})
const today = new Date().toLocaleDateString()
</script>

<style scoped>
.privacy {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.container {
  line-height: 1.6;
}

h1 {
  font-size: 2rem;
}

.updated {
  color: #666;
  margin-bottom: 30px;
}

section {
  margin-bottom: 25px;
}
</style>
