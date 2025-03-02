<template>
  <div class="container">
    <highcharts
      :options="optionsMessagesOverTime"
      :callback="chartLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { Author, Message } from '../utils/types.ts'
import type { PropType } from 'vue'
import { reactive, computed } from 'vue'
import { groupBy } from '../utils/helperFunctions.ts'
import { useStore } from '@/store/index.ts'

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

const store = useStore()
const series = computed(() => {
  if (props.perAuthor) {
    return props.data.map((participant) => {
      const messages: Message[] = participant.messages

      const dates = groupBy(messages, 'date')

      const mappedDates = Object.entries(dates).map((item: [string, Message[]]) => {
        const start = new Date(item[0]).setUTCHours(0, 0, 0, 0)
        return [new Date(start).getTime(), item[1].length]
      })
      return {
        name: participant.name,
        data: mappedDates,
        color: store.getColorByAuthorId(participant.authorIndex),
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

function chartLoad() {
  console.log('Chart loaded')
}

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
