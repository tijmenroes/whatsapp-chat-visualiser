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

    const dates = Object.groupBy(participant.messages, (item: Message) => item.hour)
    // console.log(dates)
    Object.entries(dates).forEach((item: [number, Array]) => {
      if (item[0] == 'null') {
        // console.log(item[1])
      }
      if (item[0]) {
        allHours[item[0]] = item[1].length
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

// OG FUNC:
// function getMessageLength() {
//   console.time('test')
//   setHours()
//   const participantEmojis = []
//   for (let participant of authors.value) {
//     const messages = participant.messages.filter(
//       (item) =>
//         new Date(item.date) >= dateRange.value[0] && new Date(item.date) <= dateRange.value[1]
//     )
//     // console.log(messagesInTime)
//     let totalLength = 0
//     let amountAttachments = 0
//     const particpantHours = setHours()

//     // Note: het zou hier interessant zijn om benchmark tests uit te voeren om erachter te komen
//     // of het sneller is om door alles 1x te loopen, of ES6 helpers te gebruiken zoals .filter() etc...
//     const dates = Object.groupBy(messages, ({ date }) => date)
//     // console.log(dates)
//     const mappedDates = Object.entries(dates).map((item: [Date, Array]) => {
//       return [new Date(item[0]).getTime(), item[1].length]
//     })

//     const amountWords = []
//     selectedWords.value.forEach((word) => {
//       // Whitespace at the start so it's a new word not in a different word
//       amountWords.push(messages.filter(({ message }) => message.includes(` ${word}`))?.length || 0)
//     })

//     const allEmojis = messages.filter((item) => item.emojis)
//     const mappedEmo = allEmojis.flatMap((item) => item.emojis).sort()
//     const counter = {}

//     mappedEmo.forEach((ele) => {
//       if (counter[ele]) {
//         counter[ele] += 1
//       } else {
//         counter[ele] = 1
//       }
//     })
//     participantEmojis.push(counter)
//     // console.log(counter)
//     messages.forEach((msg) => {
//       if (msg.isAttachment) {
//         amountAttachments++
//       } else {
//         totalLength += msg.message.length
//       }
//       particpantHours[msg.hour]++

//       // emoji logic
//       // if (msg.emojis) {
//       // grouped per
//       // console.log(msg.emojis)
//       // msg.emojis.forEach(emoji => {

//       // })
//       // }
//     })

//     const participantName = participant.name.slice(2)

//     const averageMessageLength = parseFloat(
//       (totalLength / (messages.length - amountAttachments)).toFixed(1)
//     )
//     lengths.value.push({
//       name: participantName,
//       data: [averageMessageLength]
//     })
//     attachments.value.push({
//       name: participantName,
//       data: [amountAttachments]
//     })

//     hours.value.push({
//       name: participantName,
//       data: particpantHours
//     })

//     countingWords.value.push({
//       name: participantName,
//       data: amountWords
//     })

//     messagesOverTime.value.push({
//       name: participantName,
//       data: mappedDates
//     })
//   }

//   const keys = participantEmojis.map((entry) => Object.keys(entry))
//   // unique and randomize order
//   const mapped = [].concat(...keys).sort()
//   const emojiCategories = [...new Set(mapped)]
//   const emojiSeries: BasicChartsEntry[] = []

//   // Maybe this can be a computed instead of again looping over it?
//   authors.value.forEach((participant, idx: number) => {
//     const amount = []
//     emojiCategories.forEach((emoji) => {
//       amount.push(participantEmojis[idx][emoji] || 0)
//     })
//     emojiSeries.push({ name: participant.name.slice(2), data: amount })
//   })

//   emojiCat.value = emojiCategories
//   emojiData.value = emojiSeries

//   console.timeEnd('test')
// }
</script>
