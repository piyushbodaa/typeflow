export type TimedSeconds = 15 | 30 | 60 | 120
export type WordCount = 10 | 25 | 50 | 100

export type EngineMode =
  | { kind: 'timed'; seconds: TimedSeconds }
  | { kind: 'words'; count: WordCount }
  | { kind: 'custom'; words: string[]; seconds?: number }

export type EngineStatus = 'idle' | 'running' | 'finished'
export type CharFlag = 'pending' | 'correct' | 'incorrect' | 'extra'

export interface CharCell {
  expected: string
  typed: string
  flag: CharFlag
}

export interface WordState {
  expected: string
  chars: CharCell[]
  extras: string[]
  committed: boolean
}

export interface LiveStats {
  wpm: number
  rawWpm: number
  accuracy: number
  correct: number
  incorrect: number
  extra: number
  missed: number
  elapsedMs: number
  remainingMs: number | null
  remainingWords: number | null
}

export interface EngineSnapshot {
  status: EngineStatus
  words: WordState[]
  caret: { wordIndex: number; charIndex: number }
  expectedKey: string
  stats: LiveStats
  wpmSeries: number[]
  errorMap: Record<string, number>
  startedAt: number | null
  finishedAt: number | null
  consistency: number | null
}

export interface CreateEngineConfig {
  mode: EngineMode
  wordBank: string[]
  seed?: number
}

export interface Engine {
  getSnapshot(now?: number): EngineSnapshot
  handleKey(key: string, now: number): EngineSnapshot
  tick(now: number): EngineSnapshot
  restart(): EngineSnapshot
}
