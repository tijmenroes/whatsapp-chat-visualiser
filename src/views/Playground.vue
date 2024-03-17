<template>
  <div v-if="allMessages?.length">
    <h1>Playground</h1>

    <q-btn
      @click="showwSettings = !showwSettings"
      label="Settings"
      class="q-mb-xl"
    ></q-btn>

    <q-dialog v-model="showwSettings">
      <q-card>
        <AuthorSettings :author-settings="authorSettings" />
      </q-card>
    </q-dialog>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <h4>Berichten over tijd</h4>
            <TimeSlide :data="allMessages" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <h4>Berichten per uur</h4>
            <MessagePerHours :data="allMessages" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <h4>Word filtering</h4>

            <q-select
              filled
              v-model="filterWords"
              multiple
              use-chips
              hide-dropdown-icon
              use-input
              new-value-mode="add"
              label="Multiple selection"
            />
            <div class="row">
              <MessageWithWord
                :data="data"
                :filter-words="filterWords"
              />

              <MessageWithWord
                :data="data"
                :filter-words="filterWords"
                contains-per-word
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <q-card>
          <q-card-section>
            <h4>Emoji's</h4>
            <div class="row">
              <EmojiTable
                :data="emojiMessages"
                class="col-6"
              />

              <EmojiTablePerPerson
                :data="emojiMessages"
                class="col-6"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="col-6">
          <q-card-section>
            <h4>Hoofdletters</h4>
            <UpperCaseCharacters :data="data" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="col-6">
          <q-card-section>
            <h4>Hoofdletters relatief</h4>
            <UpperCaseCharacters
              :data="data"
              show-relative
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card>
          <q-card-section>
            <div class="row">
              <h4>Attachments</h4>
              <AttachmentsChart :data="messagesContainginAttachments" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-card-section>
            <div class="row">
              <h4>Attachments relatief</h4>
              <AttachmentsChart
                :data="data"
                show-relative
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-card-section>
            <div class="row">
              <h4>Bericht lengte totaal</h4>
              <TextLengthChart :data="data" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-card-section>
            <div class="row">
              <h4>Gemiddelde bericht lengte</h4>
              <TextLengthChart
                :data="data"
                show-relative
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-card-section>
            <h4>Events</h4>
            <EventsTable :data="events" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-card-section>
            <h4>Group name changes</h4>
            <GroupNameChangesTable :data="events" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageWithWord from '../components/MessageWithWord.vue'
import EmojiTable from '../components/EmojiTable.vue'
import EmojiTablePerPerson from '../components/EmojiTablePerPerson.vue'
import AuthorSettings from '../components/settings/AuthorSettings.vue'
import UpperCaseCharacters from '../components/UpperCaseCharacters.vue'
import AttachmentsChart from '../components/AttachmentsChart.vue'
import TimeSlide from '../components/TimeSlide.vue'
import TextLengthChart from '../components/TextLengthChart.vue'
import EventsTable from '../components/EventsTable.vue'
import GroupNameChangesTable from '../components/GroupNameChangesTable.vue'
import MessagePerHours from '../components/MessagePerHours.vue'
import { useStore } from '../store'

const store = useStore()
const filterWords = ref(['word'])
const showwSettings = ref(false)
const data = computed(() => store.authorsDataMessages)
const allMessages = computed(() => store.authorsDataAllMessages)
const authorSettings = computed(() => store.authorsSettings)
const emojiMessages = computed(() => store.messagesContainingEmoji)
const messagesContainginAttachments = computed(() => store.messagesContainginAttachments)
const events = computed(() => store.eventsData)
</script>

<style scoped lang="scss">
.q-card {
  // margin: 12px;
}
</style>
