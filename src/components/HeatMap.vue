<template>
  <div class="container">
    <Chart :options="options" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive, computed } from 'vue'
import Highcharts from 'highcharts'
import hcHeatmap from 'highcharts/modules/heatmap'
import { Chart } from 'highcharts-vue'
hcHeatmap(Highcharts)

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
  series: [
    {
      borderWidtht: 1,
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
      text: '',
    },
  },
  yAxis: {
    type: '',
    categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    title: {
      text: '',
    },
  },

  colorAxis: {
    min: 0,
    minColor: '#FFFFFF',
    maxColor: '#3de76c',
  },

  tooltip: {
    shared: true,
  },
})
</script>
