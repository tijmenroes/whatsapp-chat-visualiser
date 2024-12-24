<template>
  <div class="SidebarRight">
    <div class="flex justify-end q-gutter-sm q-mb-md">
      <q-btn
        color="secondary"
        to="/highlights"
      >
        <q-icon
          name="thumb_up"
          size="xs"
          class="q-mr-sm"
        />
        View highlights
      </q-btn>
      <q-btn
        @click="showwSettings = !showwSettings"
        color="secondary"
      >
        <q-icon
          name="settings"
          size="xs"
          class="q-mr-sm"
        />
        Settings
      </q-btn>
    </div>
    <div class="column">
      <div class="q-pb-sm">{{ formatDate(date) }}</div>

      <q-btn color="secondary">
        <q-icon name="date_range" />
        Filter period

        <q-menu v-model="showDatePicker">
          <VueDatePicker
            inline
            model-auto
            :min-date="maxDates.from"
            :max-date="maxDates.to"
            range
            v-model="date"
            @update:model-value="updateDate"
            :enable-time-picker="false"
          >
            <template #action-row="{ internalModelValue, selectDate }">
              <div class="q-pa-md">
                <p>
                  {{ formatDate(internalModelValue) }}
                </p>
                <div class="row justify-end q-col-gutter-sm full-width">
                  <div v-if="!maxRangeSelected">
                    <q-btn
                      color="secondary"
                      @click="selectMaxRange"
                    >
                      Max range
                    </q-btn>
                  </div>
                  <div>
                    <q-btn
                      color="primary"
                      class="select-button"
                      @click="selectDate"
                    >
                      Select Date
                    </q-btn>
                  </div>
                </div>
              </div>
            </template>
          </VueDatePicker>
        </q-menu>
      </q-btn>

      <div class="row">
        <q-intersection
          transition="slide-up"
          once
          class="col-xs-12 col-sm-6 col-md-12"
          v-for="(summaryItem, summaryIdx) in summaryItems"
          :key="summaryIdx"
        >
          <q-card class="summaryCard q-mt-md">
            <q-card-section>
              <div class="row justify-between items-center">
                <div class="text-bold">
                  {{ summaryItem.title }}
                </div>
                <q-icon :name="summaryItem.icon" />
              </div>
              <div v-if="summaryItem.showValue">
                <div
                  class="text-primary heading-3 text-bold"
                  :class="summaryItem.class"
                >
                  {{ summaryItem.value }}
                </div>
                <div class="text-muted">
                  {{ summaryItem.subtitle }}
                </div>
              </div>

              <div
                v-else
                class="text-bold"
              >
                Not enough data!
              </div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </div>
    </div>

    <q-dialog
      v-model="showwSettings"
      title="Participant settings"
      :maximized="isMobile"
    >
      <q-card class="settingsContent">
        <q-card-section class="row justify-between items-center full-width">
          <div class="heading-4 text-bold">Participant settings</div>
          <q-icon
            name="close"
            size="md"
            @click="showwSettings = false"
          />
        </q-card-section>
        <q-card-section>
          <AuthorSettings @close="showwSettings = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
// TODO: Use store to show these cards, and make them dynamic. Top part should be static
import { ref, computed } from 'vue'
import { useSummaryStore } from '@/store/summary'
import { useStore } from '@/store'
import AuthorSettings from '@/components/dashboard/AuthorSettings.vue'
import dayjs from 'dayjs'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { Screen } from 'quasar'

const store = useStore()
const showDatePicker = ref(false)
const summaryStore = useSummaryStore()

const showwSettings = ref(false)
const summaryItems = computed(() => summaryStore.summaryItems)

const { updateDate, selectMaxRange, formatDate, date, maxDates, maxRangeSelected } = dateHandler()

const isMobile = computed(() => Screen.lt.md)

function dateHandler() {
  const maxDates = computed(() => store.maxDates)
  const date = ref([maxDates.value.from, maxDates.value.to])
  const maxRangeSelected = computed(() => date.value[0] === maxDates.value.from && date.value[1] === maxDates.value.to)

  function updateDate(value: Date[] | Date | null) {
    // just to bypass vueDatePicker TS error. It will never be single date.
    if (!value || !Array.isArray(value)) return

    if (Array.isArray(value)) {
      store.setFilterDate(value[0], value[1])
      showDatePicker.value = false
    }
  }

  function selectMaxRange() {
    date.value = [maxDates.value.from, maxDates.value.to]
    updateDate(date.value)
  }

  function formatDate(date: Date[] | Date | null) {
    if (!date || !Array.isArray(date)) return ''
    return date.map((d) => dayjs(d).format('DD MMM, YYYY')).join(' - ')
  }

  return {
    updateDate,
    selectMaxRange,
    formatDate,
    date,
    maxRangeSelected,
    maxDates,
  }
}
</script>

<style lang="scss" scoped>
.settingsContent {
  width: 500px;
}
</style>
