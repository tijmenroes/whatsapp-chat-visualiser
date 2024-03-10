<template>
  <div class="container">
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import basicChartProps from '../config/basicChartProps'
import { divideNumber } from '../utils/divideNumber'

const props = defineProps({ ...basicChartProps })

// computed?

const series = computed(() => {
  return props.data?.map((participant) => {
    // Beter om de max length mee te geven?
    const messages = props.showRelative ? participant.messages.filter((item) => item.isAttachment).map((item) => item.amountCharacters) : participant.messages.map((item) => item.amountCharacters)

    // const messages = participant.messages.filter((item) => item.isAttachment)
    const data = props.showRelative ? [divideNumber(messages.length, participant.messages.length)] : [messages.length]

    return {
      name: participant.name,
      data,
    }
  })
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
