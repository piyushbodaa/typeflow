import type { EngineSnapshot } from '../engine/types'
import type { TestResult } from './storage'

export function weakestKeys(results: TestResult[]): string[] {
  const aggregate: EngineSnapshot['keyStats'] = {}
  for (const r of results.slice(0, 15)) for (const [key, value] of Object.entries(r.keyStats ?? {})) {
    if (!value || typeof value.attempts !== 'number' || typeof value.errors !== 'number') continue
    const stats = aggregate[key] ?? { attempts: 0, errors: 0, totalMs: 0, intervals: 0 }
    stats.attempts += value.attempts; stats.errors += value.errors
    stats.totalMs += value.totalMs || 0; stats.intervals += value.intervals || 0
    aggregate[key] = stats
  }
  return Object.entries(aggregate).filter(([,s]) => s.attempts >= 3).sort((a,b) => {
    const score = (s: EngineSnapshot['keyStats'][string]) => s.errors / s.attempts * 1000 + (s.intervals ? s.totalMs / s.intervals : 0)
    return score(b[1]) - score(a[1])
  }).slice(0, 3).map(([key]) => key)
}
export function keyLabel(key: string): string { return key === ' ' ? 'Space' : key }
export function recommendation(snapshot: EngineSnapshot): string {
  if (snapshot.stats.attempts < 20) return 'This run was too short to identify a pattern. Try another passage and type a few complete words.'
  const keys = Object.entries(snapshot.errorMap).sort((a,b) => b[1]-a[1]).slice(0,3).map(([key]) => keyLabel(key))
  if (keys.length) return `Slow down around ${keys.join(', ')}. Practice these keys in your next poem; aim for 95% first-attempt accuracy.`
  return snapshot.stats.firstAccuracy >= 98 ? 'Accurate work. Try a longer passage while keeping this rhythm.' : 'Keep a steady rhythm and leave room to read ahead. Accuracy comes before speed.'
}
export function resultGroup(r: TestResult): string {
  if (r.benchmark) return 'Benchmark · 60s · Flow'
  const mode = r.lessonId ? `Lesson · ${r.lessonId}` : r.mode.kind === 'timed' ? `${r.mode.seconds}s` : r.mode.kind === 'words' ? `${r.mode.count} words` : r.mode.kind === 'custom' && r.mode.seconds ? `${r.mode.seconds}s` : 'Poem'
  return `${mode} · ${r.textSource ?? (r.source === 'lesson' ? 'drill' : 'unknown')} · ${r.difficulty ?? 'unclassified'} · ${r.practiceStyle ?? 'legacy'}`
}
export function weeklyStats(results: TestResult[]) {
  const now = Date.now(), week = 7 * 86400000
  const current = results.filter((r) => r.at >= now - week)
  const previous = results.filter((r) => r.at < now - week && r.at >= now - 2 * week)
  const benchmarks = current.filter((r) => r.benchmark)
  const oldBenchmarks = previous.filter((r) => r.benchmark)
  const mean = (rows: TestResult[], value: (r: TestResult) => number) => rows.length ? rows.reduce((s,r) => s + value(r),0)/rows.length : null
  return { minutes: Math.round(current.reduce((s,r) => s+r.durationMs,0)/60000), sessions: current.length,
    accuracy: mean(current.filter((r) => r.firstAccuracy != null), (r) => r.firstAccuracy!),
    benchmarkWpm: mean(benchmarks, (r) => r.wpm), previousWpm: mean(oldBenchmarks, (r) => r.wpm),
    keys: weakestKeys(results) }
}
