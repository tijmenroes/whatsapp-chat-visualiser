<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
// import { ref, computed } from 'vue'
// import { startAnalysisFromFile } from './utils/baseScript'

// import { useCounterStore } from './store'

// const store = useCounterStore()
// import 'swiper/css'
// import 'swiper/css/navigation'

// const data = computed(() => store.authorData)
// const allEvents = computed(() => store.eventsData)
</script>
<style scoped lang="scss">
$colMargin: 24px;
.slideTitle {
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  // grid-column-gap: 5px;
  grid-row-gap: 12px;

  .q-card {
    margin: $colMargin 12px;
    height: 100%;
  }
}

.col3 {
  width: 32.33%;
  margin: $colMargin 0.33%;
}

.col6 {
  width: 48%;
  margin: $colMargin 1%;
}

.col12 {
  width: 98%;
  margin: $colMargin 1%;
}

.q-card {
  overflow: hidden;

  .q-icon {
    justify-content: initial;
    vertical-align: initial;
  }
  // .infoIcon {
  //   position: absolute;
  //   right: 0;
  //   top: 10px;
  // }
}
</style>
