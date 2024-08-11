<template>
  <q-intersection
    transition="slide-up"
    once
    :class="isSmall ? 'col-md-6' : 'col-md-12'"
    class="col-xs-12 DashboardCard"
  >
    <div class="cardContainer">
      <q-card>
        <q-card-section class="q-mt-md column q-gutter-sm">
          <div
            v-text="title"
            class="title"
          />
          <span
            v-if="subtitle"
            v-text="subtitle"
            class="text-muted"
          />
        </q-card-section>
        <q-card-section>
          <slot />
        </q-card-section>
      </q-card>
    </div>
  </q-intersection>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  isSmall: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="scss">
.title {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 120%;
}

// .q-card {
//   padding: 12px;
// }
</style>
