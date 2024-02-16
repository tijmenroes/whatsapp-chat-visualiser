<template>
  <div class="container">
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import basicChartProps from '../config/basicChartProps'

const props = defineProps({ ...basicChartProps })

// computed?
function getHours() {
  const mapped = props.data?.map((participant) => {
    const messages = participant.messages.filter((item) => !item.isAttachment)
    const upperCaseCount = messages.map((message) => message.upperCharactersCount)
    let sum = 0
    upperCaseCount.forEach((item) => (sum += item))

    let data = []

    if (props.showRelative) {
      let totalMessageCountSum = 0
      const allMessageLength = messages.map((message) => message.amountCharacters)
      allMessageLength.forEach((item) => {
        totalMessageCountSum += item
      })
      data = [parseFloat(((sum / totalMessageCountSum) * 100).toFixed(2))]
    } else {
      data = [sum]
    }

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

<style scoped>
.container {
  /* width: 800px; */
}
</style>
