<template>
  <div class="container">
    <q-icon
      v-if="showIcon"
      name="information"
      class="infoIcon"
    >
      <q-tooltip>Gekeken naar de woorden: {{ filterWords.join(', ') }}</q-tooltip>
    </q-icon>
    <highcharts :options="options" />
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

  showIcon: {
    type: Boolean,
    default: true,
  },
})

const series = computed(() => {
  return props.data.map((participant) => {
    const dataset = props.containsPerWord ? amountOfTimesPerWord(participant) : messagesContainsOneOfWord(participant)
    const data = props.showRelative ? dataset.map((item) => parseFloat(((item / participant.messages.length) * 100).toFixed(2))) : dataset

    return {
      name: participant.name,
      data,
    }
  })
})

function amountOfTimesPerWord(participant) {
  const amountOfTimesPerWord: number[] = []
  props.filterWords.forEach((word) => {
    amountOfTimesPerWord.push(participant.messages.filter((item) => item.message.includes(` ${word}`)).length)
  })
  return amountOfTimesPerWord
}

function messagesContainsOneOfWord(participant) {
  const withWords: Message[] = []

  props.filterWords.forEach((word) => {
    // See if word is included in the message and make sure it's already picked up by another word
    withWords.push(...participant.messages.filter((item) => item.message.includes(` ${word}`) && withWords.findIndex((chosen) => chosen.id == item.id) == -1))
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
    categories: computed(() => (props.containsPerWord ? props.filterWords : props.showRelative ? ['Totaal in %'] : ['Totaal'])),
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
