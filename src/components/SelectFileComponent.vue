<template>
  <div class="column justify-center items-center HomePage">
    <q-file
      class="fileUpload"
      outlined
      v-model="file"
      accept=".txt"
      @update:model-value="onFileUploaded"
    >
      <template #default>
        <div
          class="dropArea fileContent"
          :class="{ isDragging }"
          @drop.prevent="onDrop"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @dragover.prevent
        >
          <div
            v-if="isDragging"
            class="column align-center items-center"
          >
            <q-icon
              size="xl"
              name="upload"
            />
            <div class="heading-4">Drop it like it's hot</div>
          </div>
        </div>
        <div
          class="fileContent"
          v-if="!isDragging"
        >
          <div class="column align-center items-center">
            <q-icon
              size="xl"
              name="upload"
            />
            <span class="heading-4 q-my-md">Drop file here</span>

            <div class="text-uppercase text-muted row items-center">
              <div class="minus" />
              <span>or select file manually</span>
              <div class="minus" />
            </div>
            <q-btn
              class="q-mt-md"
              label="Select file"
              icon="upload"
              color="primary"
            />
          </div>
        </div>
      </template>
    </q-file>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from './../store'
import { useRouter } from 'vue-router'

const file = ref<File | null>(null)
const store = useStore()
const router = useRouter()
const isDragging = ref(false)
const MAX_FILE_SIZE = 100000000

function onFileUploaded(file: File) {
  const reader = new FileReader()

  reader.onload = async () => {
    // console.log(reader.result)
    console.log('loaded file')
    await store.setStoreData(reader.result as string)
    router.push('/file-scanned')
  }
  reader.readAsText(file)
}

function onDrop(event: DragEvent) {
  if (event.dataTransfer?.files) {
    const file = event.dataTransfer.files[0]
    if (file.size > MAX_FILE_SIZE) {
      alert('File exceeded the maximum size of 100MB')
      throw new Error('File is too big')
    } else {
      onFileUploaded(file)
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.fileUpload) {
  .q-field__control {
    height: 400px;
    width: 700px;

    &:before {
      border: 1px dashed #e4e4e7;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    }
  }
}
.dropArea {
  z-index: 99;
  position: absolute;
  width: 100%;
  height: 100%;

  &.isDragging {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.fileContent {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.minus {
  width: 15px;
  height: 2px;
  background-color: $text-muted;
  margin: 0 4px;
}
</style>
