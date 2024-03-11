import { defineStore } from 'pinia'
import { startAnalysisFromFile, analyseText } from '../utils/baseScript'
import { Author } from '../utils/types'
import { ref, computed } from 'vue'

type AuthorSettings = {
  index: number
  name: string
  show: boolean
}

export const useStore = defineStore('global', () => {
  const authorsData = ref<Author[]>()
  const eventsData = ref()
  const authorsSettings = ref<AuthorSettings[]>([])

  // think of better name
  const authorsDataMessages = computed(() => {
    return authorsData.value
      ?.map((author) => ({
        authorIndex: author.authorIndex,
        name: authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.name,
        messages: author.messages.filter((message) => !message.isAttachment),
      }))
      .filter((author) => {
        return authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.show
      })
  })

  // think of better name
  const authorsDataAllMessages = computed(() => {
    return authorsData.value
      ?.map((author) => ({
        authorIndex: author.authorIndex,
        name: authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.name,
        messages: author.messages,
      }))
      .filter((author) => {
        return authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.show
      })
  })

  const messagesContainingEmoji = computed(() => {
    return authorsDataAllMessages.value?.map((author) => ({
      ...author,
      messages: author.messages.filter((message) => message.emojis),
    }))
  })

  // TODO: Make this better re-usable
  const messagesContainginAttachments = computed(() => {
    return authorsData.value
      ?.map((author) => ({
        authorIndex: author.authorIndex,
        name: authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.name,
        messages: author.messages.filter((message) => message.isAttachment),
      }))
      .filter((author) => {
        return authorsSettings.value.find((settingItem) => settingItem.index === author.authorIndex)?.show
      })
  })

  async function getData() {
    const { authors, events } = await startAnalysisFromFile()
    authors.forEach((author) => {
      authorsSettings.value.push({
        index: author.authorIndex,
        name: author.name,
        show: true,
      })
    })

    authorsData.value = authors
    eventsData.value = events
  }

  async function setStoreData(fileString: string) {
    const { authors, events } = await analyseText(fileString)
    authors.forEach((author) => {
      authorsSettings.value.push({
        index: author.authorIndex,
        name: author.name,
        show: true,
      })
    })

    authorsData.value = authors
    eventsData.value = events

    return
  }

  // unused for now.
  function saveAuthorSettings(settings: AuthorSettings[]) {
    authorsSettings.value = settings
  }

  if (import.meta.env.DEV) {
    console.log('uee')
    getData()
  }

  return { authorsData, eventsData, authorsDataMessages, authorsSettings, saveAuthorSettings, authorsDataAllMessages, messagesContainingEmoji, messagesContainginAttachments, setStoreData }
})
