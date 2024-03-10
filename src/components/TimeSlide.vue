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

const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },
})
const series = computed(() => {
  return props.data.map((participant) => {
    const messages: Message[] = participant.messages

    const dates = Object.groupBy(messages, (item: Message) => item.date)
    const mappedDates = Object.entries(dates).map((item: [Date, Array]) => {
      const start = new Date(item[0]).setUTCHours(0, 0, 0, 0)
      return [new Date(start).getTime(), item[1].length]
    })
    return {
      name: participant.name,
      data: mappedDates,
    }
  })
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
