<template>
  <div class="container">
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import basicChartProps from '../config/basicChartProps'
import { divideNumber } from '../utils/divideNumber'

const props = defineProps({ ...basicChartProps })

// computed?
function getHours() {
  const mapped = props.data?.map((participant) => {
    const messages = participant.messages.filter((item) => item.isAttachment)
    const data = props.showRelative ? [divideNumber(messages.length, participant.messages.length)] : [messages.length]

    return {
      name: participant.name,
      data,
    }
  })
  return mapped
}

const options = reactive({
  title: null,
  chart: {
    type: 'column',
    zooming: {
      type: 'x',
    },
  },
  series: getHours(),
  xAxis: {
    type: '',
    categories: props.showRelative ? ['Totaal in %'] : ['Totaal'],
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
