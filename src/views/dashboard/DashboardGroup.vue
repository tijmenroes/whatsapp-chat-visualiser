<template>
  <div class="row dashboardView">
    <div class="col-12">
      <DashboardCard title="Events">
        <EventsTable :data="events" />
      </DashboardCard>

      <div
        class="q-ma-md q-pt-xl"
        v-if="polls.length"
      >
        <h4>Polls</h4>

        <div class="row">
          <div
            class="col-xs-12 col-md-6"
            v-for="(poll, idx) in polls"
            :key="idx"
          >
            <Poll
              :poll="poll"
              class="q-ma-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Poll from '@/components/Poll.vue'
import { useStore } from '@/store'
import EventsTable from '@/components/EventsTable.vue'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const store = useStore()
const allMessages = computed(() => store.messagesPerAuthor)
const polls = computed(() => store.pollsData)
store.setSummaryItems([])
const events = computed(() => store.eventsData)
</script>
