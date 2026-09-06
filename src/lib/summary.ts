import { LESSONS } from '../data/lessons'
import type { TestResult } from './storage'

export interface DashboardSummary {
  lastWpm: number | null
  bestWpm: number | null
  lastAccuracy: number | null
  accuracySeries: number[]
  lessonsDone: number
  lessonsTotal: number
  recent: TestResult[]
}

export function summarize(results: TestResult[], completed: string[]): DashboardSummary {
  const wpmValues = results.map((r) => r.wpm)
  const chronological = [...results].reverse()
  return {
    lastWpm: results[0] ? results[0].wpm : null,
    bestWpm: wpmValues.length ? Math.max(...wpmValues) : null,
    lastAccuracy: results[0] ? results[0].accuracy : null,
    accuracySeries: chronological.slice(-8).map((r) => r.accuracy),
    lessonsDone: completed.length,
    lessonsTotal: LESSONS.length,
    recent: results.slice(0, 5),
  }
}
