import { regexParser, regexParserSystem, regexParserSystemIos } from './regexHelpers'
import type { Message } from '../types'
import dayjs from 'dayjs'

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

export function getTime(time: string, amPm: string) {
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

export function isAttachment(message: string) {
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
    '<Médias omis>',
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

export function getTranslation(lang: string, translationList: { lang: string; translation: string }[]) {
  const translation = translationList.find((item) => item.lang === lang)
  return translation ? translation.translation : translationList[0].translation
}

export function isSystemMessage(message: string) {
  // Anroid system messages
  if (!regexParser.test(message) && regexParserSystem.test(message)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [___, date, __, _, messageText] = regexParserSystem.exec(message) || []
    return { date, messageText }
  }

  // IOS system messages
  if (regexParserSystemIos.test(message)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, date, __, ___, authorName, messageText] = regexParser.exec(message) || []
    return { date, messageText, authorName }
  }
  return false
}

export function getOldDateFormat(messages: Message[]) {
  if (messages.length === 0) {
    console.log('No authors found')
    return null
  }

  const uniqueDates = [...new Set(messages.map((message) => message.date))]

  const dateRegexMap = {
    'DD/MM/YY': /^([0-3]?[0-9])\/([0-1]?[0-9])\/([0-9]{2})$/,
    'MM/DD/YY': /^([0-1]?[0-9])\/([0-3]?[0-9])\/([0-9]{2})$/,
    'DD.MM.YY': /^([0-3]?[0-9])[.]([0-1]?[0-9])[.]([0-9]{2})$/,
    'DD/MM/YYYY': /^([0-3]?[0-9])\/([0-1]?[0-9])\/([0-9]{4})$/,
    'MM/DD/YYYY': /^([0-1]?[0-9])\/([0-3]?[0-9])\/([0-9]{4})$/,
    'DD-MM-YYYY': /^([0-3]?[0-9])-(?:[0-1]?[0-9])-(?:[0-9]{4})$/,
    'MM-DD-YYYY': /^([0-1]?[0-9])-(?:[0-3]?[0-9])-(?:[0-9]{4})$/,
    'DD.MM.YYYY': /^([0-3]?[0-9])[.]([0-1]?[0-9])[.]([0-9]{4})$/,
  }

  const detectDateFormat = (dates: string[]): string | null => {
    for (const [format, regex] of Object.entries(dateRegexMap)) {
      if (dates.every((date) => regex.test(date))) {
        return format
      }
    }
    return null
  }

  const oldDateFormat = detectDateFormat(uniqueDates)
  let allValid = false
  if (oldDateFormat) {
    const isValid = uniqueDates.every((date) => dayjs(date, oldDateFormat).isValid())
    allValid = isValid
  }
  return { oldDateFormat, allValid }
}

export function getFallbackDateFormat(dateFormat: string, date: string) {
  if (date.length < dateFormat.length) {
    const fallbackDateRegexMap = {
      'D/M/YY': /^([0-3]?[0-9])\/([0-1]?[0-9])\/([0-9]{2})$/,
      'DD/M/YY': /^([0-3]?[0-9]{2})\/([0-1]?[0-9])\/([0-9]{2})$/,
      'D/MM/YY': /^([0-3]?[0-9])\/([0-1]?[0-9]{2})\/([0-9]{2})$/,
    }

    for (const [format, regex] of Object.entries(fallbackDateRegexMap)) {
      if (regex.test(date)) {
        return format
      }
    }
  }
  return dateFormat
}
