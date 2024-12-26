<template>
  <div class="LogoComponent row q-gutter-md">
    <img
      src="@/assets/branding/WW-Landscape-Green-Lightmode.svg"
      alt="logo"
    />
  </div>
</template>

<style lang="scss" scoped>
.LogoComponent {
  img {
    max-width: 200px;
  }
}

@media (prefers-color-scheme: dark) {
  .LogoComponent {
    img {
      content: url('@/assets/branding/WW-Landscape-Green-Darkmode.svg');
    }
  }
}
</style>
