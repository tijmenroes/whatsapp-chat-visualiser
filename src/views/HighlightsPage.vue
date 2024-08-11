<template>
  <div class="q-pa-md">
    <q-carousel
      ref="carousel"
      class="carousel"
      swipeable
      animated
      v-model="slide"
      :fullscreen="fullscreen"
      control-color="primary"
      infinite
      navigation
    >
      <template #navigation-icon="{ active, btnProps, onClick }">
        <q-btn
          :class="{ active }"
          class="qarousel-navigation"
          size="xxs"
          :icon="btnProps.icon"
          flat
          round
          dense
          @click="onClick"
        />
      </template>

      <q-carousel-slide
        :name="1"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 1"
          @slide-next="slide++"
          :top-values="cardsContent[0]"
        />
      </q-carousel-slide>
      <q-carousel-slide
        :name="2"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 2"
          @slide-next="slide++"
          :top-values="cardsContent[1]"
        ></CarouselSlideCard>
      </q-carousel-slide>
      <q-carousel-slide
        :name="3"
        class="slide"
      >
        <CarouselSlideCard
          @slide-next="slide++"
          :top-values="cardsContent[2]"
          is-emoji
        ></CarouselSlideCard>
      </q-carousel-slide>

      <q-carousel-slide
        :name="4"
        class="slide"
      >
        <CarouselSlideCard
          @slide-next="slide++"
          :top-values="cardsContent[3]"
        ></CarouselSlideCard>
      </q-carousel-slide>

      <q-carousel-slide
        :name="5"
        class="slide"
      >
        <CarouselSlideCard
          @slide-reset="slide = 1"
          is-last
          :top-values="cardsContent[4]"
        ></CarouselSlideCard>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store'
import { ref, computed } from 'vue'
import CarouselSlideCard from '../components/highlights/CarouselSlideCard.vue'
import { CAROUSEL_CONTENT_OPTIONS } from '../config/carouselContentOptions'
import { TopValueEntry } from '@/utils/types'
import useTextLengthSeries from '@/composables/useTextLengthSeries.ts'

const store = useStore()

const slide = ref(1)
const fullscreen = ref(true)
const carousel = ref()

// Ignore for now
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const cardsContent = computed<Record<number, TopValueEntry[]>>(() => ({
  0: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'A total of...',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: totalMessagesSent.value,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'messages',
    },
  ],

  1: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'The biggest keyboard hero(ine) award goes to...',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: messagesPerAuthor.value[0]?.label,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: `${messagesPerAuthor.value[0]?.value} messages`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.leaderboard,
      values: messagesRanking.value.slice(0),
    },
  ],
  2: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'You just cannot live without sending this',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: emojiCount.value[0]?.label,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `It was sent a total of <strong>${emojiCount.value[0]?.value}</strong> times`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.leaderboard,
      values: emojiCount.value.slice(1),
    },
  ],
  3: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'The fastest typer is...',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: messagesPerAuthorTimed.value[0]?.label,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `Send an average of ${messagesPerAuthorTimed.value[0]?.value.toFixed(2)} messages per day`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.leaderboard,
      values: messagesPerAuthorTimed.value?.slice(1, 4).map((author) => ({ label: author.label, value: author.value.toFixed(2) })) || [],
    },
  ],
  4: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'This person just cannot stop typing...',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: textLength.value[0]?.name,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `Has an average message length of ${textLength.value[0]?.data} characters`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.leaderboard,
      values: textLength.value?.slice(1, 4).map((author) => ({ label: author.name, value: author.data[0] })) || [],
    },
  ],
}))

// Why did I use authorsData instead of messagesPerAuthor?
const authorsDataAllMessages = computed(() => store.authorsData)
const authorsDataMessages = computed(() => store.authorsDataMessages)
const messagesContainingEmoji = computed(() => store.messagesContainingEmoji)
const totalMessagesSent = computed(() => authorsDataAllMessages.value.map((author) => author.messages.length).reduce((acc, curr) => acc + curr, 0))
const messagesPerAuthor = computed(() => authorsDataAllMessages.value.map((author) => ({ label: author.name, value: author.messages.length })).sort((a, b) => b.value - a.value))
const messagesRanking = computed(() => messagesPerAuthor.value.filter((_, idx) => idx > 0 && idx < 4))
const textLength = computed(() => {
  const { series } = useTextLengthSeries(authorsDataMessages.value, true)

  return series.sort((a, b) => b.data[0] - a.data[0]).filter((_, idx) => idx < 4)
})

const emojiCount = computed(() => {
  const emojiCount = messagesContainingEmoji.value
    .flatMap((participant) => participant.messages)
    .flatMap((item) => item.emojis)
    ?.reduce(function (acc: Record<string, number>, curr) {
      return acc[curr || ''] ? ++acc[curr || ''] : (acc[curr || ''] = 1), acc
    }, {})

  const toSort = Object.entries(emojiCount || {}).sort((a, b) => b[1] - a[1])
  return toSort.splice(0, 4).map(([label, value]) => ({ label, value }))
})

const filterDate = computed(() => store.filterDate)
const totalDays = computed(() => (filterDate.value?.from && filterDate.value?.to ? Math.abs(filterDate.value?.to.getTime() - filterDate.value?.from.getTime()) / (1000 * 60 * 60 * 24) : 0))

const messagesPerAuthorTimed = computed(() => messagesPerAuthor.value.map((author) => ({ label: author.label, value: author.value / totalDays.value })))
</script>

<style scoped lang="scss">
@import '../styles/variables.sass';

.carousel {
  background-image: url('../assets/highlights-pattern.svg');
}

.qarousel-navigation {
  font-size: 5px !important;
  border: 2px solid $primary;
  border-radius: 50%;
  color: white;
}
.qarousel-navigation.active {
  width: 100px;
  background-color: $primary;
  color: $primary;
  border-radius: 16px;
}

.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .q-card {
    width: 700px;
    text-align: center;
  }
}

h1,
h2,
h3 {
  font-weight: 600;
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
