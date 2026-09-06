import { mulberry32, pickWords } from './generate'
import { isPrintableKey } from './keys'
import {
  computeAccuracy,
  computeConsistency,
  computeRawWpm,
  computeWpm,
} from './stats'
import type {
  CreateEngineConfig,
  Engine,
  EngineSnapshot,
  EngineStatus,
  WordState,
} from './types'

const TIMED_BUFFER = 120
const TOP_UP_WHEN = 30
const TOP_UP_BY = 80

function toWordState(word: string): WordState {
  return {
    expected: word,
    chars: [...word].map((expected) => ({
      expected,
      typed: '',
      flag: 'pending',
    })),
    extras: [],
    committed: false,
  }
}

function durationMs(mode: CreateEngineConfig['mode']): number | null {
  if (mode.kind === 'timed') return mode.seconds * 1000
  if (mode.kind === 'custom' && mode.seconds != null) return mode.seconds * 1000
  return null
}

function targetWordCount(mode: CreateEngineConfig['mode']): number | null {
  if (mode.kind === 'words') return mode.count
  if (mode.kind === 'custom' && mode.seconds == null) return mode.words.length
  return null
}

export function createEngine(config: CreateEngineConfig): Engine {
  const rng = mulberry32(config.seed ?? Date.now() % 2147483647)
  const bank = config.wordBank.length > 0 ? config.wordBank : ['the']

  function initialWords(): WordState[] {
    const { mode } = config
    if (mode.kind === 'custom') return mode.words.map(toWordState)
    if (mode.kind === 'words') return pickWords(bank, mode.count, rng).map(toWordState)
    return pickWords(bank, TIMED_BUFFER, rng).map(toWordState)
  }

  let words = initialWords()
  let wordIndex = 0
  let status: EngineStatus = 'idle'
  let startedAt: number | null = null
  let finishedAt: number | null = null
  let correct = 0
  let incorrect = 0
  let extra = 0
  let missed = 0
  let errorMap: Record<string, number> = {}
  let wpmSeries: number[] = []
  let lastSampleSec = 0

  function bumpError(ch: string) {
    errorMap = { ...errorMap, [ch]: (errorMap[ch] ?? 0) + 1 }
  }

  function maybeTopUp() {
    if (config.mode.kind !== 'timed' && !(config.mode.kind === 'custom' && config.mode.seconds != null)) {
      return
    }
    if (config.mode.kind === 'custom') return
    if (words.length - wordIndex >= TOP_UP_WHEN) return
    const more = pickWords(bank, TOP_UP_BY, rng).map(toWordState)
    words = words.concat(more)
  }

  function currentWord(): WordState | undefined {
    return words[wordIndex]
  }

  function filledCount(word: WordState): number {
    let n = 0
    for (const cell of word.chars) {
      if (cell.flag === 'pending') break
      n += 1
    }
    return n
  }

  function startIfNeeded(now: number) {
    if (status !== 'idle') return
    status = 'running'
    startedAt = now
  }

  function finish(now: number) {
    if (status === 'finished') return
    status = 'finished'
    const cap = durationMs(config.mode)
    const elapsed = startedAt == null ? 0 : now - startedAt
    finishedAt = cap != null ? (startedAt ?? now) + Math.min(elapsed, cap) : now
    sampleThrough(finishedAt)
  }

  function sampleThrough(now: number) {
    if (startedAt == null) return
    const cap = durationMs(config.mode)
    const elapsed = Math.max(0, now - startedAt)
    const clamped = cap != null ? Math.min(elapsed, cap) : elapsed
    const sec = Math.floor(clamped / 1000)
    if (sec <= lastSampleSec) return
    for (let s = lastSampleSec + 1; s <= sec; s += 1) {
      wpmSeries = wpmSeries.concat(computeWpm(correct, s * 1000))
    }
    lastSampleSec = sec
  }

  function applyChar(key: string) {
    const word = currentWord()
    if (!word || word.committed) return
    const filled = filledCount(word)
    if (filled >= word.chars.length) {
      word.extras = word.extras.concat(key)
      extra += 1
      return
    }
    const cell = word.chars[filled]
    if (!cell) return
    cell.typed = key
    if (key === cell.expected) {
      cell.flag = 'correct'
      correct += 1
    } else {
      cell.flag = 'incorrect'
      incorrect += 1
      bumpError(cell.expected)
    }
  }

  function applyBackspace() {
    const word = currentWord()
    if (!word || word.committed) return
    if (word.extras.length > 0) {
      word.extras = word.extras.slice(0, -1)
      extra = Math.max(0, extra - 1)
      return
    }
    const filled = filledCount(word)
    if (filled === 0) return
    const cell = word.chars[filled - 1]
    if (!cell) return
    if (cell.flag === 'correct') correct = Math.max(0, correct - 1)
    if (cell.flag === 'incorrect') incorrect = Math.max(0, incorrect - 1)
    cell.flag = 'pending'
    cell.typed = ''
  }

  function commitWord() {
    const word = currentWord()
    if (!word || word.committed) return
    const typedSomething = filledCount(word) > 0 || word.extras.length > 0
    if (!typedSomething) return
    for (const cell of word.chars) {
      if (cell.flag === 'pending') {
        missed += 1
        incorrect += 1
        bumpError(cell.expected)
      }
    }
    word.committed = true
    wordIndex += 1
    maybeTopUp()
  }

  function checkFinish(now: number) {
    const cap = durationMs(config.mode)
    if (cap != null && startedAt != null && now - startedAt >= cap) {
      finish(now)
      return
    }
    const target = targetWordCount(config.mode)
    if (target != null) {
      const committed = words.filter((w) => w.committed).length
      if (committed >= target) finish(now)
    }
  }

  function caretPos(): { wordIndex: number; charIndex: number } {
    const word = currentWord()
    if (!word) return { wordIndex, charIndex: 0 }
    if (word.extras.length > 0) return { wordIndex, charIndex: word.chars.length + word.extras.length }
    return { wordIndex, charIndex: filledCount(word) }
  }

  function expectedKey(): string {
    const word = currentWord()
    if (!word) return ''
    if (word.extras.length > 0) return ' '
    const next = word.chars.find((c) => c.flag === 'pending')
    if (next) return next.expected
    return ' '
  }

  function elapsedAt(now: number): number {
    if (startedAt == null) return 0
    const cap = durationMs(config.mode)
    const raw = (finishedAt ?? now) - startedAt
    return cap != null ? Math.min(Math.max(0, raw), cap) : Math.max(0, raw)
  }

  function snapshot(now = finishedAt ?? startedAt ?? 0): EngineSnapshot {
    const elapsedMs = elapsedAt(now)
    const cap = durationMs(config.mode)
    const target = targetWordCount(config.mode)
    const committed = words.filter((w) => w.committed).length
    return {
      status,
      words,
      caret: caretPos(),
      expectedKey: expectedKey(),
      stats: {
        wpm: computeWpm(correct, elapsedMs),
        rawWpm: computeRawWpm(correct, incorrect, extra, elapsedMs),
        accuracy: computeAccuracy(correct, incorrect, extra),
        correct,
        incorrect,
        extra,
        missed,
        elapsedMs,
        remainingMs: cap != null ? Math.max(0, cap - elapsedMs) : null,
        remainingWords: target != null ? Math.max(0, target - committed) : null,
      },
      wpmSeries,
      errorMap,
      startedAt,
      finishedAt,
      consistency: computeConsistency(wpmSeries),
    }
  }

  function reset() {
    words = initialWords()
    wordIndex = 0
    status = 'idle'
    startedAt = null
    finishedAt = null
    correct = 0
    incorrect = 0
    extra = 0
    missed = 0
    errorMap = {}
    wpmSeries = []
    lastSampleSec = 0
  }

  return {
    getSnapshot(now) {
      return snapshot(now)
    },
    handleKey(key, now) {
      if (status === 'finished') return snapshot(now)
      if (key === 'Backspace') {
        if (status === 'idle') return snapshot(now)
        applyBackspace()
        return snapshot(now)
      }
      if (key === ' ') {
        const word = currentWord()
        const typedSomething =
          word != null && (filledCount(word) > 0 || word.extras.length > 0)
        if (!typedSomething) return snapshot(now)
        startIfNeeded(now)
        commitWord()
        checkFinish(now)
        return snapshot(now)
      }
      if (!isPrintableKey(key)) return snapshot(now)
      startIfNeeded(now)
      applyChar(key)
      checkFinish(now)
      return snapshot(now)
    },
    tick(now) {
      if (status !== 'running') return snapshot(now)
      sampleThrough(now)
      checkFinish(now)
      return snapshot(now)
    },
    restart() {
      reset()
      return snapshot(0)
    },
  }
}
