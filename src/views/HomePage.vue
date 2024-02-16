<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page</p>
    <q-file
      v-model="file"
      @update:model-value="onFileUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { analyseText } from '../utils/baseScript'

const file = ref<File | null>(null)

function onFileUploaded(file) {
  const reader = new FileReader()

  reader.onload = () => {
    const { authors, events } = analyseText(reader.result as string)
    console.log(authors, events)
  }
  reader.readAsText(file)
}
</script>
