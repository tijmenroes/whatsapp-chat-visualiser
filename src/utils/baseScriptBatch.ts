import { Author, Event, Poll } from './types'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { POLL_TRANSLATION, POLL_OPTION_TRANSLATION, VOTE_TRANSLATION } from './chatTerms'
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
  //TODO: Optimize this with langauge specific messages, and also android vs iOS.
  const attachmentMessages = [
    '<Media omitted>',
    '<Video note omitted>',
    '<Media weggelaten>',
    '‎image omitted',
    '‎sticker omitted',
    '‎afbeelding weggelaten',
    '‎sticker weggelaten',
    '‎video weggelaten',
  ]
  const attachmentMessagesEstimated = [
    '<Medios omitidos>',
    '<Nota de video omitida>',
    '<Medien ausgelassen>',
    '<Videonotiz ausgelassen>',
    '<Média omis>',
    '<Note vidéo omise>',
    '<Mídia omitida>',
    '<Nota de vídeo omitida>',
    '<Media omesso>',
    '<Nota video omessa>',
  ]
  // const attachmentMessagesIOSEstimated = ['<Media omitted>', '<Video note omitted>', '‎image omitted', '‎sticker omitted']
  return [...attachmentMessages, ...attachmentMessagesEstimated].includes(message)
}

// function compareFn(a: string | undefined, b: string | undefined) {
//   if (!a || !b) return 0
//   if (new Date(a) < new Date(b)) {
//     return -1
//   } else if (new Date(b) > new Date(a)) {
//     return 1
//   }
// }

function getTranslation(lang: string, translationList: { lang: string; translation: string }[]) {
  const translation = translationList.find((item) => item.lang === lang)
  return translation ? translation.translation : translationList[0].translation
}

// whatsapp chart parser regex
const sharedRegex = /^(?:\u200E|\u200F)*\[?(\d{1,4}[-/.]\s?\d{1,4}[-/.]\s?\d{1,4})[,.]?\s\D*?(\d{1,2}[.:]\d{1,2}(?:[.:]\d{1,2})?)(?:\s([ap]\.?\s?m\.?))?\]?(?:\s-|:)?\s/
const authorAndMessageRegex = /(.+?):\s([^]*)/
const messageRegex = /([^]+)/
const regexParser = new RegExp(sharedRegex.source + authorAndMessageRegex.source, 'i')
const regexParserSystem = new RegExp(sharedRegex.source + messageRegex.source, 'i') // works for android, not iOS.

// check for time and if it resembles the start. Not perfect but only for polls and there are multiple chekcs.
const isStart = '([0-9]{2}):([0-9]{2}) - '
const emojiRegex = /\p{Extended_Pictographic}/gu

