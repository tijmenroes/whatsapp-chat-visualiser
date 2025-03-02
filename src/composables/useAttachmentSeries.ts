import { Author } from '@/utils/types'
import { divideNumber } from '@/utils/helperFunctions'
import { useStore } from '@/store'

export default function (authors: Author[], showRelative = false) {
  const store = useStore()
  const categories = showRelative ? ['Total in %'] : ['Total']

  const series = authors?.map((participant) => {
    const messages = showRelative ? participant.messages.filter((item) => item.isAttachment).map((item) => item.amountCharacters) : participant.messages
    const data = showRelative ? [divideNumber(messages.length, participant.messages.length)] : [messages.length]


    return {
      name: participant.name,
      data,
      color: store.getColorByAuthorId(participant.authorIndex),
    }
  })

  return { series, categories }
}
