import type { EngineMode } from '../engine/types'

export interface Settings {
  theme: 'dark' | 'light'
  showKeyboard: boolean
  sound: boolean
}

export interface Progress {
  completed: string[]
}

export interface TestResult {
  id: string
  at: number
  source: 'test' | 'lesson'
  lessonId?: string
  mode: EngineMode
  wpm: number
  rawWpm: number
  accuracy: number
  correct: number
  incorrect: number
  extra: number
  missed: number
  consistency: number | null
  wpmSeries: number[]
  durationMs: number
}

const SETTINGS_KEY = 'typeflow:settings'
const PROGRESS_KEY = 'typeflow:progress'
const RESULTS_KEY = 'typeflow:results'
const MAX_RESULTS = 50

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  showKeyboard: true,
  sound: false,
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadSettings(): Settings {
  const stored = readJson<Partial<Settings>>(SETTINGS_KEY, {})
  return { ...DEFAULT_SETTINGS, ...stored }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadProgress(): Progress {
  const stored = readJson<Partial<Progress>>(PROGRESS_KEY, {})
  return { completed: stored.completed ?? [] }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function loadResults(): TestResult[] {
  const stored = readJson<TestResult[]>(RESULTS_KEY, [])
  return Array.isArray(stored) ? stored.slice(0, MAX_RESULTS) : []
}

export function pushResult(result: TestResult): TestResult[] {
  const next = [result, ...loadResults()].slice(0, MAX_RESULTS)
  localStorage.setItem(RESULTS_KEY, JSON.stringify(next))
  return next
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
