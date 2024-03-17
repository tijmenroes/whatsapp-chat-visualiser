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
  author: string
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
