import { ref } from 'vue'
import { Author, Event } from './types'

function hourToIndex(hour: string) {
  const indexes: Record<string, number> = {
    '00': 0,
    '01': 1,
    '02': 2,
    '03': 3,
    '04': 4,
    '05': 5,
    '06': 6,
    '07': 7,
    '08': 8,
    '09': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13,
    '14': 14,
    '15': 15,
    '16': 16,
    '17': 17,
    '18': 18,
    '19': 19,
    '20': 20,
    '21': 21,
    '22': 22,
    '23': 23,
  }
  return indexes[hour] || null
}

const authors = ref<Author[]>([])

function compareFn(a, b) {
  if (new Date(a.date) < new Date(b.date)) {
    return -1
  } else if (new Date(b.date) > new Date(a.date)) {
    return 1
  }
}

// const REGEX_LIST = {
// startOfMessage:
// }
const isStart = '^([0-9]+)(/)([0-9]+)(/)([0-9]+), ([0-9]+):([0-9]+)[]? -'
const dateTimeRegex = RegExp('^([0-9]+)(/)([0-9]+)(/)([0-9]+), ([0-9]+):([0-9]+)')
const timeRegex = RegExp(', ([0-9]+):([0-9]+)')
const emojiRegex = /\p{Extended_Pictographic}/gu

export function analyseText(file: string) {
  const lines = file.split('\n')
  let authorIndex: number = 0
  let id: number = 0
  const events: Event[] = []

  const authorIds: Record<string, number> = {}

  for (const idx in lines) {
    let message = lines[idx]

    if (!message.match(isStart) && message) {
      // Best onhandig, moeilijk om dit te doen anders.
      // console.log(message)
      // const currentAutor = authors.value[authorIndex]
      // console.log(currentAutor)
      // if (currentAutor) {
      //   currentAutor.messages[currentAutor.messages.length - 1].message += ` ${message}`
      // }
    } else {
      let date = ''
      let author = ''
      let hour: number | null = null
      // let dateTime: string | null = null
      const messageDate = dateTimeRegex.exec(message)
      const emojis = message.match(emojiRegex)

      if (messageDate) {
        date = messageDate[0].replace(timeRegex, '')
        const messageTime = timeRegex.exec(messageDate[0])
        if (messageTime) {
          hour = hourToIndex(messageTime[0].substring(2, 4))
        }
        message = message.replace(messageDate[0], '')
        const startAuth = message.indexOf(' - ')
        const endAuthor = message.indexOf(': ')
        // Use Max's regex..
        // Really hard regex with surnames, special characters, emoji's
        author = message.substring(startAuth + 3, endAuthor)
      }

      const text = message.replace(author, '')

      if (message.includes('changed the group description') || message.includes('changed the group name from') || message.includes("changed this group's icon")) {
        const eventAuthorRegex = RegExp(/.+?(?=changed)/)
        const authorFound = message.match(eventAuthorRegex)
        const author = authorFound?.length ? authorFound[0].substring(3) : ''
        const eventMessage = message.replace(author, '')
        // TODO: fix you
        // TODO: Find a way to strip whitespace
        events.push({
          id,
          date,
          author: author === 'You ' ? 'Tijmen' : author,
          message: eventMessage.substring(2),
        })
        id++
      }

      // const authorRegex = /- [A-Za-z]+: /g
      // const author = message.match(authorRegex)
      else if (author) {
        if (authors.value.findIndex((item: Author) => item.name === author) === -1) {
          authors.value.push({ name: author, messages: [], authorIndex: authors.value.length })
          authorIds[author] = authors.value.length - 1
        }
        authorIndex = authorIds[author]

        if (authorIndex > -1) {
          authors.value[authorIndex].messages.push({
            id,
            date,
            hour,
            emojis,
            message: text.toLowerCase(),
            amountCharacters: text.length,
            upperCharactersCount: text.length - text.replace(/[A-Z]/g, '').length,
            isAttachment: text.includes(' <Media omitted>'),
          })
          id++
        }
      }
    }
  }

  authors.value.forEach((item) => {
    item.messages.sort(compareFn)
  })

  return { authors: authors.value, events }
}

export async function startAnalysisFromFile() {
  return fetch('../../public/chat-small.txt')
    .then((res) => res.text())
    .then((text) => {
      console.time('data formatting')
      return analyseText(text)
    })
}
