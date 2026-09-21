import words from './words.json'
import {
  ENGLISH_POEMS,
  FULL_POEMS,
  POEMS,
  WORLD_POEMS,
  pickPoem,
  poemById,
  poemStream,
  poemTokens,
  type Poem,
} from './poems'
import { generateFromCharset, pickWords, tokenize, wordsUsingCharset } from '../engine/generate'
import type { EngineMode } from '../engine/types'

/** What one attempt at a lesson types, plus the poem it came from when there is one. */
export interface LessonRun {
  mode: EngineMode
  poem?: Poem
}

export interface Lesson {
  id: string
  order: number
  title: string
  instruction: string
  build: (rng: () => number) => LessonRun
}

// The first five lessons teach the keys, so they are limited to a few letters and cannot be
// poetry. They are kept short. From lesson six on, every line is a stanza from poems.ts.

const HOME_KEYS = 'asdfjkl;'
const HOME_ROW = 'asdfghjkl;'
const REACH = 'asdfjkl;eriu'
const TOP = 'qwertyuiop'
const BOTTOM = 'zxcvbnm'
const DRILL_LENGTH = 24

const HOME_WORDS = [
  'a','as','add','ads','alas','all','ask','asks','dad','sad','fall','falls','flask','flasks',
  'salad','salsa','lass','lads','fad','fads','alfalfa','lad','hall','halls','dash','slash',
  'gala','flag','flags','glad','glass',
]

const REACH_WORDS = [
  'fire','sure','rail','idea','real','read','fair','fail','rule','ride','said','used','field',
  'fear','free','full','feel','rise','leaf','dear','seal','lead','life','file','idle','dual',
  'usual','reuse','safer','raised','failed','desire','serial','unused','refuse','ladder',
]

function mix(preferred: string[], fallback: string[], count: number, rng: () => number): string[] {
  const bank = preferred.length >= 8 ? preferred : preferred.concat(fallback)
  return pickWords(bank, count, rng)
}

function drill(words: string[]): LessonRun {
  return { mode: { kind: 'custom', words } }
}

function stanza(poem: Poem): LessonRun {
  return { mode: { kind: 'custom', words: poemTokens(poem) }, poem }
}

const byIds = (ids: string[]) => ids.map((id) => poemById.get(id)!).filter(Boolean)

/** Poems whose lines lean on capitals - every line starts with one, and some capitalise nouns. */
const CAPITAL_POEMS = byIds([
  'the-tyger', 'auguries-of-innocence', 'ozymandias', 'kubla-khan', 'rubaiyat-book-of-verses',
  'rubaiyat-moving-finger', 'o-captain', 'because-i-could-not-stop', 'bazaars-of-hyderabad',
])

/** Poems thick with commas, dashes, semicolons, quotes, question and exclamation marks. */
const PUNCTUATION_POEMS = byIds([
  'hope', 'how-do-i-love-thee', 'o-captain', 'endymion', 'ulysses', 'remember', 'the-raven',
  'if-end', 'rubaiyat-book-of-verses', 'kabir-moon', 'gitanjali-35',
])

/** "Sonnet 18, 1609." - titles and years, so the number row gets a workout that still reads. */
function datedTitles(rng: () => number): string[] {
  const dated = POEMS.filter((p) => p.year)
  const seen = new Set<string>()
  const lines: string[] = []
  let guard = 0
  while (lines.length < 10 && guard < 100) {
    guard += 1
    const p = pickPoem(rng, dated)
    if (seen.has(p.title)) continue
    seen.add(p.title)
    lines.push(`${p.title}, ${p.year}.`)
  }
  return tokenize(lines.join(' '))
}

