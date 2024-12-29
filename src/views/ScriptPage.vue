<template>
  <div>
    <h1>Script</h1>
    <p>Welcome to the home page</p>
  </div>
</template>

<script setup lang="ts">
import { startAnalysisFromFile } from '../utils/baseScriptBatch'
import { useStore } from '@/store'

async function startAnalayse() {
  console.log('Starting analysis')
  const file = await startAnalysisFromFile()
  const store = useStore()
  store.analyseChatString(file)
}
startAnalayse()
// Probably no longer auto-starting the analysis, so we need to copy store content here.
</script>
