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
    >
      <template #body-cell-emoji="slotProps">
        <q-td>
          <div class="isEmoji">
            {{ slotProps.row.emoji }}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { Author } from '../utils/types.ts'
import type { PropType } from 'vue'
import { computed, ref, onMounted } from 'vue'
import { countOccurrences, EMOJI_TABLE_ROWS } from '../utils/emojiTable'

const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },
})

interface EmojiTableRow {
  emoji: string
  value: number
  author: string
}
const dataTable = ref()
const columns = EMOJI_TABLE_ROWS

const rows = computed<EmojiTableRow[]>(() => {
  const rows: EmojiTableRow[] = []

  props.data.map((participant) => {
    const allEmojis = participant.messages.flatMap((item) => item.emojis)

    const emojiCount: Record<string, number> = countOccurrences(allEmojis)

    for (const key of Object.entries(emojiCount)) {
      rows.push({
        emoji: key[0],
        author: participant.name,
        value: key[1],
      })
    }
  })

  return rows
})

onMounted(() => {
  // Hacky way to ensure it sorts DSC, first one triggers ASC
  dataTable.value.sort('value')
  dataTable.value.sort('value')
})
</script>
