<template>
  <div class="container">
    <!-- {{ data }} -->
    <highcharts :options="optionsMessagesOverTime" />
  </div>
</template>

<script setup lang="ts">
import { Author, Message } from '../utils/types.ts'
import type { PropType } from 'vue'
import { reactive, computed } from 'vue'
import { groupBy } from '../utils/helperFunctions.ts'

const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },

  perAuthor: {
    type: Boolean,
    default: true,
  },
})
const series = computed(() => {
  if (props.perAuthor) {
    return props.data.map((participant) => {
      const messages: Message[] = participant.messages

      const dates = groupBy(messages, 'date')

      const mappedDates = Object.entries(dates).map((item: [string, Message[]]) => {
        const start = new Date(item[0]).setUTCHours(0, 0, 0, 0)
        // if (new Date(start).getTime() == 'NaN' || !new Date(start).getTime()) {
        //   console.log('NaN', item)
        // }
        return [new Date(start).getTime(), item[1].length]
      })
      return {
        name: participant.name,
        data: mappedDates,
      }
    })
  }
  const messages: Message[] = props.data.flatMap((author) => author.messages).sort((a, b) => a.id - b.id)
  const dates = groupBy(messages, 'date')
  const mappedDates = Object.entries(dates).map((item: [string, Message[]]) => {
    const start = new Date(item[0]).setUTCHours(0, 0, 0, 0)
    return [new Date(start).getTime(), item[1].length]
  })
  return [
    {
      name: 'Total messages',
      data: mappedDates,
    },
  ]
})

const optionsMessagesOverTime = reactive({
  title: null,
  chart: {
    // type: '',
    zooming: {
      type: 'x',
    },
  },
  series: computed(() => series.value),
  xAxis: {
    type: 'datetime',

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
