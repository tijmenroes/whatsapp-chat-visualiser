<template>
  <div class="container">
    <q-table
      ref="dataTable"
      class="emojiTable"
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
import { QTableColumn } from 'quasar'

const props = defineProps({
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },
})

const dataTable = ref()
const columns: QTableColumn[] = [
  {
    name: 'emoji',
    label: 'Emoji',
    field: 'emoji',
    align: 'left',
  },
  { name: 'value', align: 'left', label: 'Aantal', field: 'value', sortable: true },
]

const rows = reactive<{ emoji: string; value: number }[]>([])

function getHours() {
  // Misschien dit veranderen met een prop ofzo. Lijkt erg veel op de andere emoji table, Of misschien gewoon composable.
  const mapped = props.data.flatMap((participant) => {
    const containingEmoji = participant.messages.filter((message) => message.emojis)
    return containingEmoji.flatMap((item) => item.emojis)
  })
  const emojiCount: Record<string, number> = mapped.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})

  for (const key of Object.entries(emojiCount)) {
    rows.push({
      emoji: key[0],
      value: key[1],
    })
  }
}

onMounted(() => {
  // Hacky way to ensure it sorts DSC, first one triggers ASC
  dataTable.value.sort('value')
  dataTable.value.sort('value')
})
getHours()
</script>
