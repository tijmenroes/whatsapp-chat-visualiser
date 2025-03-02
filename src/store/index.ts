import { defineStore } from 'pinia'
import { startAnalysisFromFile, analyseBatch } from '../utils/script/analyseChat'
import { Author, AuthorSettings, Event, Poll, SummaryItem, Message } from '../utils/types'
import { groupBy } from '@/utils/helperFunctions'
import { ref, computed, reactive } from 'vue'
import { event } from 'vue-gtag'
import * as Sentry from '@sentry/vue'
import { DEFAULT_COLORS } from '../config/highcharts'

export const useStore = defineStore('global', () => {
  const messagesData = ref<Message[]>([])

  const authorsData = ref<Author[]>([])
  const eventsData = ref<Event[]>([])
  const pollsData = ref<Poll[]>([])

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

  function getColorByAuthorId(authorId: number) {
    return authorsSettings.value.find((setting) => setting.index === authorId)?.color || ''
  }

  function setMaxDates(from: string | Date, to: string | Date) {
    maxDates.from = new Date(from)
    maxDates.to = new Date(to)
  }

  function setFilterDate(from: string | Date, to: string | Date) {
    filterDate.from = new Date(from)
    filterDate.to = new Date(to)
  }

  // TODO: Extend this
  const filteredMessages = computed(() =>
    messagesData.value.filter(
      (message) => new Date(message.date) >= filterDate.from && new Date(message.date) <= filterDate.to && authorsSettings.value.find((settingItem) => settingItem.index === message.authorId)?.show
    )
  )

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
    await setStoreData(file, true)
    return
  }

  async function analyseChatString(chat: string, isDemo = false) {
    const state = { authors: [], events: [], messages: [], polls: [], startDate: undefined, endDate: undefined, id: 0 } // Shared state for analysis

    // Batching might cut-off some messages. This is a trade-off for performance.
    const batchSize = 330000
    let batchIndex = 0
    const lines = chat.split('\n')
    const lang = detectLanguage(lines[0])
    const totalAmountBatches = Math.ceil(lines.length / batchSize)
    loadingInfo.value.totalLines = lines.length
    loadingInfo.value.isActive = lines.length > batchSize

    const timeStart = new Date().getTime()

    for (let i = 0; i < lines.length / batchSize; i++) {
      const batch = lines.slice(i * batchSize, (i + 1) * batchSize)
      batchIndex++
      await analyseBatch(batch, state, batchIndex === totalAmountBatches, lang)
      loadingInfo.value.progress = batchIndex / totalAmountBatches

      await new Promise((resolve) => setTimeout(resolve, 1))
    }
    if (!isDemo) {
      event('file_analysed', {
        total_lines: determineRange(lines.length),
        lang,
      })

      Sentry.captureMessage('File analysed', {
        level: 'info', // Severity level (info, warning, error, etc.)
        tags: { event: 'file_analysed' }, // Add tags for filtering in Sentry
        extra: {
          total_lines: lines.length,
          total_authors: state.authors.length,
          total_events: state.events.length,
          lang,
          time_elapsed: new Date().getTime() - timeStart,
        },
      })
    }

    loadingInfo.value.isActive = false

    return state
  }

  async function setStoreData(fileString: string, isDemo = false) {
    authorsSettings.value = []

    const colors = DEFAULT_COLORS
    const { authors, messages, events, startDate, endDate, polls } = await analyseChatString(fileString, isDemo)
    authors.forEach((author) => {
      authorsSettings.value.push({
        index: author.authorIndex,
        name: author.name,
        color: colors[author.authorIndex] || '',
        show: true,
      })
    })

    const groupedAuthor = groupBy(messages, 'authorId')

    const mappedAuthors = Object.keys(groupedAuthor).map((key) => {
      const authorIndex = parseInt(key)
      const author = authors.find((author) => author.authorIndex === authorIndex)
      const authorSetting = authorsSettings.value.find((settingItem) => settingItem.index === authorIndex)
      const authorName = authorSetting?.name || author?.name
      return {
        authorIndex: authorIndex,
        name: authorName,
        messages: groupedAuthor[key],
      }
    })
    authorsData.value = mappedAuthors

    messagesData.value = messages
    eventsData.value = events
    pollsData.value = polls
    if (startDate && endDate && startDate !== 'Invalid Date' && endDate !== 'Invalid Date') {
      setFilterDate(startDate, endDate)
      setMaxDates(startDate, endDate)
    }

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
    pollsData,
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
    getColorByAuthorId,
    setAuthorsSettings,
    loadingInfo,
    analyseChatString,
    filteredMessages,
  }
})

function detectLanguage(firstLine: string) {
  const encryptionMessages = {
    'worden end-to-end versleuteld': 'nl',
    'Messages and calls are end-to-end encrypted.': 'en',
    'I messaggi e le chiamate sono crittografati end-to-end.': 'it',
    'Los mensajes y las llamadas están cifrados de extremo a extremo': 'es',
    'sind Ende-zu-Ende-verschlüsselt': 'de',
    'Les messages et les appels sont chiffrés de bout en bout': 'fr',
    'criptografadas de ponta a ponta. ': 'pt-br', // Brazilian Portuguese
    'As mensagens e chamadas são encriptadas ponto a ponto.': 'pt-pt', // European Portuguese
    'Сообщения и звонки защищены сквозным шифрованием. Никто вне этого чата, даже WhatsApp, не может их прочитать или прослушать.': 'ru',
  }

  let detectedLanguage = ''

  Object.entries(encryptionMessages).forEach(([key, value]) => {
    if (firstLine.includes(key)) {
      detectedLanguage = value
    }
  })
  if (!detectedLanguage) {
    console.log('Language not detected:', firstLine)
    event('language_not_detected', { firstLine, navigatorLanguage: navigator.languages })

    Sentry.captureMessage('Lnaguage not detected', {
      level: 'info', // Severity level (info, warning, error, etc.)
      tags: { event: 'lang_not_detected' }, // Add tags for filtering in Sentry
      extra: {
        nav_language: navigator.languages,
        firstLine,
      },
    })
  } else {
    console.log('Detected language:', detectedLanguage)
  }
  return detectedLanguage
}

function determineRange(lineCount: number) {
  if (lineCount <= 15000) return '1-15000'
  if (lineCount <= 100000) return '15000-100000'
  if (lineCount <= 500000) return '100000-500000'
  return '500000+'
}
