<template>
  <div class="row dashboardView">
    <DashboardCard title="Messages per day">
      <TimeSlide :data="allMessages" />
    </DashboardCard>

    <DashboardCard title="Messages per day of the week">
      <BarChart
        :series="messagesPerDay.series"
        :categories="messagesPerDay.categories"
      />
    </DashboardCard>

    <DashboardCard title="Messages per hour">
      <BarChart
        :series="messagesPerHour.series"
        :categories="messagesPerHour.categories"
      />
    </DashboardCard>

    <DashboardCard title="Heatmap of messages per day and hour">
      <HeatMap
        :series="messagesPerDayHour.series"
        :categories="messagesPerDayHour.categories"
      />
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TimeSlide from '@/components/TimeSlide.vue'
import BarChart from '@/components/BarChart.vue'
import HeatMap from '@/components/HeatMap.vue'
import { useStore } from '@/store'
import { useSummaryStore } from '@/store/summary'
import { SUMMARY_COLLECTION } from '@/config/summaryItems'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { messagePerDaySeries } from '@/composables/useMessagePerDaySeries.ts'

const store = useStore()
const summaryStore = useSummaryStore()
const allMessages = computed(() => store.messagesPerAuthor)
summaryStore.setSummaryState(SUMMARY_COLLECTION.dates)

const messagesPerDay = computed(() => messagePerDaySeries(allMessages.value, 'day'))
const messagesPerHour = computed(() => messagePerDaySeries(allMessages.value, 'hour'))
const messagesPerDayHour = computed(() => messagePerDaySeries(allMessages.value, 'dayHour'))
</script>
