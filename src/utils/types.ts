export interface Message {
  date: string
  message: string
  id: number
  hour: number | null
  isAttachment: boolean
  upperCharactersCount: number
  amountCharacters: number
  emojis: string[]
}

export interface Author {
  name: string
  messages: Message[]
  authorIndex: number
}

export interface Event {
  id: number
  date: string
  message: string
}

export interface Poll {
  id: number
  question: string
  options: {
    option: string
    votes: number | string
  }[]
}

export interface AuthorSettings {
  index: number
  name: string
  show: boolean
}

export interface SummaryItem {
  title: string
  value: string | number
  subtitle: string
  icon: string
  showValue: boolean
  class?: string
}

export interface TopValueEntry {
  type: string
  value?: number | string
  values?: { label: string; value: number }[] | []
}
