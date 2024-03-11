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
import { useStore } from './../store'
import { useRouter } from 'vue-router'

const file = ref<File | null>(null)
const store = useStore()
const router = useRouter()

function onFileUploaded(file: File) {
  const reader = new FileReader()

  reader.onload = async () => {
    await store.setStoreData(reader.result as string)
    router.push('/playground')
  }
  reader.readAsText(file)
}
</script>