export async function analyseBatch(
  lines: string[],
  state: { authors: Author[]; events: Event[]; polls: Poll[]; startDate?: string; endDate?: string; id: number },
  isFinalBatch: boolean = false,
  language: string
) {
  const { authors, events, polls } = state
  const voteRegex = RegExp(`\\((?<name>[0-9]) ${getTranslation(language, VOTE_TRANSLATION)}`)
  const pollOptionRegex = RegExp(`${getTranslation(language, POLL_OPTION_TRANSLATION)}:(?<name>.*)`)

  let authorIndex: number = 0
  let id: number = 0
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
    if (message.endsWith(`${getTranslation(language, POLL_TRANSLATION)}:`) && !lines[idx + 1].match(isStart)) {
      const pollOptions = []

      const [msg, date, time, amPm, authorName, messageText] = regexParser.exec(message) || []

      // currently max options for a poll is 12. But check the next 20 lines in case they ever up the options.
      // Safer then putting a while loop here and checking for certain conditions.
      for (let i = idx; i < idx + 20; i++) {
        pollIds.push(i.toString())
        if (i > idx + 1 && lines[i].includes(`${getTranslation(language, POLL_OPTION_TRANSLATION)}: `)) {
          pollOptions.push({
            option: pollOptionRegex.exec(lines[i])?.groups?.name || '',
            votes: voteRegex.exec(lines[i])?.groups?.name ?? 0,
          })
        }

        if (!lines[i]) {
          break
        }
      }

      // Make a func for this.
      if (authors.findIndex((item: Author) => item.name === authorName) === -1) {
        authors.push({ name: authorName, messages: [], authorIndex: authors.length })
        authorIds[authorName] = authors.length - 1
      }
      authorIndex = authorIds[authorName]

      polls.push({
        id: polls.length,
        authorId: authorIndex,
        date,
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

  // This should only happen for the batch
  // see where this fits in

  if (isFinalBatch) {
    const { authors: authorData } = formatDates(authors)
    const { startDate, endDate } = getStartEndDates(authorData)
    state.authors = authorData
    state.startDate = startDate
    state.endDate = endDate
    state.events = events
    state.polls = polls
  }
  return
}

export async function startAnalysisFromFile(): Promise<string> {
  const chatLocation = import.meta.env.DEV ? '../../demo-log.txt' : '../../demo-log1.txt'

  // const state = { authors: [], events: [], polls: [], startDate: undefined, endDate: undefined, id: 0 } // Shared state for analysis

  console.time('Analyse batch')
  console.time('total time')
  return fetch(chatLocation)
    .then((res) => res.text())
    .then(async (text) => {
      return text
    })
}

function formatDates(authors: Author[]) {
  // Change the date format, if a different format is used
  if (
    !authors.every((item) => {
      return item.messages.every((message) => dayjs(message.date).isValid())
    })
  ) {
    console.log('Invalid date found')
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

  return { authors }
}
// TODO: Add check for links? Maybe just in a later level with attachments?

function getStartEndDates(authors: Author[]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const allDates = [...new Set(authors.flatMap((author) => author.messages.map((message) => message.date)))].sort((a, b) => {
    return new Date(a) - new Date(b)
  })

  const startDate = allDates[0]
  const endDate = allDates[allDates.length - 1]

  return { startDate, endDate }
}

/*
function formatDates(authors: Author[]) {
  // Regex for different date formats
  const dateRegex = {
    dd_mm_yy: /^([0-3]?[0-9])\/([0-1]?[0-9])\/([0-9]{2})$/, // DD/MM/YY or DD/MM/YYYY
    mm_dd_yy: /^([0-1]?[0-9])\/([0-3]?[0-9])\/([0-9]{2})$/, // MM/DD/YY or MM/DD/YYYY
    dd_mm_yyyy: /^([0-3]?[0-9])\/([0-1]?[0-9])\/([0-9]{4})$/, // DD/MM/YYYY
    mm_dd_yyyy: /^([0-1]?[0-9])\/([0-3]?[0-9])\/([0-9]{4})$/, // MM/DD/YYYY
    dd_mm_yyyy_dash: /^([0-3]?[0-9])-(?:[0-1]?[0-9])-(?:[0-9]{4})$/, // DD-MM-YYYY
    mm_dd_yyyy_dash: /^([0-1]?[0-9])-(?:[0-3]?[0-9])-(?:[0-9]{4})$/ // MM-DD-YYYY
  };

  if (
    !authors.every((item) => {
      return item.messages.every((message) => dayjs(message.date).isValid());
    })
  ) {
    authors.forEach((item) => {
      item.messages = item.messages.map((message) => {
        let formattedDate = message.date;

        // Check if the date matches any of the regex patterns
        if (dateRegex.dd_mm_yy.test(message.date)) {
          formattedDate = dayjs(message.date, 'DD/MM/YY').format('MM/DD/YYYY');
        } else if (dateRegex.mm_dd_yy.test(message.date)) {
          formattedDate = dayjs(message.date, 'MM/DD/YY').format('MM/DD/YYYY');
        } else if (dateRegex.dd_mm_yyyy.test(message.date)) {
          formattedDate = dayjs(message.date, 'DD/MM/YYYY').format('MM/DD/YYYY');
        } else if (dateRegex.mm_dd_yyyy.test(message.date)) {
          formattedDate = dayjs(message.date, 'MM/DD/YYYY').format('MM/DD/YYYY');
        } else if (dateRegex.dd_mm_yyyy_dash.test(message.date)) {
          formattedDate = dayjs(message.date, 'DD-MM-YYYY').format('MM/DD/YYYY');
        } else if (dateRegex.mm_dd_yyyy_dash.test(message.date)) {
          formattedDate = dayjs(message.date, 'MM-DD-YYYY').format('MM/DD/YYYY');
        }

        return {
          ...message,
          date: formattedDate,
        };
      });
    });
  }

  if (authors.length === 0) {
    console.log('No authors found');
  }

  return { authors };
}
*/
