import { Author } from '@/utils/types'

export default function (authors: Author[], showRelative = false) {
  const categories = ['Average length']

  const sumPerAuthor = authors?.map((participant) => {
    const messages = participant.messages.map((item) => item.amountCharacters)
    let sum = 0
    messages.forEach((item) => (sum += item))

    return {
      ...participant,
      sum,
    }
  })

  const series = sumPerAuthor?.map((participant) => {
    const data = showRelative ? [divideAbsolute(participant.sum, participant.messages.length)] : [participant.sum]

    return {
      name: participant.name,
      data,
    }
  })

  return { series, categories, sumPerAuthor }
}

function divideAbsolute(initial: number, divideAmount: number) {
  return parseFloat((initial / divideAmount).toFixed(2))
}
