<template>
  <div class="q-pa-md container">
    <q-carousel
      ref="carousel"
      class="carousel"
      swipeable
      animated
      v-model="slide"
      :fullscreen="true"
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

      <!-- TODO: Refactor with a v-for -->
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
          :top-values="cardsContent[5]"
        ></CarouselSlideCard>
      </q-carousel-slide>
      <q-carousel-slide
        :name="3"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 3"
          @slide-next="slide++"
          :top-values="cardsContent[1]"
        ></CarouselSlideCard>
      </q-carousel-slide>
      <q-carousel-slide
        :name="4"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 4"
          @slide-next="slide++"
          :top-values="cardsContent[2]"
          is-emoji
        ></CarouselSlideCard>
      </q-carousel-slide>

      <q-carousel-slide
        :name="5"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 5"
          @slide-next="slide++"
          :top-values="cardsContent[3]"
        ></CarouselSlideCard>
      </q-carousel-slide>

      <q-carousel-slide
        :name="6"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 6"
          @slide-next="slide++"
          :top-values="cardsContent[6]"
        ></CarouselSlideCard>
      </q-carousel-slide>

      <q-carousel-slide
        :name="7"
        class="slide"
      >
        <CarouselSlideCard
          v-if="slide == 7"
          @slide-next="slide++"
          :top-values="cardsContent[7]"
        ></CarouselSlideCard>
      </q-carousel-slide>

      <q-carousel-slide
        :name="8"
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
import { getHighestStreak } from '@/utils/getHighestStreak'

const store = useStore()

const slide = ref(1)
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

  5: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'The first message...',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `${firstMessage.value.message}`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `Sent on: ${firstMessage.value.date}`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `How time flies...`,
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

  6: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'Attachment queen alert! Guess who loves sending media the most?',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: mostAttachmentsSentBy.value?.name,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `Sent a total of ${mostAttachmentsSentBy.value?.messages.length} attachments`,
    },
  ],

  7: [
    {
      type: CAROUSEL_CONTENT_OPTIONS.title,
      value: 'Highest streak! (consecutive days with messages)',
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.value,
      value: `${highestStreak.maxStreak} days`,
    },
    {
      type: CAROUSEL_CONTENT_OPTIONS.subtitle,
      value: `From ${new Date(highestStreak.start).toLocaleDateString()} to ${new Date(highestStreak.end).toLocaleDateString()}`,
    },
  ],
}))

// Why did I use authorsData instead of messagesPerAuthor?
const authorsDataAllMessages = computed(() => store.authorsData)
const authorsDataMessages = computed(() => store.authorsDataMessages)
const messagesContainingEmoji = computed(() => store.messagesContainingEmoji)
const attachmentMessages = computed(() => store.messagesContainginAttachments)
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
const firstMessage = computed(() => {
  const allMessages = authorsDataMessages.value.flatMap((author) => author.messages)
  return allMessages.sort((a, b) => a.id - b.id)[0]
})

const mostAttachmentsSentBy = computed(() => {
  const sortedAttachments = [...attachmentMessages.value].sort((a, b) => b.messages.length - a.messages.length)
  return sortedAttachments.length > 0 ? sortedAttachments[0] : null
})
const allDates = [...new Set(store.messagesPerAuthor.flatMap((author) => author.messages.map((message) => new Date(message.date).getTime())).sort((a, b) => a - b))]
const highestStreak = getHighestStreak(allDates)
</script>

<style scoped lang="scss">
@import '../styles/variables.sass';

.carousel {
  height: 100%;
  background-image: url('../assets/highlights-pattern.svg');
}

.container {
  height: 100vh;
  width: 100vw;
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
