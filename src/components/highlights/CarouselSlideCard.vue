<template>
  <q-card>
    <q-card-section>
      <div
        class="topValue"
        :style="{ opacity: showTopValues[idx] ? 1 : 0 }"
        v-for="(topValue, idx) in topValues"
        :key="idx"
      >
        <h3 v-if="topValue.type == CAROUSEL_CONTENT_OPTIONS.title">
          {{ topValue.value }}
        </h3>

        <h1
          class="text-primary q-ma-sm"
          v-if="topValue.type == CAROUSEL_CONTENT_OPTIONS.value"
          :class="{ isEmoji }"
        >
          {{ topValue.value }}
        </h1>

        <div
          v-if="topValue.type === CAROUSEL_CONTENT_OPTIONS.subtitle"
          v-html="topValue.value"
          class="subtitle heading-4"
        ></div>

        <div v-if="topValue.type === CAROUSEL_CONTENT_OPTIONS.leaderboard">
          <hr />

          <div class="leaderboard row justify-center">
            <div
              v-for="(author, authorIdx) in topValue.values"
              :key="authorIdx"
              class="leaderboardItem flex q-py-md q-px-lg"
            >
              <div class="number heading-4 q-pr-md">#{{ authorIdx + 2 }}</div>
              <div
                class="column items-start"
                v-if="author.label && author.value"
              >
                <div
                  class="text-primary heading-5 author"
                  :class="{ isEmoji }"
                >
                  {{ author.label }}
                </div>
                <div class="amountMessages text-bold">
                  {{ author.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <slot />

      <hr />
      <div class="flex justify-end q-py-md">
        <q-btn
          v-if="!isLast"
          color="primary"
          @click="emit('slide-next')"
        >
          Next
          <q-icon
            name="chevron_right"
            size="xs"
          />
        </q-btn>

        <div
          class="q-gutter-sm"
          v-else
        >
          <q-btn
            color="secondary"
            @click="emit('slide-reset')"
          >
            Start over
          </q-btn>

          <q-btn
            color="primary"
            :to="{ name: routeNames.dashboard_general }"
          >
            Go to dashboard
            <q-icon
              name="dashboard"
              size="xs"
            />
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import { CAROUSEL_CONTENT_OPTIONS } from '@/config/carouselContentOptions'
import { routeNames } from '@/config/routeNames'
import { TopValueEntry } from '@/utils/types'

const props = defineProps({
  isLast: {
    type: Boolean,
    default: false,
  },

  isEmoji: {
    type: Boolean,
    default: false,
  },

  topValues: {
    type: Array as PropType<TopValueEntry[]>,
    default: () => [],
  },
})
const emit = defineEmits(['slide-next', 'slide-reset'])

const showTopValues = ref<boolean[]>([])

props.topValues.forEach((_, idx) => {
  showTopValues.value.push(false)

  setTimeout(() => {
    showTopValues.value[idx] = true
  }, 750 * idx)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.sass';
h1,
h2,
h3 {
  font-weight: 600;
}

:deep(.subtitle) {
  strong {
    color: $primary;
  }
}

.topValue {
  transition: opacity 0.5s;
}

.leaderboard {
  //position: absolute;
  right: 20px;
  bottom: 20px;
  text-align: left;

  .leaderboardItem {
    .amountMessages,
    .number {
      opacity: 0.5;
    }

    .author {
      font-size: 20px;
    }

    border-right: 1px solid #e4e4e7;
    padding-bottom: 12px;

    &:last-child {
      border-right: none;
    }
  }
}

@media (max-width: 768px) {
  // TODO: Just do this with typography
  h1 {
    font-size: 3.2rem;
  }

  h3 {
    font-size: 1.8rem;
  }

  .slide {
    .q-card {
      width: 100%;
      // height: 100%;
      overflow: hidden;
    }
  }
}
</style>
