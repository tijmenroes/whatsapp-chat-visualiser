<template>
  <div>
    <div class="row colNames">
      <div class="col-2 flex justify-center items-center">
        <span>Show</span>
      </div>
      <div class="col-8">
        <span class="q-ml-md">Name</span>
      </div>

      <div class="col-2 flex justify-center items-center">
        <span>Color</span>
      </div>
    </div>
    <div
      v-for="setting in settings"
      :key="setting.index"
      class="row q-my-sm"
    >
      <div class="col-2 flex justify-center items-center">
        <q-checkbox
          v-model="setting.show"
          label=""
        />
      </div>

      <div class="col-8">
        <q-input
          filled
          v-model="setting.name"
        />
      </div>


      <div class="col-2 flex justify-center items-center">
        <div
          class="color-button q-pa-sm "
          :style="{ backgroundColor: setting.color }"
        >
          <q-menu>
            <q-color
              v-model="setting.color"
              no-header-tabs
              no-footer
              class="my-picker"
            />
          </q-menu>
        </div>
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

<style lang="scss" scoped>

.colNames {
  span {
    font-size: 0.8rem;
  }
}
.color-button {
  width: 32px;
  height: 32px;
  border-radius: 2px;
  cursor: pointer;
  margin-top: 1.3rem;
  margin: 12px 0;
  border: 1px solid #ccc;

  transition: 0.25s;

  &:hover {
    opacity: 0.8;
  }
}
</style>
