import { Author, ScriptState } from '../types'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { POLL_TRANSLATION, POLL_OPTION_TRANSLATION, VOTE_TRANSLATION } from './chatTerms'
import { getTime, isAttachment, getTranslation, isSystemMessage, getOldDateFormat, getFallbackDateFormat } from './scriptHelpers'
import { regexParser, emojiRegex, createVoteRegex, isStart, createPollOptionRegex } from './regexHelpers'
dayjs.extend(customParseFormat)

export async function analyseBatch(lines: string[], state: ScriptState, isFinalBatch: boolean = false, language: string) {
  console.time('Analyse batch')
  const { authors, events, polls, messages } = state

  const voteRegex = createVoteRegex(language, getTranslation(language, VOTE_TRANSLATION))
  const pollRegex = new RegExp(`${getTranslation(language, POLL_TRANSLATION)}.*:`, 'i')
  const pollOptionRegex = createPollOptionRegex(language, getTranslation(language, POLL_OPTION_TRANSLATION))
  const systemIds: string[] = []

  function handleEvent(message: string, date: string) {
    events.push({
      id: state.id,
      date,
      message: message,
    })
  }

  function getAuthorIndex(authorName: string) {
    if (authors.findIndex((item: Author) => item.name === authorName) === -1) {
      authors.push({ name: authorName, authorIndex: authors.length })
    }
    return authors.findIndex((item: Author) => item.name === authorName)
  }

  function stripSystemMessages(message: string, idx: number) {
    if (pollRegex.test(message) && !lines[idx + 1].match(isStart)) {
      const pollOptions = []

      const [msg, date, time, amPm, authorName, messageText] = regexParser.exec(message) || []

      systemIds.push(idx.toString())
      systemIds.push((idx + 1).toString())

      // currently max options for a poll is 12. But check the next 20 lines in case they ever up the options.
      // Safer then putting a while loop here and checking for certain conditions.
      for (let i = idx + 2; i < idx + 20; i++) {
        if (i > idx + 1 && lines[i].includes(`${getTranslation(language, POLL_OPTION_TRANSLATION)}`)) {
          systemIds.push(i.toString())
          pollOptions.push({
            option: pollOptionRegex.exec(lines[i])?.groups?.name || '',
            votes: voteRegex.exec(lines[i])?.groups?.name ?? 0,
          })
        } else {
          break
        }
      }

      const authorIndex = getAuthorIndex(authorName)

      polls.push({
        id: polls.length,
        authorId: authorIndex,
        date,
        question: lines[idx + 1],
        options: pollOptions,
      })
    } else {
      const systemMessage = isSystemMessage(message)
      if (systemMessage) {
        const event = systemMessage.authorName ? `${systemMessage.authorName}:  ${systemMessage.messageText}` : systemMessage.messageText
        handleEvent(event, systemMessage.date)
        systemIds.push(idx.toString())
        state.id++
      }
    }
  }

  for (const idx in lines) {
    const message = lines[idx]

    if (!message || systemIds.includes(idx)) {
      continue
    }

    stripSystemMessages(message, parseInt(idx))

    if (!message.match(regexParser) && message && !message.match(isStart)) {
      if (authors.length) {
        // Add message to last sent message
        messages[messages.length - 1].message += ` ${message}`
      }
    } else {
      // Is start of message

      const [msg, date, time, amPm, authorName, messageText] = regexParser.exec(message) || []
      if (!msg) {
        continue
      }

      const hour: number | null = getTime(time, amPm)
      const emojis = messageText.match(emojiRegex)
      const text = messageText.replace('\r', '')

      if (authorName) {
        const authorIndex = getAuthorIndex(authorName)

        if (authorIndex > -1) {
          messages.push({
            id: state.id,
            authorId: authorIndex,
            date,
            hour,
            emojis: emojis || [],
            message: text.toLowerCase(),
            amountCharacters: text.length,
            isAttachment: isAttachment(text),
          })
          state.id++
        }
      }
    }
  }

  if (isFinalBatch) {
    const { updatedMessages, updatedEvents, updatedPolls, startDate, endDate } = formatDates(state)
    state.messages = updatedMessages
    state.events = updatedEvents
    state.polls = updatedPolls
    if (startDate && endDate) {
      state.startDate = startDate
      state.endDate = endDate
    }
  }
  // console.log(state)
  console.timeEnd('Analyse batch')

  return
}

function formatDates(state: ScriptState) {
  const oldFormat = getOldDateFormat(state.messages)

  if (!oldFormat) {
    console.log('No date format found')
    return { updatedMessages: state.messages, updatedEvents: state.events, updatedPolls: state.polls, startDate: null, endDate: null }
  }
  const { oldDateFormat, allValid } = oldFormat
  const newDateFormat = 'YYYY-MM-DD'
  const formatDate = (date: string) => {
    let parsedDate = dayjs(date, oldDateFormat)

    if (!allValid && !parsedDate.isValid()) {
      const secondFormat = getFallbackDateFormat(oldDateFormat, date)
      parsedDate = dayjs(date, secondFormat)
    }
    if (!parsedDate.isValid()) {
      console.error(`Invalid date: ${date} using format: ${oldDateFormat}`)
    }
    return parsedDate.format(newDateFormat)
  }

  const updatedMessages = state.messages.map((message) => ({
    ...message,
    date: formatDate(message.date),
  }))

  const updatedEvents = state.events.map((event) => ({
    ...event,
    date: formatDate(event.date),
  }))

  const updatedPolls = state.polls.map((poll) => ({
    ...poll,
    date: formatDate(poll.date),
  }))

  const startDate = updatedMessages[0]?.date
  const endDate = updatedMessages[updatedMessages.length - 1]?.date

  return { updatedMessages, updatedEvents, updatedPolls, startDate, endDate }
}

export async function startAnalysisFromFile(): Promise<string> {
  const chatLocation = import.meta.env.DEV ? '../../testChats/chat-fr.txt' : '../../demo-log1.txt'

  // const state = { authors: [], events: [], polls: [], startDate: undefined, endDate: undefined, id: 0 } // Shared state for analysis
  console.log(chatLocation)
  console.time('Analyse batch')
  console.time('total time')
  return fetch(chatLocation)
    .then((res) => res.text())
    .then(async (text) => {
      return text
    })
}
