<template>
  <div class="row dashboardView">
    <DashboardCard title="Messages per day">
      <TimeSlide
        :data="allMessages"
        :per-author="false"
      />
    </DashboardCard>

    <DashboardCard
      title="Filter how many times words are used"
      subtitle="Fill in words to see how often they are used"
    >
      <q-btn
        color="secondary"
        class="q-mb-md"
        to="/dashboard/words"
      >
        Show in-depth analysis
      </q-btn>

      <q-select
        filled
        v-model="filterWords"
        multiple
        use-chips
        hide-dropdown-icon
        use-input
        new-value-mode="add"
        label="Filtered words"
      />

      <div class="row">
        <MessageWithWord
          class="col-12"
          :data="data"
          :filter-words="filterWords"
        />
      </div>
    </DashboardCard>

    <DashboardCard
      is-small
      title="Emoji's used total"
    >
      <EmojiTable
        :data="messagesContainingEmoji"
        class="q-pr-md"
      />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Emoji's used per person"
    >
      <EmojiTablePerPerson :data="messagesContainingEmoji" />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Attachments sent"
    >
      <!-- <AttachmentsChart :data="messagesContainginAttachments" />
       -->
      <BarChart
        :series="attachments.series"
        :categories="attachments.categories"
      />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Average message length"
    >
      <BarChart
        :series="textLength.series"
        :categories="textLength.categories"
      />
    </DashboardCard>

    <DashboardCard
      title="Events"
      v-if="events.length > 1"
    >
      <EventsTable :data="events" />
    </DashboardCard>

    <!-- <DashboardCard
      is-small
      v-if="isGroupChat"
      title="Group name changes"
    >
      <GroupNameChangesTable :data="events" /> -->
    <!-- </DashboardCard> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageWithWord from '@/components/MessageWithWord.vue'
import EmojiTable from '@/components/EmojiTable.vue'
import EmojiTablePerPerson from '@/components/EmojiTablePerPerson.vue'
import TimeSlide from '@/components/TimeSlide.vue'
import EventsTable from '@/components/EventsTable.vue'
// import GroupNameChangesTable from '@/components/GroupNameChangesTable.vue'
import { useStore } from '@/store'
import { useSummaryStore } from '@/store/summary'
import { SUMMARY_COLLECTION } from '@/config/summaryItems'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import BarChart from '@/components/BarChart.vue'
import useTextLengthSeries from '@/composables/useTextLengthSeries.ts'
import useAttachmentSeries from '@/composables/useAttachmentSeries.ts'

const store = useStore()
const filterWords = ref(['shit'])
const data = computed(() => store.authorsDataMessages)
const allMessages = computed(() => store.messagesPerAuthor)
const messagesContainingEmoji = computed(() => store.messagesContainingEmoji)
const messagesContainginAttachments = computed(() => store.messagesContainginAttachments)
const events = computed(() => store.eventsData)
// const isGroupChat = computed(() => store.isGroupChat)

const summaryStore = useSummaryStore()
summaryStore.setSummaryState(SUMMARY_COLLECTION.general)

const textLength = computed(() => useTextLengthSeries(data.value, true))
const attachments = computed(() => useAttachmentSeries(messagesContainginAttachments.value, false))

// test
// onMounted(() => {
//   function checkEmojiRendering() {
//     const emojiElements = document.querySelectorAll('.isEmoji')

//     emojiElements.forEach((el) => {
//       // const testEmoji = document.createElement('span')
//       if (el.textContent == '🥲') {
//         console.log(el)
//         el.classList.add('fallback')
//       }
//     })
//   }
//   checkEmojiRendering()
// })
</script>
