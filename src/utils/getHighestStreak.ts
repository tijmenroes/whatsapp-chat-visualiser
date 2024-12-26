// Helper utils? This whole project needs some resrucutring...

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
        start = times[i]
        end = times[i + currentStreak]
      }

      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 1
    }
  }

  return {
    maxStreak: Math.max(maxStreak, currentStreak),
    start,
    end,
  }
}
