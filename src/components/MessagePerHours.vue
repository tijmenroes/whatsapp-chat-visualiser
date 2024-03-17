<template>
  <div class="container">
    <!-- {{ data }} -->
    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Author, Message } from '../utils/types.ts'
import type { PropType } from 'vue'
import { reactive } from 'vue'
import { groupBy } from '../utils/helperFunctions.ts'

const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },
})

// const hoursSeries = ref([])

function getHours() {
  return props.data.map((participant) => {
    const allHours = Array.from({ length: 24 }, (_, i) => i)

    // console.log(participant.messages)
    const dates = groupBy(participant.messages, 'hour')
    Object.entries(dates).forEach((item: [string | string, Message[]]) => {
      // TODO: Fix sometimes messages showing up as null hour
      if (item[0] == 'null') {
        // console.log(item[1])
      }
      if (typeof item[0] === 'string') {
        allHours[parseInt(item[0], 10)] = item[1].length
      }
    })

    return {
      name: participant.name,
      data: allHours,
    }
  })
}
// getHours()

const options = reactive({
  title: null,
  chart: {
    type: 'column',
    zoomType: 'x',
    zooming: {
      type: 'x',
    },
  },
  series: getHours(),
  xAxis: {
    type: '',

    title: {
      text: 'Date',
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
