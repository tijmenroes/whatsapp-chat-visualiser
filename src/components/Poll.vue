<template>
  <q-card>
    <q-card-section>
      <div
        class="text-h6"
        v-text="title"
      ></div>
    </q-card-section>
    <ul>
      <li
        v-for="(item, idx) in options"
        class="text-left"
        :key="idx"
      >
        {{ item }}
      </li>
    </ul>
  </q-card>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
})
</script>
