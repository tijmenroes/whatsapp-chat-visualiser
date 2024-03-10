<template>
  <div class="container">
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import basicChartProps from '../config/basicChartProps'
// import { divideNumber } from '../utils/divideNumber'

const props = defineProps({ ...basicChartProps })

function divideNumber(initial: number, divideAmount: number) {
  //   parseFloat((item / participant.messages.length).toFixed(2)))

  //   console.log((initial / divideAmount).toFixed(2))
  return parseFloat((initial / divideAmount).toFixed(2))
}

const series = computed(() => {
  const mapped = props.data?.map((participant) => {
    const messages = participant.messages.map((item) => item.amountCharacters)
    let sum = 0
    messages.forEach((item) => (sum += item))

    const data = props.showRelative ? [divideNumber(sum, participant.messages.length)] : [sum]

    return {
      name: participant.name,
      data,
    }
  })
  return mapped
})

const options = reactive({
  title: null,
  chart: {
    type: 'column',
    zooming: {
      type: 'x',
    },
  },
  series: computed(() => series.value),
  xAxis: {
    type: '',
    categories: ['Gemiddelde lengte'],
  },
  yAxis: {
    min: 22,
    title: {
      text: '',
    },
  },

  tooltip: {
    shared: true,
  },
})
</script>
