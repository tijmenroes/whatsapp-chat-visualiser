import { defineStore } from 'pinia'
import { startAnalysisFromFile } from '../utils/baseScript'
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

  // think of name
  const authorsDataMessages = computed(() => {
    return authorsData.value?.map((author) => ({
      authorIndex: author.authorIndex,
      name: author.name,
      messages: author.messages.filter((message) => !message.isAttachment),
    }))
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

  getData()

  return { authorsData, eventsData, authorsDataMessages, authorsSettings }
})
