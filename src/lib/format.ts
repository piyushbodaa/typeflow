import type { EngineMode } from '../engine/types'

export function formatCopyResult(wpm: number, accuracy: number, label: string): string {
  return `${Math.round(wpm)} WPM · ${Math.round(accuracy)}% accuracy · ${label} · typeflow`
}

export function modeLabel(mode: EngineMode, lessonTitle?: string): string {
  if (lessonTitle) return lessonTitle
  if (mode.kind === 'timed') return `${mode.seconds}s`
  if (mode.kind === 'words') return `${mode.count} words`
  if (mode.seconds != null) return `${mode.seconds}s`
  return `${mode.words.length} words`
}

export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  if (m === 0) return `${s}s`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatWhen(at: number): string {
  return new Date(at).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
