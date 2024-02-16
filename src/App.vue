<template>
  <div
    v-if="data"
    class="row q-col-gutter-lg"
  >
    <swiper
      :slides-per-view="1"
      :space-between="50"
      navigation
      :allow-touch-move="false"
      :modules="[Navigation, A11y]"
      class="q-px-xl"
      @slideChange="scrollWindowUp"
    >
      <!-- slide 1 -->
      <swiper-slide>
        <h2 class="slideTitle">Berichten over het jaar heen</h2>
        <div class="grid">
          <div class="">
            <q-card>
              <q-card-section>
                <div class="text-h6">Aantal berichten</div>
              </q-card-section>

              <div class="q-mt-lg text-bold text-h3">
                {{ totalAmounMessagesSum }}
              </div>
            </q-card>
          </div>

          <div class="">
            <q-card>
              <q-card-section>
                <div class="text-h6">Gemiddeld aantal berichten per dag</div>
              </q-card-section>

              <div class="q-mt-lg text-bold text-h3">
                {{ parseFloat(totalAmounMessagesSum / 365).toFixed(2) }}
              </div>
            </q-card>
          </div>

          <div class="">
            <q-card>
              <q-card-section>
                <div class="text-h6">Meest actieve dag: 17-02-2023</div>
              </q-card-section>
              <div class="q-mt-lg text-bold text-h3">
                <div>307 berichten</div>
              </div>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-xl">
          <div class="col12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Berichten per dag</div>
              </q-card-section>
              <TimeSlide :data="data" />
            </q-card>
          </div>

          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Berichten per uur</div>
              </q-card-section>
              <MessagePerHoursVue :data="data" />
            </q-card>
          </div>

          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Gemiddelde berichtlengte</div>
              </q-card-section>
              <TextLengthChart
                :data="data"
                show-relative
              />
            </q-card>
          </div>
        </div>
      </swiper-slide>

      <!-- slide 3 -->
      <swiper-slide>
        <h2 class="slideTitle">Media verstuurd</h2>
        <div class="row">
          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Media verstuurd totaal</div>
              </q-card-section>
              <AttachmentsChart :data="data" />
            </q-card>
          </div>

          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Media verstuurd relatief</div>
              </q-card-section>
              <AttachmentsChart
                :data="data"
                show-relative
              />
            </q-card>
          </div>
        </div>
      </swiper-slide>

      <!-- slide 2 -->
      <swiper-slide>
        <h2 class="slideTitle">Emoji's</h2>
        <div class="row">
          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Emoji aantal keren gebruikt</div>
              </q-card-section>
              <EmojiTable :data="data" />
            </q-card>
          </div>

          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Emoji aantal keren gebruikt per persoon</div>
              </q-card-section>
              <EmojiTablePerPerson
                :data="data"
                show-relative
              />
            </q-card>
          </div>
        </div>
      </swiper-slide>

      <!-- slide 4 -->
      <swiper-slide>
        <h2 class="slideTitle">Groep veranderingen</h2>
        <div class="row">
          <div class="col12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Events</div>
              </q-card-section>
              <EventsTable :data="allEvents" />
            </q-card>
          </div>

          <div class="col12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Chat namen</div>
              </q-card-section>
              <GroupNameChangesTable :data="allEvents" />
            </q-card>
          </div>
        </div>
      </swiper-slide>
      <!-- slide 4 -->
      <swiper-slide>
        <h2 class="slideTitle">Polls</h2>
        <div class="grid">
          <div
            class=""
            v-for="(poll, idx) in polls"
            :key="idx"
          >
            <Poll
              :title="poll.title"
              :options="poll.options"
            />
            <!-- <q-card>
              <q-card-section>
                <div class="text-h6">Events</div>
              </q-card-section>
              <EventsTable :data="allEvents" />
            </q-card> -->
          </div>
        </div>
      </swiper-slide>

      <swiper-slide>
        <h2 class="slideTitle">Grootste schreeuwerd</h2>
        <div class="row">
          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Aantal hoofdletters</div>
                <div class="subtitle">Aantal hoofdletters bij elkaar opgeteld</div>
              </q-card-section>
              <UpperCaseCharacters
                v-if="data"
                :data="data"
              />
            </q-card>
          </div>

          <div class="col6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Relatief</div>
                <div class="subtitle">Aantal hoofdletters gedeeld door het aantal karakters van alle berichten bij elkaar</div>
              </q-card-section>
              <UpperCaseCharacters
                v-if="data"
                :data="data"
                show-relative
              />
            </q-card>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { startAnalysisFromFile } from './utils/baseScript'
import MessageWithWord from './components/MessageWithWord.vue'
import UpperCaseCharacters from './components/UpperCaseCharacters.vue'
import GroupNameChangesTable from './components/GroupNameChangesTable.vue'
import EventsTable from './components/EventsTable.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, A11y } from 'swiper/modules'
import TimeSlide from './components/TimeSlide.vue'
import MessagePerHoursVue from './components/MessagePerHours.vue'
import MessageWithWordPersonSpecificVue from './components/MessageWithWordPersonSpecific.vue'
import AttachmentsChart from './components/AttachmentsChart.vue'
import TextLengthChart from './components/TextLengthChart.vue'
import EmojiTable from './components/EmojiTable.vue'
import EmojiTablePerPerson from './components/EmojiTablePerPerson.vue'
import Poll from './components/Poll.vue'

import 'swiper/css'
import 'swiper/css/navigation'

const data = ref()
const allEvents = ref()

const totalAmountMessages = computed(() => data.value?.map((item) => item.messages.length))
const totalAmounMessagesSum = computed(() => {
  let sum = 0
  totalAmountMessages.value?.forEach((item: number) => (sum += item))
  return sum
})
async function loadScript() {
  const { authors, events } = await startAnalysisFromFile()

  data.value = authors
  allEvents.value = events
}
loadScript()

function scrollWindowUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const polls = []

const authorPerPerson = [
  {
    authorId: 0,
    filterWords: [],
  },
  {
    authorId: 1,
    filterWords: [],
  },
  {
    authorId: 2,
    filterWords: [],
  },
  {
    authorId: 3,
    filterWords: [],
  },
  {
    authorId: 4,
    filterWords: [],
  },
]

// const data = []

// onMounted(() => {
// startAnalysisFromFile()
// })

// fetch('../public/chat-small.txt')
//   .then((res) => res.text())
//   .then((text) => {
//     console.log(text)
//   })
</script>
<style scoped lang="scss">
$colMargin: 24px;
.slideTitle {
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  // grid-column-gap: 5px;
  grid-row-gap: 12px;

  .q-card {
    margin: $colMargin 12px;
    height: 100%;
  }
}

.col3 {
  width: 32.33%;
  margin: $colMargin 0.33%;
}

.col6 {
  width: 48%;
  margin: $colMargin 1%;
}

.col12 {
  width: 98%;
  margin: $colMargin 1%;
}

.q-card {
  overflow: hidden;

  .q-icon {
    justify-content: initial;
    vertical-align: initial;
  }
  // .infoIcon {
  //   position: absolute;
  //   right: 0;
  //   top: 10px;
  // }
}
</style>
