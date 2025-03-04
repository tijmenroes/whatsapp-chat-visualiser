<template>
  <div class="SelectFileComponent column justify-center items-center">
    <q-file
      v-if="!isMobile"
      class="fileUpload"
      outlined
      v-model="file"
      accept=".zip, .txt"
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
              class="q-mb-md"
            />
            <span class="heading-4 text-bold q-my-md">Drop file here</span>

            <div class="text-uppercase text-muted row items-center q-my-lg">
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

        <q-inner-loading :showing="isLoading">
          <q-spinner-gears
            size="50px"
            color="primary"
          />
        </q-inner-loading>
      </template>
    </q-file>

    <!-- for mobile: -->
    <!-- <q-file
      outlined
      label="Select file"
      v-model="file"
      @update:model-value="onFileUploaded"
    ></q-file> -->

    <div
      v-else
      class="row justify-center"
    >
      <!-- <input
        type="file"
        accept=".zip, .txt"
        @change="handleMobileUpload"
      /> -->

      <div class="file-upload-container">
        <input
          type="file"
          id="file-upload"
          class="file-upload-input"
          accept=".zip, .txt"
          @change="handleMobileUpload"
        />
        <label
          for="file-upload"
          class="file-upload-label"
        >
          Choose a file
        </label>
      </div>

      <q-spinner
        v-if="isLoading"
        color="primary"
        class="q-mt-md"
        size="3em"
        :thickness="10"
      />
    </div>

    <q-dialog v-model="showErrorModal">
      <q-card class="settingsContent">
        <q-card-section class="row justify-between items-center full-width">
          <div class="heading-4 text-bold">Error in file</div>
          <q-icon
            name="close"
            size="md"
            @click="showErrorModal = false"
          />
        </q-card-section>
        <q-card-section>
          <p>The file you have entered is not able to be processed. Please try again with a different file.</p>
          <p>
            Below you can view the content of what you have uploaded, if you think this is valid please allow us to log this file.
            <br />
            This way we can fix the issue.
          </p>

          <div class="bg-grey-4">
            <q-scroll-area style="height: 200px">
              {{ errorFileContent }}
            </q-scroll-area>
          </div>

          <div class="row justify-end q-mt-md q-gutter-md">
            <q-btn @click="showErrorModal = false">Close</q-btn>
            <q-btn
              @click="sendLogToSentry"
              color="primary"
            >
              Send my file as log
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useStore } from './../store'
import { useRouter } from 'vue-router'
import JSZip from 'jszip'
import * as Sentry from '@sentry/vue'
import { Screen } from 'quasar'
import { event } from 'vue-gtag'

const file = ref<File | null>(null)
const isMobile = computed(() => Screen.lt.md)
const store = useStore()
const router = useRouter()
const isDragging = ref(false)
const showErrorModal = ref(false)
const errorFileContent = ref('')
const MAX_FILE_SIZE = 100000000
const isLoading = ref(false)

async function onFileUploaded(file: File) {
  isLoading.value = true
  event('file_upload')
  const ZIP_TYPES = ['application/zip', 'application/x-zip-compressed']

  if (!file.type) {
    // quick hack for now, see how to improve
    const isValid = await JSZip.loadAsync(file)
      .then(() => true)
      .catch(() => false)
    if (isValid) {
      // This is loading zip twice, small performance issue. But it works for now
      handleZip(file)
    } else {
      readFileContent(file)
    }
  } else {
    if (ZIP_TYPES.includes(file.type)) {
      handleZip(file)
    } else {
      readFileContent(file)
    }
  }
}

function readFileContent(file: File) {
  const reader = new FileReader()

  reader.onload = async () => {
    handleFileContent(reader.result as string)
  }
  reader.readAsText(file)
}

async function handleFileContent(fileContent: string) {
  const isValid = await store.setStoreData(fileContent)
  isLoading.value = false
  nextTick(() => {
    if (isValid) {
      router.push('/file-scanned')
    } else {
      showErrorModal.value = true
      errorFileContent.value = fileContent
      throw new Error('Invalid file')
    }
  })
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

async function handleZip(zipData: File) {
  JSZip.loadAsync(zipData)
    .then(function (zip) {
      // TODO: Improve
      const chatFile = Object.keys(zip.files).find((key) => key.includes('.txt'))
      if (chatFile) {
        return zip.files[chatFile].async('text')
      } else {
        isLoading.value = false
        alert('Chat file not found')
        throw new Error('Chat file not found')
      }
    })
    .then((res: string) => {
      return handleFileContent(res)
    })
}

function sendLogToSentry() {
  showErrorModal.value = false

  Sentry.getCurrentScope().addAttachment({
    filename: 'attachment.txt',
    data: JSON.stringify(errorFileContent.value),
  })

  Sentry.captureException(new Error('No authors in file found'), {
    tags: {
      fileContent: errorFileContent.value,
    },
  })

  nextTick(() => {
    errorFileContent.value = ''
    Sentry.getCurrentScope().clearAttachments()
  })
}

function handleMobileUpload($event: Event) {
  const target = $event.target as HTMLInputElement

  if (target && target.files) {
    Sentry.captureException(new Error('Mobile file upladoed'), {
      tags: {
        testString: 'Test string',
        fileName: JSON.stringify(target.files[0]?.name || 'No file name found'),
      },
    })
    onFileUploaded(target.files[0])
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.sass';

:deep(.fileUpload) {
  .q-field__control {
    height: 400px;
    width: 700px;

    &:before {
      border: transparent;
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

.file-upload-container {
  /* Hide the default file input */
  .file-upload-input {
    display: none; /* Hide the original input button */
  }

  /* Style the custom label that triggers the file input */
  .file-upload-label {
    display: inline-block;
    padding: 8px 16px;
    background-color: $primary;
    color: black;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }

  /* Add a focus effect */
  .file-upload-label:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(38, 143, 255, 0.5);
  }

  /* Style the file name text after file is selected */
  .file-upload-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
  }

  .file-upload-name {
    margin-top: 10px;
    font-size: 14px;
    color: black;
  }
}

@media (max-width: 768px) {
  .SelectFileComponent {
    width: 100%;
    border: none !important;
    .fileUpload {
      width: 100%;
    }
  }
  :deep(.fileUpload) {
    .q-field__control {
      height: 300px;
      width: 100%;
    }
  }
}
</style>
