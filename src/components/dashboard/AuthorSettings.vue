<template>
  <div>
    <div class="row">
      <div class="col-3">
        <span>Show</span>
      </div>
      <div class="col-9">
        <span>Name</span>
      </div>
    </div>
    <div
      v-for="setting in settings"
      :key="setting.index"
      class="row q-my-sm"
    >
      <div class="col-3">
        <q-checkbox
          v-model="setting.show"
          label=""
        />
      </div>

      <div class="col-9">
        <q-input
          filled
          v-model="setting.name"
        />
      </div>
    </div>

    <div class="row justify-end">
      <q-btn
        :disable="!canSave"
        color="secondary"
        @click="saveSettings"
      >
        Save
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AuthorSettings } from '@/utils/types'
import { useStore } from '@/store'

const store = useStore()
const canSave = computed(() => settings.value.some((setting) => setting.show))
const settings = ref<AuthorSettings[]>(JSON.parse(JSON.stringify(store.authorsSettings)))
const emit = defineEmits(['close'])

function saveSettings() {
  if (!canSave.value) return
  store.setAuthorsSettings(settings.value)
  emit('close')
}
</script>
