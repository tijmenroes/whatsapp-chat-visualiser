import { Author, Message } from '@/utils/types'
import { groupBy } from '@/utils/helperFunctions.ts'
import { computed } from 'vue'

export function messagePerDaySeries(authors: Author[], isHour = false) {
  const data = isHour ? Array.from({ length: 24 }, () => 0) : Array.from({ length: 7 }, () => 0)
  const categories = isHour ? Array.from({ length: 24 }, (_, i) => i) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const series = computed(() =>
    authors.map((participant) => {
      const dates = getGroupedData(participant.messages)
      const personData = JSON.parse(JSON.stringify(data))
      Object.entries(dates).forEach((item: [string | string, Message[]]) => {
        if (typeof item[0] === 'string') {
          personData[parseInt(item[0], 10)] = item[1].length
        }
      })

      return {
        id: participant.authorIndex,
        name: participant.name,
        data: personData,
      }
    })
  )

  function getGroupedData(messages: Message[]) {
    return isHour
      ? groupBy(messages, 'hour')
      : groupBy(
          messages.map((item) => ({
            day: new Date(item.date)?.getDay(),
          })),
          'day'
        )
  }

  return { series: series.value, categories }
}
