<template>
  <main class="jobs">
    <header class="jobs__hero">
      <div class="jobs__hero-inner">
        <p class="jobs__kicker">ClearFlow Gutter Services</p>
        <h1 class="jobs__title">Gutter Cleaning Technician</h1>
        <p class="jobs__subtitle">
          Join our field team serving homes across Los Angeles &amp; San Bernardino County.
          Reliable work, clear expectations, and a straightforward application.
        </p>

        <div class="jobs__cta-row">
          <a
              class="jobs__cta"
              :href="formUrl"
              target="_blank"
              rel="noreferrer"
          >
            Apply on Google Form
            <span class="jobs__cta-icon" aria-hidden="true">↗</span>
          </a>

          <p class="jobs__cta-note">
            Opens in a new tab. Takes ~3–5 minutes.
          </p>
        </div>
      </div>
    </header>

    <section class="jobs__content">
      <div class="jobs__grid">
        <article class="jobs__card">
          <h2 class="jobs__card-title">Role overview</h2>
          <ul class="jobs__list">
            <li>Clean gutters and downspouts (remove debris, bag/haul, rinse/flush where needed).</li>
            <li>Inspect for clogs, leaks, disconnected downspouts, and common drainage issues.</li>
            <li>Use ladders safely and work at heights on 1–2 story homes (and occasional larger runs).</li>
            <li>Maintain clean job sites and communicate clearly with customers on arrival/exit.</li>
            <li>Photo documentation (before/after) as needed.</li>
          </ul>
        </article>

        <article class="jobs__card">
          <h2 class="jobs__card-title">Requirements</h2>
          <ul class="jobs__list">
            <li><strong>Must have a driver’s license or valid ID.</strong></li>
            <li>Comfortable working outdoors and at heights; able to lift 40–60 lbs.</li>
            <li>Reliable transportation and strong punctuality.</li>
            <li>Basic smartphone skills (maps, texting, photos).</li>
            <li>Professional communication and respect for customer property.</li>
          </ul>

          <div class="jobs__highlight">
            <p class="jobs__highlight-title">Safety first</p>
            <p class="jobs__highlight-text">
              You’ll be expected to follow ladder safety practices, wear appropriate footwear,
              and work carefully around rooflines, landscaping, and power lines.
            </p>
          </div>
        </article>

        <article class="jobs__card">
          <h2 class="jobs__card-title">Nice to have</h2>
          <ul class="jobs__list">
            <li>Previous experience with gutter cleaning, roof work, pressure washing, or exterior maintenance.</li>
            <li>Comfort using extension ladders and roof-safe work practices.</li>
            <li>Spanish/English bilingual communication.</li>
            <li>Customer service experience.</li>
          </ul>
        </article>

        <article class="jobs__card">
          <h2 class="jobs__card-title">What to expect</h2>
          <ul class="jobs__list">
            <li>Residential work in LA &amp; San Bernardino County (travel between neighborhoods).</li>
            <li>Clear scheduling + job details sent ahead of time.</li>
            <li>Work that rewards attention to detail, speed, and professionalism.</li>
          </ul>

          <div class="jobs__apply-box">
            <h3 class="jobs__apply-title">Ready to apply?</h3>
            <p class="jobs__apply-text">
              Use the button below to submit your application.
            </p>
            <a
                class="jobs__cta jobs__cta--full"
                :href="formUrl"
                target="_blank"
                rel="noreferrer"
            >
              Apply now
              <span class="jobs__cta-icon" aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdCnp6IszZO_2Ppn5wKgNUiboPm31BUR2opp1rY7wByj-wXiw/viewform?usp=dialog";

useHead({
  title: "Jobs — Gutter Cleaning Technician | ClearFlow",
  meta: [
    {
      name: "description",
      content:
          "Apply to join ClearFlow as a gutter cleaning technician. Must have a driver’s license or valid ID. Outdoor work, ladder safety, and customer-facing professionalism.",
    },
  ],
});
</script>

<style scoped>
.jobs {
  background: #f2f2f0;
  color: #0a0a0a;
  min-height: 100vh;
}

.jobs__hero {
  border-bottom: 1px solid rgba(10, 10, 10, 0.12);
  background: rgba(242, 242, 240, 0.9);
}

.jobs__hero-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 16px 32px;
}

.jobs__kicker {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.55);
  font-weight: 700;
}

.jobs__title {
  margin: 0;
  font-size: 34px;
  line-height: 1.08;
  letter-spacing: -0.02em;
  font-weight: 900;
}

.jobs__subtitle {
  margin: 14px 0 0;
  max-width: 70ch;
  color: rgba(10, 10, 10, 0.75);
  font-size: 16px;
  line-height: 1.6;
}

.jobs__cta-row {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.jobs__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 2px solid rgba(10, 10, 10, 0.25);
  background: #ffffff;
  color: #0a0a0a;
  text-decoration: none;
  font-weight: 900;
  letter-spacing: 0.02em;
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.15);
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.jobs__cta:hover {
  transform: translateY(-1px);
  border-color: rgba(10, 10, 10, 0.4);
  box-shadow: 0 3px 0 rgba(10, 10, 10, 0.18);
}

.jobs__cta:active {
  transform: translateY(0px);
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.15);
}

.jobs__cta-icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(10, 10, 10, 0.18);
  font-size: 13px;
  line-height: 1;
}

.jobs__cta-note {
  margin: 0;
  font-size: 13px;
  color: rgba(10, 10, 10, 0.6);
}

.jobs__content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 16px 60px;
}

.jobs__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 880px) {
  .jobs__grid {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
}

.jobs__card {
  background: #ffffff;
  border: 1px solid rgba(10, 10, 10, 0.12);
  border-radius: 18px;
  padding: 18px 18px 16px;
  box-shadow: 0 1px 0 rgba(10, 10, 10, 0.06);
}

.jobs__card-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 950;
  letter-spacing: -0.01em;
}

.jobs__list {
  margin: 0;
  padding-left: 18px;
  color: rgba(10, 10, 10, 0.78);
  line-height: 1.65;
  font-size: 14px;
}

.jobs__list li {
  margin: 8px 0;
}

.jobs__highlight {
  margin-top: 14px;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px dashed rgba(10, 10, 10, 0.22);
  background: rgba(242, 242, 240, 0.8);
}

.jobs__highlight-title {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 900;
  color: rgba(10, 10, 10, 0.65);
}

.jobs__highlight-text {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(10, 10, 10, 0.75);
}

.jobs__apply-box {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(10, 10, 10, 0.1);
}

.jobs__apply-title {
  margin: 0;
  font-size: 15px;
  font-weight: 950;
}

.jobs__apply-text {
  margin: 8px 0 12px;
  color: rgba(10, 10, 10, 0.7);
  font-size: 14px;
  line-height: 1.6;
}

.jobs__cta--full {
  width: 100%;
  justify-content: center;
}
</style>
