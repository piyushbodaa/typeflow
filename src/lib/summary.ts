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
  const benchmarks = results.filter((r) => r.benchmark && (r.firstAccuracy ?? 0) >= 95)
  const wpmValues = benchmarks.map((r) => r.wpm)
  const chronological = [...results].reverse()
  return {
    lastWpm: benchmarks[0] ? benchmarks[0].wpm : null,
    bestWpm: wpmValues.length ? Math.max(...wpmValues) : null,
    lastAccuracy: results[0]?.firstAccuracy ?? null,
    accuracySeries: chronological.slice(-8).map((r) => r.accuracy),
    lessonsDone: LESSONS.filter((l) => completed.includes(l.id)).length,
    lessonsTotal: LESSONS.length,
    recent: results.slice(0, 5),
  }
}
