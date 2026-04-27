<template>
  <div class="terms">
    <div class="container">
      <h1>Terms & Conditions</h1>
      <p class="updated">Last updated: {{ today }}</p>

      <section>
        <h2>1. Overview</h2>
        <p>
          By accessing or using our lead marketplace service ("Service"), you agree to be bound by these Terms &
          Conditions.
          This Service provides access to customer-submitted service requests and estimated quote data for informational
          purposes only.
        </p>
      </section>

      <section>
        <h2>2. No Guarantee of Work</h2>
        <p>
          Access to leads does <strong>not guarantee</strong> that you will secure any job, customer response, or
          revenue.
          Success depends on your pricing, responsiveness, reputation, and other external factors outside of our
          control.
        </p>
      </section>

      <section>
        <h2>3. Quote Pricing Disclaimer</h2>
        <p>
          Any quote price displayed is a <strong>suggested or previously submitted estimate</strong> and may not reflect
          the final agreed price.
        </p>
        <p>
          Contractors are free to adjust pricing, including increasing or decreasing the quoted amount ("upcharging"),
          based on
          their own evaluation of the project.
        </p>
      </section>

      <section>
        <h2>4. Lead Accuracy</h2>
        <p>
          We do not guarantee the accuracy, completeness, or validity of any lead information.
          Leads may contain errors, outdated details, or incomplete data.
        </p>
      </section>

      <section>
        <h2>5. Subscription & Access</h2>
        <ul>
          <li>Access is granted based on your selected subscription plan.</li>
          <li>Starter plans may include limits on the number of leads you can view.</li>
          <li>We reserve the right to modify plan features at any time.</li>
        </ul>
      </section>

      <section>
        <h2>6. No Refund Policy</h2>
        <p>
          All payments are <strong>final and non-refundable</strong>.
        </p>
        <p>
          This includes, but is not limited to:
        </p>
        <ul>
          <li>Unused leads</li>
          <li>Unsuccessful conversions</li>
          <li>Dissatisfaction with lead quality</li>
        </ul>
      </section>

      <section>
        <h2>7. Acceptable Use</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use lead information solely for legitimate business outreach</li>
          <li>Not resell, redistribute, or share lead data</li>
          <li>Not spam, harass, or misuse customer information</li>
        </ul>
      </section>

      <section>
        <h2>8. Lead Exclusivity</h2>
        <p>
          Leads may be shared with multiple contractors unless explicitly stated otherwise.
          We do not guarantee exclusive access to any lead.
        </p>
      </section>

      <section>
        <h2>9. Account Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and for all activity under your
          account.
        </p>
      </section>

      <section>
        <h2>10. Service Availability</h2>
        <p>
          We do not guarantee uninterrupted access to the Service.
          Downtime, maintenance, or technical issues may occur.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time for violations of these terms or misuse
          of the platform.
        </p>
      </section>

      <section>
        <h2>12. Limitation of Liability</h2>
        <p>
          We are not liable for any loss of revenue, business, or damages resulting from:
        </p>
        <ul>
          <li>Use of the leads</li>
          <li>Inaccurate information</li>
          <li>Customer disputes</li>
        </ul>
      </section>

      <section>
        <h2>13. Changes to Terms</h2>
        <p>
          We may update these Terms at any time. Continued use of the Service constitutes acceptance of the updated
          Terms.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>
          For questions regarding these Terms, please contact us at:
        </p>
        <p><strong>Email:</strong> clearflowgutterspro@gmail.com</p>
        <p><strong>Phone:</strong> (323) 709-5357</p>
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
.terms {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.container {
  line-height: 1.6;
}

h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.updated {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 30px;
}

section {
  margin-bottom: 25px;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

ul {
  padding-left: 20px;
}
</style>
