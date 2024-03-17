import { ref } from 'vue'
import { Author, Event, Message, Poll } from './types'

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

function compareFn(a: Message, b: Message) {
  if (!a || !b) return 0
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
const voteRegex = RegExp(/\((?<name>[0-9]) vote/)
const pollOptionRegex = RegExp(/OPTION:(?<name>.*) \([0-9] vote/)
const emojiRegex = /\p{Extended_Pictographic}/gu

export function analyseText(file: string) {
  console.clear()

  const lines = file.split('\n')
  let authorIndex: number = 0
  let id: number = 0
  const events: Event[] = []
  const polls: Poll[] = []
  const pollIds: string[] = []

  const authorIds: Record<string, number> = {}

  lines.forEach((line, idx) => stripPolls(line, idx))

  // Note: This means we need to loop over the lines twice, not sure if performance is an issue here.
  function stripPolls(message: string, idx: number) {
    if (message.endsWith(': POLL:') && message.match(isStart)) {
      const pollOptions = []

      // currently max options for a poll is 12. But check the next 20 lines in case they ever up the options.
      // Safer then putting a while loop here and checking for certain conditions.
      for (let i = idx; i < idx + 20; i++) {
        pollIds.push(i.toString())
        if (i > idx + 1 && lines[i].startsWith('OPTION: ')) {
          const text = pollOptionRegex.exec(lines[i])

          if (!text) {
            console.log(text)
            console.log(lines[i])
            console.log('NO TEXT FOUND')
          }

          pollOptions.push({
            option: pollOptionRegex.exec(lines[i])?.groups?.name || '',
            votes: voteRegex.exec(lines[i])?.groups?.name ?? 0,
          })
        }

        if (!lines[i]) {
          break
        }
      }

      polls.push({
        id: polls.length,
        question: lines[idx + 1],
        options: pollOptions,
      })
    }
  }

  console.log(polls)

  for (const idx in lines) {
    let message = lines[idx]

    if (pollIds.includes(idx)) {
      console.log('POLLLL')
      continue
    }
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
      const messageDate = dateTimeRegex.exec(message)
      const emojis = message.match(emojiRegex)

      if (messageDate) {
        date = messageDate[0].replace(timeRegex, '')
        const messageTime = timeRegex.exec(messageDate[0])
        if (messageTime) {
          hour = hourToIndex(messageTime[0].substring(2, 4))
        }
        message = message.replace(messageDate[0], '')
        const authorGroup = /^ -\s(?<name>.*): /gm.exec(message)
        if (authorGroup?.groups) {
          author = authorGroup.groups.name
        } else continue
      }

      const text = message.replace(' - ' + author + ': ', '')
      if (message.includes('changed the group description') || message.includes('changed the group name from') || message.includes("changed this group's icon")) {
        const eventAuthorRegex = RegExp(/.+?(?=changed)/)
        const authorFound = message.match(eventAuthorRegex)
        const author = authorFound?.length ? authorFound[0].substring(3) : ''
        const eventMessage = message.replace(author, '')
        // TODO: fix you
        events.push({
          id,
          date,
          author: author.trim() === 'You' ? 'YOUR NAME HERE' : author,
          message: eventMessage.substring(2),
        })
        id++
      } else if (author) {
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
            emojis: emojis || [],
            message: text.toLowerCase(),
            amountCharacters: text.length,
            upperCharactersCount: text.length - text.replace(/[A-Z]/g, '').length,
            isAttachment: text === '<Media omitted>',
          })
          id++
        }
      }
    }
  }

  authors.value.forEach((item) => {
    // @ts-expect-error: Not sure how to fix...
    item.messages.sort(compareFn)
  })

  return { authors: authors.value, events }
}

export async function startAnalysisFromFile() {
  const chatLocation = import.meta.env.DEV ? '../../whatsapp-chat-visualiser/chat-small.txt' : '../../whatsapp-chat-visualiser/demo-log.txt'

  return fetch(chatLocation)
    .then((res) => res.text())
    .then((text) => {
      console.time('data formatting')
      return analyseText(text)
    })
}
