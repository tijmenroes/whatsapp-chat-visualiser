export interface ScriptState {
  startDate?: string
  endDate?: string
  messages: Message[]
  authors: Author[]
  events: Event[]
  polls: Poll[]
  id: number
}

export interface Message {
  date: string
  message: string
  id: number
  hour: number | null
  isAttachment: boolean
  authorId: number
  amountCharacters: number
  emojis: string[]
}

export interface Author {
  name: string
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
  date: string
  authorId: number
  options: {
    option: string
    votes: number | string
  }[]
}

export interface AuthorSettings {
  index: number
  name: string
  show: boolean
  color: string
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
