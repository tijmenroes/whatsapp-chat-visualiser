import { Author, Message } from '@/utils/types'
import { groupBy } from '@/utils/helperFunctions.ts'
import { computed } from 'vue'

export function messagePerDaySeries(authors: Author[], groupMethod = 'day') {
  const isHour = groupMethod === 'hour'
  const isDay = groupMethod === 'day'
  const isDayHour = groupMethod === 'dayHour'

  const data = getData()
  const categories = isDay ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : Array.from({ length: 24 }, (_, i) => i)

  const heatMap: Record<string, number> = {}

  const series = computed(() =>
    authors.map((participant) => {
      const dates = getGroupedData(participant.messages) || {}
      const personData = JSON.parse(JSON.stringify(data))

      if (!isDayHour) {
        Object.entries(dates).forEach((item: [string | string, Message[]]) => {
          if (typeof item[0] === 'string') {
            personData[parseInt(item[0], 10)] = item[1].length
          }
        })
      } else {
        Object.entries(dates).forEach((item: [string | string, Message[]]) => {
          heatMap[item[0]] = (heatMap[item[0]] || 0) + item[1].length
        })
      }

      return {
        id: participant.authorIndex,
        name: participant.name,
        data: personData,
      }
    })
  )

  function getGroupedData(messages: Message[]) {
    if (isHour) {
      return groupBy(messages, 'hour')
    }
    if (isDay) {
      return groupBy(
        messages.map((item) => ({ day: new Date(item.date)?.getDay() })),
        'day'
      )
    }
    if (isDayHour) {
      // Maybe sort here???
      // TODO: How does this work?
      // console.log(messages.map((item) => ({ dayHour: [new Date(item.date)?.getDay(), item.hour] })))
      return groupBy(
        messages.map((item) => ({ dayHour: [new Date(item.date)?.getDay(), item.hour] })),
        'dayHour'
      )
    }
  }

  function getData() {
    if (isHour) {
      return Array.from({ length: 24 }, () => 0)
    }
    if (isDay) {
      return Array.from({ length: 7 }, () => 0)
    }
    if (isDayHour) {
      return Array.from({ length: 24 * 7 }, () => 0)
    }
  }

  if (isDayHour) {
    const _ = series.value // Hacky way to trigger the computed. This just needs to be refactored....
    const seriesData = Object.entries(heatMap).map((item) => {
      const [day, hour] = item[0].split(',').map(Number)
      return [hour, day, item[1]]
    })

    return { series: seriesData, categories }
  }

  return { series: series.value, categories }
}
