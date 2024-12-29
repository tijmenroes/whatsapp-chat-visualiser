<template>
  <div class="row dashboardView">
    <DashboardCard
      title="Filter how many times words are used"
      subtitle="Fill in words to see how often they are used"
    >
      <q-select
        filled
        v-model="filterWords"
        multiple
        use-chips
        hide-dropdown-icon
        use-input
        new-value-mode="add"
        label="Multiple selection"
      />
      <div class="row">
        <MessageWithWord
          class="col-6"
          :data="data"
          :filter-words="filterWords"
        />

        <MessageWithWord
          class="col-6"
          :data="data"
          :filter-words="filterWords"
          contains-per-word
        />
      </div>
    </DashboardCard>

    <DashboardCard
      title="Relatively used total"
      is-small
    >
      <MessageWithWord
        class="col-6"
        :data="data"
        :filter-words="filterWords"
        show-relative
      />
    </DashboardCard>

    <DashboardCard
      title="Relatively used per word"
      is-small
    >
      <MessageWithWord
        class="col-6"
        :data="data"
        :filter-words="filterWords"
        contains-per-word
        show-relative
      />
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageWithWord from '@/components/MessageWithWord.vue'
import { useStore } from '@/store'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { useSummaryStore } from '@/store/summary'
import { SUMMARY_COLLECTION } from '@/config/summaryItems'

const store = useStore()
const filterWords = ref(['shit'])
const data = computed(() => store.authorsDataMessages)

const summaryStore = useSummaryStore()
summaryStore.setSummaryState(SUMMARY_COLLECTION.words)
</script>
