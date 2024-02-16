<template>
  <div v-if="allMessages?.length">
    <h1>Playground</h1>
    <p>Playground</p>

    <AuthorSettings :author-settings="authorSettings" />

    <div class="row">
      <q-card class="col-12">
        <q-card-section>
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

    <q-card class="col-12">
      <q-card-section>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageWithWord from '../components/MessageWithWord.vue'
import EmojiTable from '../components/EmojiTable.vue'
import EmojiTablePerPerson from '../components/EmojiTablePerPerson.vue'
import AuthorSettings from '../components/settings/AuthorSettings.vue'
import { useStore } from '../store'

const store = useStore()
const filterWords = ref(['word'])
const data = computed(() => store.authorsDataMessages)
const allMessages = computed(() => store.authorsDataAllMessages)
const authorSettings = computed(() => store.authorsSettings)
const emojiMessages = computed(() => store.messagesContainingEmoji)
</script>
