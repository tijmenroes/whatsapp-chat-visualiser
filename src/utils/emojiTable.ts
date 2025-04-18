import { QTableColumn } from 'quasar'

export function countOccurrences(array: string[]) {
  if (!array || !array.length) return {}
  return array.reduce(function (acc: Record<string, number>, curr: string) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})
}

export const EMOJI_TABLE_ROWS: QTableColumn[] = [
  {
    name: 'emoji',
    label: 'Emoji',
    field: 'emoji',
    align: 'left',
  },
  {
    name: 'author',
    label: 'Sent by',
    field: 'author',
    align: 'left',
  },
  { name: 'value', align: 'right', label: 'Amount', field: 'value', sortable: true },
]

export const EMOJI_BASIC_TABLE_ROWS: QTableColumn[] = [
  {
    name: 'name',
    label: 'Emoji',
    field: 'name',
    align: 'left',
  },

  { name: 'value', align: 'left', label: 'Amount', field: 'value', sortable: true },
]
