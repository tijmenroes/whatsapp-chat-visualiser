export interface Message {
  date: string
  message: string
  id: number
  hour: number | null
  isAttachment: boolean
  upperCharactersCount: number
  amountCharacters: number
  emojis: string[] | null
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
