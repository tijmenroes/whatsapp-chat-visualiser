<template>
  <footer class="column">
    <LogoComponent />

    <div>
      <p class="text-center q-mt-xl">
        Made by
        <a
          href="https://tijmenroes.github.io/portfolio/"
          target="_blank"
        >
          Tijmen Roes
        </a>

        <br />

        Designed by
        <a
          href="https://mediabeer.nl/"
          target="_blank"
        >
          Bekir Uysal
        </a>
      </p>
    </div>
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
