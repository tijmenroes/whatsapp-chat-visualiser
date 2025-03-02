// Helper utils? This whole project needs some resrucutring...
import type { Message } from '@/utils/types'

export function getHighestStreak(times: number[]): { maxStreak: number; start: number; end: number } {
  if (!times.length) return { maxStreak: 0, start: 0, end: 0 }

  let maxStreak = 1
  let currentStreak = 1
  let start = times[0]
  let end = times[0]

  for (let i = 1; i < times.length; i++) {
    const dayInSeconds = 86400000
    const diffDays = (times[i] - times[i - 1]) / dayInSeconds

    if (diffDays === 1) {
      currentStreak++
    } else {
      if (currentStreak > maxStreak) {
        start = times[i - currentStreak]
        end = times[i - 1]
        maxStreak = currentStreak
      }

      currentStreak = 1
    }
  }

  return {
    maxStreak: Math.max(maxStreak, currentStreak),
    start,
    end,
  }
}

export function getHighestStreakPerson(messages: Message[]): { maxStreak: number; start: number; end: number } {
  if (!messages.length) return { maxStreak: 0, start: 0, end: 0 }

  let maxStreak = 1
  let currentStreak = 1
  let start = messages[0]
  let end = messages[0]
  let highestId = 0

  for (let i = 1; i < messages.length; i++) {
    // TODO: Just do these both in 1 function no?
    if (messages[i].authorId === messages[i - 1].authorId) {
      currentStreak++
    } else {
      if (currentStreak > maxStreak) {
        start = messages[i - currentStreak].date
        end = messages[i - 1].date
        maxStreak = currentStreak
        highestId = messages[i - 1].authorId
      }

      currentStreak = 1
    }
  }

  return {
    maxStreak: Math.max(maxStreak, currentStreak),
    start,
    end,
    highestId,
  }
}
