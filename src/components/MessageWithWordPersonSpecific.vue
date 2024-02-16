<template>
  <div class="container">
    <q-icon name="information">
      <q-tooltip>
        <div v-for="item in getHours">{{ item.name }} - {{ item?.words.join(', ') }}</div>
      </q-tooltip>
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

  filterWordsByPerson: {
    type: Array as PropType<{ authorId: number; filterWords: string[] }[]>,
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

const getHours = computed(() => {
  return props.filterWordsByPerson.map((item) => {
    const find = props.data.find((data) => data.authorIndex == item.authorId)

    if (find) {
      const data = messagesContainsOneOfWord(find.messages, item.filterWords)

      return {
        name: find.name,
        words: item.filterWords,
        data,
      }
    }
  })
})

function amountOfTimesPerWord(messages, filterWords) {
  const amountOfTimesPerWord: number[] = []
  filterWords.forEach((word: string) => {
    console.log(word)
    amountOfTimesPerWord.push(messages.filter((item) => item.message.includes(` ${word.toLowerCase()}`)).length)
  })
  return amountOfTimesPerWord
}

function messagesContainsOneOfWord(messages, filterWords) {
  const withWords: Message[] = []

  filterWords.forEach((word) => {
    console.log(word)
    // See if word is included in the message and make sure it's already picked up by another word
    withWords.push(...messages.filter((item) => item.message.includes(` ${word.toLowerCase()}`) && withWords.findIndex((chosen) => chosen.id == item.id) == -1))
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
  series: getHours.value,
  xAxis: {
    type: '',
    categories: props.containsPerWord ? props.filterWords : ['Totaal'],
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
.q-icon {
  position: absolute;
  top: 25px;
  right: 0;
}
.container {
  /* width: 800px; */
}
</style>
