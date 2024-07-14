<template>
  <div class="row dashboardView">
    <DashboardCard
      is-small
      title="Attachments sent"
    >
      <BarChart
        :series="attachmentsAbsolute.series"
        :categories="attachmentsAbsolute.categories"
      />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Average attachments sent per message"
    >
      <!-- <AttachmentsChart
        :data="attachmentMessages"
        show-relative
      /> -->
      <BarChart
        :series="attachmentsRelative.series"
        :categories="attachmentsRelative.categories"
      />
    </DashboardCard>

    <DashboardCard title="Attachments sent over time">
      <TimeSlide :data="attachmentMessages" />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Stickers sent"
    >
      <BarChart
        :series="attachmentsStickers.series"
        :categories="attachmentsStickers.categories"
      />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Videos sent"
    >
      <BarChart
        :series="attachmentsVideos.series"
        :categories="attachmentsVideos.categories"
      />
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '@/components/BarChart.vue'
import { useStore } from '@/store'
import TimeSlide from '@/components/TimeSlide.vue'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { useSummaryStore } from '@/store/summary'
import { SUMMARY_COLLECTION } from '@/config/summaryItems'
import useAttachmentSeries from '@/composables/useAttachmentSeries.ts'

const store = useStore()
const allMessages = computed(() => store.messagesPerAuthor)
const attachmentMessages = computed(() => store.messagesContainginAttachments)
const stickerMessages = computed(() => attachmentMessages.value?.map((author) => ({ ...author, messages: author.messages.filter((message) => message.message === '‎sticker weggelaten') })))
const videoMessages = computed(() => attachmentMessages.value?.map((author) => ({ ...author, messages: author.messages.filter((message) => message.message === '‎video weggelaten') })))

const summaryStore = useSummaryStore()
summaryStore.setSummaryState(SUMMARY_COLLECTION.media)

const attachmentsAbsolute = computed(() => useAttachmentSeries(attachmentMessages.value, false))
const attachmentsRelative = computed(() => useAttachmentSeries(allMessages.value, true))
const attachmentsStickers = computed(() => useAttachmentSeries(stickerMessages.value, false))
const attachmentsVideos = computed(() => useAttachmentSeries(videoMessages.value, false))
</script>
