<template>
  <div class="container">
    <!-- <q-icon
      v-if="showIcon"
      name="information"
      class="infoIcon"
    >
  q-tooltip>Gekeken naar de woorden: {{ filterWords.join(', ') }}</q-tooltip>s
    </q-icon> -->
    <p
      v-if="!filterWords.length"
      class="q-mt-md"
    >
      No words selected
    </p>

    <highcharts :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Author, Message } from '../utils/types.ts'
import type { PropType } from 'vue'
import { reactive, computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },

  filterWords: {
    type: Array as PropType<string[]>,
    required: true,
  },

  // % of messages containing one of the words
  showRelative: {
    type: Boolean,
    default: false,
  },

  containsPerWord: {
    type: Boolean,
    default: false,
  },
})

const series = computed(() => {
  return props.data?.map((participant) => {
    const dataset = props.containsPerWord ? amountOfTimesPerWord(participant) : messagesContainsOneOfWord(participant)
    const data = props.showRelative ? dataset.map((item) => parseFloat(((item / participant.messages.length) * 100).toFixed(2))) : dataset

    return {
      name: participant.name,
      data,
      color: store.getColorByAuthorId(participant.authorIndex),
    }
  })
})

function amountOfTimesPerWord(participant: Author) {
  const amountOfTimesPerWord: number[] = []
  props.filterWords.forEach((word) => {
    amountOfTimesPerWord.push(participant.messages.filter((item) => item.message.includes(`${word.toLowerCase()}`)).length)
  })
  return amountOfTimesPerWord
}

function messagesContainsOneOfWord(participant: Author) {
  const withWords: Message[] = []

  props.filterWords.forEach((word) => {
    // See if word is included in the message and make sure it's already picked up by another word
    withWords.push(...participant.messages.filter((item) => item.message.includes(`${word.toLowerCase()}`) && withWords.findIndex((chosen) => chosen.id == item.id) == -1))
  })

  const data = [withWords.length]
  return data
}

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
    categories: computed(() => (props.containsPerWord ? props.filterWords : props.showRelative ? ['Total in %'] : ['Total'])),
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
.infoIcon {
  position: absolute;
  top: 25px;
  right: 0;
}
</style>
