<template>
  <div class="row dashboardView">
    <div class="col-12">
      <q-card>
        <q-card-section>
          <h4>Messages over time</h4>
          <TimeSlide :data="allMessages" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TimeSlide from '@/components/TimeSlide.vue'
import { useStore } from '@/store'

const store = useStore()
const allMessages = computed(() => store.messagesPerAuthor)
store.setSummaryItems([])
</script>
