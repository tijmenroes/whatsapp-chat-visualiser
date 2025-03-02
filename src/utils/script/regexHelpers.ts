const sharedRegex = /^(?:\u200E|\u200F)*\[?(\d{1,4}[-/.]\s?\d{1,4}[-/.]\s?\d{1,4})[,.]?\s\D*?(\d{1,2}[.:]\d{1,2}(?:[.:]\d{1,2})?)(?:\s([ap]\.?\s?m\.?))?\]?(?:\s-|:)?\s/
const authorAndMessageRegex = /(.+?):\s([^]*)/
export const messageRegex = /([^]+)/
export const regexParser = new RegExp(sharedRegex.source + authorAndMessageRegex.source, 'i')
export const regexParserSystem = new RegExp(sharedRegex.source + messageRegex.source, 'i')
export const isStart = /([0-9]{2}):([0-9]{2}) - /
export const emojiRegex = /\p{Extended_Pictographic}/gu
export const regexParserSystemIos = /^(?!\u200E).*\u200E/

// Utility functions for language-specific regex
export const createVoteRegex = (language: string, translation: string) => new RegExp(`\\((?<name>[0-9]) ${translation}`)

export const createPollOptionRegex = (language: string, translation: string) => new RegExp(`${translation}:(?<name>.*)`)
