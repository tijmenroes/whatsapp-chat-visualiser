<template>
  <q-card>
    <!-- {{ poll }} -->
    <q-card-section>
      <div
        class="text-h6"
        v-text="poll.question"
      />
      <p class="subtitle">{{ authorName?.name }} on {{ poll.date }}</p>
      <div
        v-for="(item, idx) in poll.options"
        class="text-left"
        :key="idx"
      >
        <!-- <b>{{ item.votes }} votes:</b> -->
        {{ item.option }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Poll } from '@/utils/types'
import { useStore } from '@/store'
import { computed } from 'vue'

const props = defineProps({
  poll: {
    type: Object as PropType<Poll>,
    required: true,
  },
})

const store = useStore()
// Maybe also filter on show?
const authorName = computed(() => store.authorsSettings.find((author) => props.poll.authorId === author.index))
</script>

<style scoped lang="scss">
.subtitle {
  font-size: 0.8rem;
}

.q-card {
  // fix auto margin for q-card, kinda annoying. Maybe just a specific class
  // margin: 0 !important;
}

li {
  /* list-style-type: none; */
  /* padding: 0; */
  /* margin: 0; */
}
</style>
