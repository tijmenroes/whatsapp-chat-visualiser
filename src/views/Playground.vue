<template>
  <div>
    <h1>Playground</h1>
    <p>Playground</p>

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

    <MessageWithWord
      :data="data"
      :filter-words="filterWords"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageWithWord from '../components/MessageWithWord.vue'
import { useStore } from '../store'

const store = useStore()
const filterWords = ref(['word'])
const data = computed(() => store.authorsDataMessages)
</script>
