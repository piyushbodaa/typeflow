import type { EngineMode, EngineSnapshot } from '../engine/types'

export interface Settings {
  theme: 'dark' | 'light'
  showKeyboard: boolean
  sound: boolean
  fontSize: number
  highContrast: boolean
  practiceStyle: 'guided' | 'flow'
  dailyMinutes: 3 | 5 | 10
}
export interface Progress { completed: string[] }
export interface TestResult {
  id: string
  at: number
  source: 'test' | 'lesson'
  lessonId?: string
  mode: EngineMode
  textSource?: 'poems' | 'words' | 'drill'
  difficulty?: 'gentle' | 'balanced' | 'challenging'
  practiceStyle?: 'guided' | 'flow'
  benchmark?: boolean
  daily?: boolean
  poemIds?: string[]
  firstAccuracy?: number
  errorMap?: Record<string, number>
  keyStats?: EngineSnapshot['keyStats']
  pairErrors?: Record<string, number>
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
const memory = new Map<string, string>()
const DEFAULT_SETTINGS: Settings = { theme: 'dark', showKeyboard: true, sound: false, fontSize: 25, highContrast: false, practiceStyle: 'flow', dailyMinutes: 5 }

function readJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? memory.get(key) ?? 'null') as T ?? fallback }
  catch { try { return JSON.parse(memory.get(key) ?? 'null') as T ?? fallback } catch { return fallback } }
}
function writeJson(key: string, value: unknown) {
  const json = JSON.stringify(value)
  memory.set(key, json)
  try { localStorage.setItem(key, json) } catch { /* Session memory keeps practice usable. */ }
}
export function loadSettings(): Settings {
  const s = readJson<Partial<Settings>>(SETTINGS_KEY, {})
  return { theme: s.theme === 'light' ? 'light' : 'dark', showKeyboard: typeof s.showKeyboard === 'boolean' ? s.showKeyboard : true,
    sound: s.sound === true, fontSize: typeof s.fontSize === 'number' && s.fontSize >= 18 && s.fontSize <= 34 ? s.fontSize : 25,
    highContrast: s.highContrast === true, practiceStyle: s.practiceStyle === 'guided' ? 'guided' : 'flow',
    dailyMinutes: s.dailyMinutes === 3 || s.dailyMinutes === 10 ? s.dailyMinutes : 5 }
}
export function saveSettings(s: Settings) { writeJson(SETTINGS_KEY, s) }
export function loadProgress(): Progress {
  const s = readJson<Partial<Progress>>(PROGRESS_KEY, {})
  return { completed: Array.isArray(s.completed) ? s.completed.filter((id): id is string => typeof id === 'string') : [] }
}
export function saveProgress(p: Progress) { writeJson(PROGRESS_KEY, p) }
export function loadResults(): TestResult[] {
  const s = readJson<unknown>(RESULTS_KEY, [])
  return Array.isArray(s) ? s.filter(isResult).slice(0, MAX_RESULTS) : []
}
export function pushResult(r: TestResult): TestResult[] {
  const next = [r, ...loadResults()].slice(0, MAX_RESULTS)
  writeJson(RESULTS_KEY, next)
  return next
}
export function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
function isRecord(v: unknown): v is Record<string, unknown> { return typeof v === 'object' && v !== null && !Array.isArray(v) }
function isResult(v: unknown): v is TestResult {
  if (!isRecord(v) || !isRecord(v.mode)) return false
  const m = v.mode
  const modeValid = m.kind === 'timed' ? [15, 30, 60, 120].includes(Number(m.seconds)) : m.kind === 'words' ? [10, 25, 50, 100].includes(Number(m.count)) : m.kind === 'custom' && Array.isArray(m.words) && m.words.length <= 10000 && m.words.every((w: unknown) => typeof w === 'string' && w.length <= 1000)
  const numbers = ['at','wpm','rawWpm','accuracy','correct','incorrect','extra','missed','durationMs']
  return Boolean(modeValid && typeof v.id === 'string' && (v.source === 'test' || v.source === 'lesson') && numbers.every((k) => typeof v[k] === 'number' && Number.isFinite(v[k]) && v[k] >= 0) && Array.isArray(v.wpmSeries) && v.wpmSeries.every((n: unknown) => typeof n === 'number' && Number.isFinite(n)))
}
export function exportBackup(): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), settings: loadSettings(), progress: loadProgress(), results: loadResults(), rotation: readJson<unknown>('typeflow:poem-rotation:v1', []) }, null, 2)
}
export function importBackup(text: string): number {
  if (text.length > 5_000_000) throw new Error('Choose a Typeflow backup smaller than 5 MB.')
  const v: unknown = JSON.parse(text)
  if (!isRecord(v) || v.version !== 1 || !Array.isArray(v.results) || !v.results.every(isResult) || !isRecord(v.settings) || !isRecord(v.progress) || !Array.isArray(v.progress.completed) || !v.progress.completed.every((id: unknown) => typeof id === 'string') || !Array.isArray(v.rotation) || !v.rotation.every((id: unknown) => typeof id === 'string')) throw new Error('This file is not a valid Typeflow backup.')
  const byId = new Map([...loadResults(), ...v.results].map((r) => [r.id, r]))
  writeJson(RESULTS_KEY, [...byId.values()].sort((a,b) => b.at - a.at).slice(0, MAX_RESULTS))
  writeJson(PROGRESS_KEY, { completed: [...new Set([...loadProgress().completed, ...v.progress.completed])] })
  writeJson(SETTINGS_KEY, { ...DEFAULT_SETTINGS, ...v.settings })
  writeJson('typeflow:poem-rotation:v1', v.rotation)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('typeflow:import'))
  return v.results.length
}

export function loadPoemHistory(): string[] {
  const value = readJson<unknown>('typeflow:poem-rotation:v1', [])
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
}
export function savePoemHistory(ids: string[]) { writeJson('typeflow:poem-rotation:v1', ids) }
