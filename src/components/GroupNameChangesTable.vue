<template>
  <div class="container">
    <q-table
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
import type { PropType } from 'vue'
import { ref } from 'vue'
import { QTableColumn } from 'quasar'
import { Event } from '../utils/types'

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
  },
  {
    name: 'name',
    label: 'Door',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  { name: 'newName', align: 'left', label: 'Groepsnaam', field: 'newName', sortable: true },
]

function filterOutGroupNameChanges(message: string) {
  if (message.includes('changed the group name from')) {
    return true
  }

  return false
}

const rows = ref<{ date: string; name: string; event: string; newName: string }[]>([])

function getHours() {
  const filtered = props.data.filter((item) => filterOutGroupNameChanges(item.message))

  // Match after the string (" to ")
  const newNameRegex = RegExp('(?<=" to ").*')
  const mapped = filtered.map((item) => ({
    date: item.date,
    name: item.author,
    event: '',
    newName: item?.message?.match(newNameRegex)?.length ? item.message.match(newNameRegex)![0] : '',
  }))

  rows.value = mapped

  // const mapped = props.data.map((item) => ({
  //   date: item.date,
  //   name: item.author,
  //   event: getEventTypeFromMessage(item.message),
  // }))

  // rows.value = mapped
}

getHours()
</script>
