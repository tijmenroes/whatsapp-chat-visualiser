<template>
  <transition name="slide">
    <q-card
      class="loadingInfo column q-gutter-y-sm q-pa-md q-py-lg text-center elevation-1"
      v-if="loadingInfo.isActive"
    >
      <p>Analysing a total of: {{ loadingInfo.totalLines }} lines</p>

      <p v-if="loadingInfo.totalLines > 10000000">This might take a while</p>

      <q-linear-progress
        color="primary"
        :value="loadingInfo.progress"
        :animation-speed="700"
      />
    </q-card>
  </transition>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { computed } from 'vue'

const store = useStore()
const loadingInfo = computed(() => store.loadingInfo)
</script>

<style lang="scss" scoped>
.loadingInfo {
  position: fixed;
  border-radius: 8px !important;
  background: white;
  width: 300px;
  bottom: 10px;
  right: 10px;
  padding: 12px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
