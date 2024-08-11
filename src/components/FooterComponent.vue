<template>
  <footer class="column">
    <LogoComponent />
  </footer>
</template>

<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue'
</script>

<style scoped lang="scss">
footer {
  padding: 120px;

  justify-content: center;
  align-items: center;
  background: var(--background-bg-secondary-80, rgba(244, 244, 245, 0.8));
}

@media (max-width: 768px) {
  footer {
    padding: 60px 12px;
  }
}
</style>
