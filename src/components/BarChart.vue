<template>
  <div class="container">
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive, computed } from 'vue'

const props = defineProps({
  series: {
    type: Object as PropType<{ name: string; data: number[] }[]>,
    required: true,
  },

  categories: {
    type: Array as PropType<string[] | number[]>,
    default: () => [],
  },
})

const options = reactive({
  title: null,
  chart: {
    type: 'column',
    zoomType: 'x',
    zooming: {
      type: 'x',
    },
  },
  series: computed(() => props.series),
  xAxis: {
    type: '',
    categories: props.categories,

    title: {
      text: '',
    },
  },
  yAxis: {
    title: {
      text: '',
    },
  },

  tooltip: {
    shared: true,
  },
})
</script>
