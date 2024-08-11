import { Author, Event, Poll } from './types'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

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

function getTime(time: string, amPm: string) {
  if (time) {
    let txtHour = time.split(':')[0]
    if (amPm === 'p.m.') {
      txtHour = (parseInt(txtHour) + 12).toString()
    }
    if (hourToIndex(txtHour) === null && txtHour == '00') {
      return 0
    }
    return hourToIndex(txtHour)
  }
  return null
}

function isAttachment(message: string) {
  const attachmentMessages = ['<Media omitted>', '‎image omitted', '‎sticker omitted', '‎afbeelding weggelaten', '‎sticker weggelaten', '‎video weggelaten']
  return attachmentMessages.includes(message)
}

function compareFn(a: string | undefined, b: string | undefined) {
  if (!a || !b) return 0
  if (new Date(a) < new Date(b)) {
    return -1
  } else if (new Date(b) > new Date(a)) {
    return 1
  }
}

// whatsapp chart parser regex
const sharedRegex = /^(?:\u200E|\u200F)*\[?(\d{1,4}[-/.]\s?\d{1,4}[-/.]\s?\d{1,4})[,.]?\s\D*?(\d{1,2}[.:]\d{1,2}(?:[.:]\d{1,2})?)(?:\s([ap]\.?\s?m\.?))?\]?(?:\s-|:)?\s/
const authorAndMessageRegex = /(.+?):\s([^]*)/
const messageRegex = /([^]+)/
const regexParser = new RegExp(sharedRegex.source + authorAndMessageRegex.source, 'i')
const regexParserSystem = new RegExp(sharedRegex.source + messageRegex.source, 'i') // works for android, not iOS.

const isStart = '^([0-9]+)(/)([0-9]+)(/)([0-9]+), ([0-9]+):([0-9]+)[]? -'
const voteRegex = RegExp(/\((?<name>[0-9]) vote/)
const pollOptionRegex = RegExp(/OPTION:(?<name>.*) \([0-9] vote/)
const emojiRegex = /\p{Extended_Pictographic}/gu

export function analyseText(file: string) {
  const authors: Author[] = []

  const lines = file.split('\n')
  let authorIndex: number = 0
  let id: number = 0
  const events: Event[] = []
  const polls: Poll[] = []
  const pollIds: string[] = []

  const authorIds: Record<string, number> = {}

  function handleEvent(message: string, date: string) {
    events.push({
      id,
      date,
      message: message,
    })
  }

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
    } else {
      // filter out android system messages
      // TODO: Android system messages are filtered before, iOS are after. Kind of inconsistent.
      if (!regexParser.test(message) && regexParserSystem.test(message)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [___, date, __, _, messageText] = regexParserSystem.exec(message) || []
        handleEvent(messageText, date)
        pollIds.push(idx.toString())
        return
      }
    }
  }

  for (const idx in lines) {
    const message = lines[idx]

    if (!message || pollIds.includes(idx)) {
      continue
    }

    if (!message.match(regexParser) && message) {
      if (authorIndex !== null && authors[authorIndex]) {
        authors[authorIndex].messages[authors[authorIndex].messages.length - 1].message += ` ${message}`
      } else {
        // console.log(message)
      }
    } else {
      const [msg, date, time, amPm, authorName, messageText] = regexParser.exec(message) || []
      if (!msg) {
        continue
      }

      // ios system message
      if (!msg.startsWith('‎') && messageText.startsWith('‎')) {
        const event = `${authorName}:  ${messageText}`
        handleEvent(event, date)
        id++
        continue
      }

      const hour: number | null = getTime(time, amPm)
      const emojis = messageText.match(emojiRegex)
      const author = authorName
      const text = messageText.replace('\r', '')

      if (author) {
        if (authors.findIndex((item: Author) => item.name === author) === -1) {
          authors.push({ name: author, messages: [], authorIndex: authors.length })
          authorIds[author] = authors.length - 1
        }
        authorIndex = authorIds[author]

        if (authorIndex > -1) {
          authors[authorIndex].messages.push({
            id,
            date,
            hour,
            emojis: emojis || [],
            message: text.toLowerCase(),
            amountCharacters: text.length,
            upperCharactersCount: text.length - text.replace(/[A-Z]/g, '').length,
            isAttachment: isAttachment(text),
          })
          id++
        }
      }
    }
  }

  const { authors: authorData, startDate, endDate } = formatDates(authors)

  return { authors: authorData, events, startDate, endDate }
}

export async function startAnalysisFromFile() {
  const chatLocation = import.meta.env.DEV ? '../../whatsapp-chat-visualiser/chat-small.copy2.txt' : '../../whatsapp-chat-visualiser/demo-log.txt'

  return fetch(chatLocation)
    .then((res) => res.text())
    .then((text) => {
      return analyseText(text)
    })
}

function formatDates(authors: Author[]) {
  console.log(authors)
  // Change the date format, if a different format is used
  if (
    !authors.every((item) => {
      return item.messages.every((message) => dayjs(message.date).isValid())
    })
  ) {
    authors.forEach((item) => {
      item.messages = item.messages.map((message) => ({
        ...message,
        date: dayjs(message.date, 'DD/MM/YYYY').format('MM/DD/YYYY'),
      }))
    })
  }

  if (authors.length === 0) {
    console.log('No authors found')
    // return { authors, startDate: '', endDate: '' }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const allDates = authors.flatMap((author) => author.messages.map((message) => message.date)).sort(compareFn)
  const startDate = allDates[0]
  const endDate = allDates[allDates.length - 1]

  return { authors, startDate, endDate }
}
