<template>
  <div class="container">
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive, computed } from 'vue'
import hcHeatmap from 'highcharts/modules/heatmap'
// import { Chart } from 'highcharts-vue'

hcHeatmap
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
    type: 'heatmap',
    plotBorderWidth: 1,
  },

  tooltip: {
    format: `<b>{point.value}</b> messages on <br> <b>{series.yAxis.categories.(point.y)}</b> - <b>{series.xAxis.categories.(point.x)}h</b> `,
  },
  series: [
    {
      borderWidtht: 1,
      name: 'juooee',
      data: computed(() => props.series),
      dataLabels: {
        enabled: true,
        color: '#000000',
      },
    },
  ],
  xAxis: {
    type: '',
    categories: props.categories,

    title: {
      text: 'Hours',
    },
  },
  yAxis: {
    type: '',
    categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    title: {
      text: 'Days',
    },
  },

  colorAxis: {
    min: 0,
    minColor: '#FFFFFF',
    maxColor: '#3de76c',
  },
})
</script>
