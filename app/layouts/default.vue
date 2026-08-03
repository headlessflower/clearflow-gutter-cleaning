<script setup lang="ts">

</script>

<template>
<div>

  <AppNav/>
  <slot/>
  <FloatingQuicklist/>
  <AppFooter/>
</div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
