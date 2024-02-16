<template>
  <div class="container">
    <q-table
      class="emojiTable"
      ref="dataTable"
      outlined
      :rows="rows"
      :columns="columns"
      :pagination="{ rowsPerPage: 10 }"
      flat
    />
  </div>
</template>

<script setup lang="ts">
import { Author } from '../utils/types.ts'
import type { PropType } from 'vue'
import { reactive, ref, onMounted } from 'vue'
import { countOccurrences, EMOJI_TABLE_ROWS } from '../utils/emojiTable'

const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },
})

const dataTable = ref()
const columns = EMOJI_TABLE_ROWS
const rows = reactive<{ emoji: string; value: number; author: string }[]>([])

function getHours() {
  // TODO: iets met author id's meegeven.
  props.data.map((participant) => {
    const containingEmoji = participant.messages.filter((message) => message.emojis)

    const allEmojis = containingEmoji.flatMap((item) => item.emojis)

    const emojiCount: Record<string, number> = countOccurrences(allEmojis)

    for (const key of Object.entries(emojiCount)) {
      rows.push({
        emoji: key[0],
        author: participant.name,
        value: key[1],
      })
    }
    // })

    return containingEmoji.flatMap((item) => item.emojis)
  })
}

// Misschien is juist hierom composable wel heel handig?
onMounted(() => {
  // Hacky way to ensure it sorts DSC, first one triggers ASC
  dataTable.value.sort('value')
  dataTable.value.sort('value')
})
getHours()
</script>
