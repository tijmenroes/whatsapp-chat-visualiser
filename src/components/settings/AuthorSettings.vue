<template>
  <div>
    <div
      v-for="setting in settings"
      :key="setting.index"
      class="row"
    >
      <!-- {{ setting }} -->
      <q-checkbox
        v-model="setting.show"
        label="Active"
      />

      <q-input
        filled
        v-model="setting.name"
        label="Name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps({
  authorSettings: {
    type: Array as PropType<AuthorSettings[]>,
    required: true,
  },
})

const settings = ref(props.authorSettings)
</script>