export const LESSONS: Lesson[] = [
  {
    id: 'home-row',
    order: 1,
    title: 'Home row keys',
    instruction: 'Rest on asdf jkl; and type the groups as they come. Short drill, then the poems begin.',
    build: (rng) => drill(generateFromCharset(HOME_KEYS, DRILL_LENGTH, rng, 4, 5)),
  },
  {
    id: 'home-row-words',
    order: 2,
    title: 'Home row words',
    instruction: 'Same home-row posture, now with real words.',
    build: (rng) => drill(mix(wordsUsingCharset(HOME_WORDS, HOME_ROW), HOME_WORDS, DRILL_LENGTH, rng)),
  },
  {
    id: 'reach',
    order: 3,
    title: 'Reach keys: e r i u',
    instruction: 'Keep home-row anchors and reach for e, r, i, and u.',
    build: (rng) => drill(mix(wordsUsingCharset(REACH_WORDS, REACH), REACH_WORDS, DRILL_LENGTH, rng)),
  },
  {
    id: 'top-row',
    order: 4,
    title: 'Top row',
    instruction: 'Stretch to qwertyuiop without leaving the home row for long.',
    build: (rng) => {
      const filtered = wordsUsingCharset(words, TOP)
      const generated = generateFromCharset(TOP, 12, rng, 3, 5)
      return drill(mix(filtered.concat(generated), generated, DRILL_LENGTH, rng))
    },
  },
  {
    id: 'bottom-row',
    order: 5,
    title: 'Bottom row',
    instruction: 'Drop to zxcvbnm, then return to home row.',
    build: (rng) => {
      const filtered = wordsUsingCharset(words, BOTTOM + HOME_ROW)
      const generated = generateFromCharset(BOTTOM + HOME_ROW, 12, rng, 3, 5)
      return drill(mix(filtered.concat(generated), generated, DRILL_LENGTH, rng))
    },
  },
  {
    id: 'shift',
    order: 6,
    title: 'Capital letters',
    instruction: 'Every line of a poem starts with a capital. Hold Shift with the opposite pinky, then type the letter.',
    build: (rng) => stanza(pickPoem(rng, CAPITAL_POEMS)),
  },
  {
    id: 'punct',
    order: 7,
    title: 'Punctuation',
    instruction: 'Commas, dashes, semicolons, and quotes, in lines that were written to be read aloud.',
    build: (rng) => stanza(pickPoem(rng, PUNCTUATION_POEMS)),
  },
  {
    id: 'numbers',
    order: 8,
    title: 'Numbers',
    instruction: 'Poems and the years they were published. Reach the number row, then drop back to asdf jkl;.',
    build: (rng) => drill(datedTitles(rng)),
  },
  {
    id: 'world',
    order: 9,
    title: 'Poems of the world',
    instruction: 'A stanza from India, Persia, China, Japan, or Europe, read in English.',
    build: (rng) => stanza(pickPoem(rng, WORLD_POEMS)),
  },
  {
    id: 'english',
    order: 10,
    title: 'Poems in English',
    instruction: 'A stanza from the English-language canon. Slow down; accuracy still has to land at 95%.',
    build: (rng) => stanza(pickPoem(rng, ENGLISH_POEMS)),
  },
  {
    id: 'whole-poem',
    order: 11,
    title: 'A whole poem',
    instruction: 'Start to finish, one complete poem. Capitals and punctuation, in complete lines.',
    build: (rng) => stanza(pickPoem(rng, FULL_POEMS)),
  },
  {
    id: 'graduation',
    order: 12,
    title: 'Graduation',
    instruction: 'Sixty seconds of poetry, stanza after stanza. Pass at 95% accuracy.',
    build: (rng) => ({ mode: { kind: 'custom', words: poemStream(rng, 400), seconds: 60 } }),
  },
]

export const PASS_ACCURACY = 95

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

export function nextLesson(id: string): Lesson | undefined {
  const current = lessonById(id)
  if (!current) return undefined
  return LESSONS.find((l) => l.order === current.order + 1)
}

export function availableLesson(completed: string[]): Lesson | undefined {
  return LESSONS.find((lesson) => lessonStatus(lesson.id, completed) === 'available')
}

export type LessonStatus = 'locked' | 'available' | 'done'

/** All lessons are open. Passed ones still show as done. */
export function lessonStatus(id: string, completed: string[]): LessonStatus {
  const lesson = lessonById(id)
  if (!lesson) return 'locked'
  if (completed.includes(id)) return 'done'
  return 'available'
}
