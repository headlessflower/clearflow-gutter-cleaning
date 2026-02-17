<script setup lang="ts">

</script>

<template>
  <header class="w-full border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
    <div class="container mx-auto flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-xl bg-cyan-600 text-white font-bold shadow-sm">CF</div>
        <div>
          <p class="text-xs uppercase tracking-wider text-slate-500">ClearFlow</p>
          <p class="text-base font-semibold text-slate-900">Gutter Cleaning</p>
        </div>
      </div>
      <nav class="hidden items-center gap-4 text-sm font-medium text-slate-700 sm:flex">
        <NuxtLink to="/" class="hover:text-cyan-700">Home</NuxtLink>
        <NuxtLink to="/booking" class="text-cyan-700">Book</NuxtLink>
        <a href="tel:+13237095357" class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm hover:border-cyan-300">(323) 709‑5357</a>
      </nav>
    </div>
  </header>
</template>
<style scoped>

</style>