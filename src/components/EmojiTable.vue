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
// TODO: Some chrome versions won't show certain emohji's. See if we can fix this.
import { Author } from '../utils/types.ts'
import type { PropType } from 'vue'
import { ref, onMounted, computed } from 'vue'
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

const rows = computed(() => {
  const emojiCount: Record<string, number> = props.data
    .flatMap((participant) => participant.messages)
    .flatMap((item) => item.emojis)
    ?.reduce(function (acc: Record<string, number>, curr) {
      // if (!curr) return acc;
      // TODO: CHECK
      // console.log(acc)
      // console.log(curr)
      return acc[curr || ''] ? ++acc[curr || ''] : (acc[curr || ''] = 1), acc
    }, {})

  const rows = []

  for (const key of Object.entries(emojiCount)) {
    rows.push({
      emoji: key[0],
      value: key[1],
    })
  }

  return rows
})

onMounted(() => {
  // Hacky way to ensure it sorts DSC, first one triggers ASC
  dataTable.value.sort('value')
  dataTable.value.sort('value')
})
</script>
