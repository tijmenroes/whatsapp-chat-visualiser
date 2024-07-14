import { Author } from '@/utils/types'

export default function (authors: Author[], showRelative = false) {
  const categories = ['Average length']

  const series = authors?.map((participant) => {
    const messages = participant.messages.map((item) => item.amountCharacters)
    let sum = 0
    messages.forEach((item) => (sum += item))

    const data = showRelative ? [divideAbsolute(sum, participant.messages.length)] : [sum]

    return {
      name: participant.name,
      data,
    }
  })

  return { series, categories }
}

function divideAbsolute(initial: number, divideAmount: number) {
  return parseFloat((initial / divideAmount).toFixed(2))
}
