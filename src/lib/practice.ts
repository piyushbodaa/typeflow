import { POEMS, poemTokens, type Poem } from '../data/poems'
import { lessonById } from '../data/lessons'
import { mulberry32 } from '../engine/generate'
import type { EngineMode } from '../engine/types'
import { createPoemRotation } from './poemRotation'
import { loadResults } from './storage'
import { weakestKeys } from './coaching'

export type Difficulty = 'gentle' | 'balanced' | 'challenging'
export type PassageLength = 'short' | 'medium' | 'long'
export interface Passage { poem: Poem; start: number; end: number }
export interface PreparedPractice { mode: EngineMode; passages: Passage[]; lineBreaks: number[]; remember: (only?: string[]) => void; targetKeys: string[] }
function difficultyScore(poem: Poem) {
  const text = poem.lines.join(' '), tokens = poemTokens(poem)
  return text.length / tokens.length + (text.match(/[;,!?":()-]/g)?.length ?? 0) / tokens.length * 5
}
function poolForDifficulty(difficulty: Difficulty): Poem[] {
  const sorted = [...POEMS].sort((a,b) => difficultyScore(a)-difficultyScore(b))
  const start = difficulty === 'gentle' ? 0 : difficulty === 'balanced' ? 15 : 30
  return sorted.slice(start, start + 20)
}
function metadata(poems: Poem[], limit = Infinity) {
  const passages: Passage[] = [], lineBreaks: number[] = []
  let offset = 0
  for (const poem of poems) {
    const start = offset
    for (const line of poem.lines) {
      lineBreaks.push(offset)
      offset += line.trim().split(/\s+/).length
    }
    if (start < limit) passages.push({ poem, start, end: Math.min(offset, limit) })
  }
  return { passages, lineBreaks: lineBreaks.filter((i) => i > 0 && i < limit) }
}
export function buildPoetry(seed: number, options: { seconds?: number; count?: number; difficulty?: Difficulty; adaptive?: boolean; benchmark?: boolean }): PreparedPractice {
  const keys = options.adaptive ? weakestKeys(loadResults()) : []
  const rotation = createPoemRotation(keys), rng = mulberry32(seed)
  const selected: Poem[] = [], words: string[] = []
  const minimum = options.count ?? Math.max(600, (options.seconds ?? 60) * 8)
  const pool = poolForDifficulty(options.difficulty ?? 'balanced')
  while (words.length < minimum) {
    const poem = options.benchmark ? POEMS.find((p) => p.id === 'sonnet-18')! : rotation.pick(rng, pool)
    selected.push(poem); words.push(...poemTokens(poem))
  }
  const limit = options.count ?? words.length
  return { mode: { kind: 'custom', words: words.slice(0,limit), ...(options.seconds ? { seconds: options.seconds } : {}) },
    ...metadata(selected,limit), remember: options.benchmark ? () => {} : rotation.remember, targetKeys: keys.filter((key) => words.slice(0,limit).join(' ').includes(key)) }
}
export function buildLesson(seed: number, id: string, length: PassageLength): PreparedPractice {
  const lesson = lessonById(id)!
  const keys = weakestKeys(loadResults()), rotation = createPoemRotation(keys), selected: Poem[] = []
  const run = lesson.build(mulberry32(seed), (rng, from = POEMS) => {
    const within = from.filter((p) => { const n = poemTokens(p).length; return length === 'short' ? n <= 40 : length === 'medium' ? n > 40 && n <= 90 : n > 90 })
    const target = length === 'short' ? 25 : length === 'medium' ? 65 : 125
    const pool = within.length ? within : [...from].sort((a,b) => Math.abs(poemTokens(a).length-target)-Math.abs(poemTokens(b).length-target)).slice(0,3)
    const poem = rotation.pick(rng,pool); selected.push(poem); return poem
  })
  return { mode: run.mode, ...metadata(selected), remember: rotation.remember, targetKeys: selected.length ? keys.filter((key) => selected[0]!.lines.join(' ').includes(key)) : [] }
}
