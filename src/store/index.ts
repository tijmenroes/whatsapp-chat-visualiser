import { defineStore } from 'pinia'
import { startAnalysisFromFile, analyseBatch } from '../utils/baseScriptBatch'
import { Author, AuthorSettings, Event, SummaryItem } from '../utils/types'
import { ref, computed, reactive } from 'vue'
import { event } from 'vue-gtag'

export const useStore = defineStore('global', () => {
  const authorsData = ref<Author[]>([])
  const eventsData = ref<Event[]>([])
  const authorsSettings = ref<AuthorSettings[]>([])
  const hasValidChatEntered = computed(() => authorsData.value.length > 0)
  const isGroupChat = computed(() => authorsData.value.length > 2)

  const summaryItems = ref<SummaryItem[]>()
  const loadingInfo = ref({
    isActive: false,
    totalLines: 0,
    progress: 0,
  })

  function setSummaryItems(items: SummaryItem[]) {
    summaryItems.value = items
  }

  const totalDays = computed(() => (filterDate?.from && filterDate?.to ? Math.abs(filterDate?.to.getTime() - filterDate?.from.getTime()) / (1000 * 60 * 60 * 24) : 0))
  const filterDate = reactive({
    from: new Date(),
    to: new Date(),
  })
  const maxDates = reactive({
    from: new Date(),
    to: new Date(),
  })

  function setAuthorsSettings(settings: AuthorSettings[]) {
    authorsSettings.value = settings
  }

  function setMaxDates(from: string | Date, to: string | Date) {
    maxDates.from = new Date(from)
    maxDates.to = new Date(to)
  }

  function setFilterDate(from: string | Date, to: string | Date) {
    filterDate.from = new Date(from)
    filterDate.to = new Date(to)
  }

  // think of better name
  const messagesPerAuthor = computed(() => {
    return authorsData.value
      .map((author) => ({
        authorIndex: author.authorIndex,
        name: authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.name || author.name,
        messages: author.messages.filter((message) => new Date(message.date) >= filterDate.from && new Date(message.date) <= filterDate.to),
      }))
      .filter((author) => {
        return authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.show
      })
  })

  // think of better name
  const authorsDataMessages = computed(() => {
    return messagesPerAuthor.value?.map((author) => ({
      ...author,
      messages: author.messages.filter((message) => !message.isAttachment),
    }))
  })

  const messagesContainingEmoji = computed(() => {
    return messagesPerAuthor.value?.map((author) => ({
      ...author,
      messages: author.messages.filter((message) => message.emojis.length),
    }))
  })

  const messagesContainginAttachments = computed(() => {
    return messagesPerAuthor.value?.map((author) => ({
      ...author,
      messages: author.messages.filter((message) => message.isAttachment),
    }))
  })

  async function getData() {
    const file = await startAnalysisFromFile()
    const { authors, events, startDate, endDate } = await analyseChatString(file)
    authors.forEach((author) => {
      authorsSettings.value.push({
        index: author.authorIndex,
        name: author.name,
        show: true,
      })
    })

    authorsData.value = authors
    eventsData.value = events
    if (startDate && endDate) {
      setFilterDate(startDate, endDate)
      setMaxDates(startDate, endDate)
    }
  }

  async function analyseChatString(chat: string) {
    const state = { authors: [], events: [], polls: [], startDate: undefined, endDate: undefined, id: 0 } // Shared state for analysis

    // Batching might cut-off some messages. This is a trade-off for performance.
    const batchSize = 330000
    let batchIndex = 0
    const lines = chat.split('\n')
    const totalAmountBatches = Math.ceil(lines.length / batchSize)
    loadingInfo.value.totalLines = lines.length
    loadingInfo.value.isActive = lines.length > batchSize

    const timeStart = new Date().getTime()

    for (let i = 0; i < lines.length / batchSize; i++) {
      const batch = lines.slice(i * batchSize, (i + 1) * batchSize)
      batchIndex++
      await analyseBatch(batch, state, batchIndex === totalAmountBatches)
      loadingInfo.value.progress = batchIndex / totalAmountBatches

      await new Promise((resolve) => setTimeout(resolve, 1))
    }
    event('file_analysed', {
      total_lines: lines.length,
      total_authors: state.authors.length,
      total_events: state.events.length,
      time_elapsed: new Date().getTime() - timeStart,
    })

    loadingInfo.value.isActive = false

    return state
  }

  async function setStoreData(fileString: string) {
    authorsSettings.value = []
    const { authors, events, startDate, endDate } = await analyseChatString(fileString)
    authors.forEach((author) => {
      authorsSettings.value.push({
        index: author.authorIndex,
        name: author.name,
        show: true,
      })
    })

    authorsData.value = authors
    eventsData.value = events

    setFilterDate(startDate, endDate)
    setMaxDates(startDate, endDate)

    return hasValidChatEntered.value
  }

  function saveAuthorSettings(settings: AuthorSettings[]) {
    authorsSettings.value = settings
  }

  if (import.meta.env.DEV) {
    getData()
  }

  return {
    authorsData,
    eventsData,
    authorsDataMessages,
    authorsSettings,
    saveAuthorSettings,
    messagesPerAuthor,
    messagesContainingEmoji,
    messagesContainginAttachments,
    setStoreData,
    hasValidChatEntered,
    filterDate,
    totalDays,
    setFilterDate,
    summaryItems,
    setSummaryItems,
    isGroupChat,
    getData,
    maxDates,
    setAuthorsSettings,
    loadingInfo,
  }
})
