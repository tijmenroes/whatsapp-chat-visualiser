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
  { name: 'event', align: 'left', label: 'Gebeurtenis', field: 'event', sortable: true },
]

const eventTypes = {
  descriptionChanged: 'Description changed',
  profileIconChanged: 'Profile picture changed',
  groupNameChanged: 'Group name changed',
}

function getEventTypeFromMessage(message: string) {
  if (message.includes('changed the group description')) {
    return eventTypes.descriptionChanged
  }
  if (message.includes('changed the group name from')) {
    return eventTypes.profileIconChanged
  }

  if (message.includes("changed this group's icon")) {
    return eventTypes.groupNameChanged
  }
  return 'unkown'
}

const rows = ref<{ date: string; name: string; event: string }[]>([])

function getHours() {
  const mapped = props.data.map((item) => ({
    date: item.date,
    name: item.author,
    event: getEventTypeFromMessage(item.message),
  }))

  rows.value = mapped
}

getHours()
</script>
