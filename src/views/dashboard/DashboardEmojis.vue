<template>
  <div class="row dashboardView">
    <DashboardCard
      is-small
      title="Emoji's used total"
    >
      <EmojiTable :data="emojiMessages" />
    </DashboardCard>

    <DashboardCard
      is-small
      title="Emoji's used per person"
    >
      <EmojiTablePerPerson
        :data="emojiMessages"
        class="col-6"
      />
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EmojiTable from '@/components/EmojiTable.vue'
import EmojiTablePerPerson from '@/components/EmojiTablePerPerson.vue'
import { useStore } from '@/store'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { useSummaryStore } from '@/store/summary'
import { SUMMARY_COLLECTION } from '@/config/summaryItems'

const store = useStore()
const emojiMessages = computed(() => store.messagesContainingEmoji)

const summaryStore = useSummaryStore()
summaryStore.setSummaryState(SUMMARY_COLLECTION.emojis)
</script>
