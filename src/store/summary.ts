import { defineStore } from 'pinia'
import { SummaryItem } from '../utils/types'
import { ref, computed } from 'vue'
import { useStore } from './index'
import { SUMMARY_COLLECTION } from '@/config/summaryItems'
import { getHighestStreak } from '@/utils/getHighestStreak'

export const useSummaryStore = defineStore('summary', () => {
  const globalStore = useStore()

  function pickSummaryItems() {
    switch (summaryState.value) {
      case SUMMARY_COLLECTION.general:
        return [totalMessagesSentItem.value, totalEmojiCount.value, highestStreakItem.value]
      case SUMMARY_COLLECTION.dates:
        return [totalMessagesSentItem.value, mostMessagesSentItem.value]
      case SUMMARY_COLLECTION.emojis:
        return [totalEmojiCount.value, biggestEmojiUserItem.value]
      case SUMMARY_COLLECTION.words:
        return [totalMessagesSentItem.value, mostMessagesSentItem.value]
      case SUMMARY_COLLECTION.media:
        return [totalAttachmentsSentItem.value, mostAttachmentsSentItem.value]
      default:
        return []
    }
  }
  const summaryState = ref(SUMMARY_COLLECTION.general)
  const summaryItems = computed<SummaryItem[] | []>(() => pickSummaryItems())

  function setSummaryState(state: string) {
    summaryState.value = state
  }

  function formatAverageNumber(value: number) {
    if (!value) return 0
    return (value / totalDays.value).toFixed(2)
  }

  const { totalEmojiCount, biggestEmojiUserItem } = emojiSummaryHandler()
  const { totalMessagesSentItem, mostMessagesSentItem } = summaryItemsHandler()
  const { totalAttachmentsSentItem, mostAttachmentsSentItem } = attachmentSummaryHandler()
  const { highestStreakItem } = generalItemsHandler()

  const totalDays = computed(() => globalStore.totalDays)
  const allMessages = computed(() => globalStore.messagesPerAuthor)

  function attachmentSummaryHandler() {
    const messagesWithAttachments = computed(() => globalStore.messagesContainginAttachments)
    const totalAttachments = computed(() => messagesWithAttachments.value.flatMap((author) => author.messages))
    const totalAttachmentsPerAuthor = computed(() => messagesWithAttachments.value.sort((a, b) => b.messages.length - a.messages.length))

    const mostAttachmentsSentItem = computed<SummaryItem>(() => ({
      title: 'Most attachments sent',
      value: totalAttachmentsPerAuthor.value[0]?.name || 'No attachments sent',
      subtitle: `Daily average ${formatAverageNumber(totalAttachmentsPerAuthor.value[0]?.messages.length)} attachments`,
      icon: 'attach_file',
      class: '',
      showValue: !!totalAttachmentsPerAuthor.value[0]?.messages.length,
    }))

    const totalAttachmentsSentItem = computed<SummaryItem>(() => ({
      title: 'Total attachments sent',
      value: totalAttachments.value.length,
      icon: 'attach_file',
      subtitle: `Daily average ${formatAverageNumber(totalAttachments.value.length)} attachments`,
      class: '',
      showValue: !!totalAttachments.value,
    }))

    return { totalAttachmentsSentItem, mostAttachmentsSentItem }
  }

  function emojiSummaryHandler() {
    const messagesContainingEmoji = computed(() => globalStore.messagesContainingEmoji)
    const emojiCount = computed(() => {
      const emojiCount = messagesContainingEmoji.value
        .flatMap((participant) => participant.messages)
        .flatMap((item) => item.emojis)
        ?.reduce(function (acc: Record<string, number>, curr) {
          return acc[curr || ''] ? ++acc[curr || ''] : (acc[curr || ''] = 1), acc
        }, {})

      const toSort = Object.entries(emojiCount || {}).sort((a, b) => b[1] - a[1])
      return toSort.splice(0, 4).map(([emoji, count]) => ({ emoji, count }))
    })

    const totalEmojiCount = computed<SummaryItem>(() => ({
      title: 'Most used emoji',
      value: emojiCount.value[0]?.emoji || 'No emoji used',
      subtitle: `Daily average ${formatAverageNumber(emojiCount.value[0]?.count)} times used`,
      icon: 'mood',
      class: 'isEmoji',
      showValue: !!emojiCount.value[0]?.count,
    }))

    const emojisPerAuthor = computed(() =>
      messagesContainingEmoji.value
        .map((participant) => ({ name: participant.name, messages: participant.messages.flatMap((item) => item.emojis) }))
        .sort((a, b) => b.messages.length - a.messages.length)
    )

    const biggestEmojiUserItem = computed<SummaryItem>(() => ({
      title: 'Biggest emoji user',
      value: emojisPerAuthor.value[0]?.name || 'No emoji used',
      subtitle: `Daily average ${formatAverageNumber(emojisPerAuthor.value[0]?.messages.length)} times`,
      icon: 'mood',
      class: '',
      showValue: !!emojisPerAuthor.value[0]?.messages.length,
    }))

    return {
      totalEmojiCount,
      biggestEmojiUserItem,
    }
  }

  function summaryItemsHandler() {
    const totalMessagesSent = computed(() => allMessages.value.map((author) => author.messages.length).reduce((acc, curr) => acc + curr, 0))
    const messagesPerAuthor = computed(() => allMessages.value.map((author) => ({ name: author.name, messages: author.messages.length })).sort((a, b) => b.messages - a.messages))

    const mostMessagesSentItem = computed(() => ({
      title: 'Most messages sent',
      value: messagesPerAuthor.value[0].name,
      subtitle: `Daily average ${formatAverageNumber(messagesPerAuthor.value[0].messages)} messages`,
      icon: 'keyboard',
      class: '',
      showValue: !!messagesPerAuthor.value[0].messages,
    }))

    const totalMessagesSentItem = computed(() => ({
      title: 'Total messages sent',
      value: totalMessagesSent.value,
      icon: 'message',
      subtitle: `Daily average ${formatAverageNumber(totalMessagesSent.value)} messages`,
      class: '',
      showValue: !!totalMessagesSent.value,
    }))

    return { totalMessagesSentItem, mostMessagesSentItem }
  }

  function generalItemsHandler() {
    const allDates = computed(() => [...new Set(globalStore.messagesPerAuthor.flatMap((author) => author.messages.map((message) => new Date(message.date).getTime())).sort((a, b) => a - b))])
    const highestStreak = getHighestStreak(allDates.value)
    const highestStreakItem = computed<SummaryItem>(() => ({
      title: 'Highest streak',
      value: `${highestStreak.maxStreak} days`,
      icon: 'emoji_events',
      subtitle: `From ${new Date(highestStreak.start).toLocaleDateString()} to ${new Date(highestStreak.end).toLocaleDateString()}`,
      class: '',
      showValue: !!highestStreak.maxStreak,
    }))
    console.log(highestStreakItem.value)

    return { highestStreakItem }
  }

  return {
    summaryItems,
    setSummaryState,
  }
})
