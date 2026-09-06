import type { EngineMode, EngineSnapshot } from '../engine/types'
import { newId, type TestResult } from './storage'

export function snapshotToResult(
  snapshot: EngineSnapshot,
  source: TestResult['source'],
  mode: EngineMode,
  lessonId?: string,
): TestResult {
  return {
    id: newId(),
    at: Date.now(),
    source,
    lessonId,
    mode,
    wpm: snapshot.stats.wpm,
    rawWpm: snapshot.stats.rawWpm,
    accuracy: snapshot.stats.accuracy,
    correct: snapshot.stats.correct,
    incorrect: snapshot.stats.incorrect,
    extra: snapshot.stats.extra,
    missed: snapshot.stats.missed,
    consistency: snapshot.consistency,
    wpmSeries: snapshot.wpmSeries,
    durationMs: snapshot.stats.elapsedMs,
  }
}
