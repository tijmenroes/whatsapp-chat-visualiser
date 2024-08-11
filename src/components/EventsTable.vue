<template>
  <div class="container">
    <q-table
      ref="dataTable"
      outlined
      :rows="rows"
      :columns="columns"
      :pagination="{ rowsPerPage: 10 }"
      flat
      wrap-cells
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, computed } from 'vue'
import { QTableColumn } from 'quasar'
import { Event } from '@/utils/types'

const props = defineProps({
  data: {
    type: Array as PropType<Event[]>,
    required: true,
  },
})

const dataTable = ref()
const columns: QTableColumn[] = [
  {
    name: 'date',
    label: 'Datum',
    field: 'date',
    align: 'left',
    sortable: true,
    style: 'width: 100px',
  },

  { name: 'event', align: 'left', label: 'Event', field: 'message', sortable: true },
]

const rows = computed<Event[]>(() => props.data)
</script>
