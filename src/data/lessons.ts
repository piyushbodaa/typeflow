import difficult from './difficult-words.json'
import quotes from './quotes.json'
import words from './words.json'
import { generateFromCharset, pickWords, tokenize, wordsUsingCharset } from '../engine/generate'
import type { EngineMode } from '../engine/types'

export interface Lesson {
  id: string
  order: number
  title: string
  instruction: string
  build: (rng: () => number) => EngineMode
}

const HOME_KEYS = 'asdfjkl;'
const HOME_ROW = 'asdfghjkl;'
const REACH = 'asdfjkl;eriu'
const TOP = 'qwertyuiop'
const BOTTOM = 'zxcvbnm'

const HOME_WORDS = [
  'a','as','add','ads','alas','all','ask','asks','dad','sad','fall','falls','flask','flasks',
  'salad','salsa','lass','lads','fad','fads','alfalfa','lad','hall','halls','dash','slash',
  'gala','flag','flags','glad','glass','flask','salad','asks','fall','all',
]

const REACH_WORDS = [
  'fire','sure','rail','idea','real','read','fair','fail','rule','ride','said','used','field',
  'fear','free','full','feel','rise','leaf','dear','seal','lead','life','file','idle','dual',
  'usual','reuse','safer','raised','failed','desire','serial','unused','refuse','ladder',
]

const SHIFT_WORDS = tokenize(
  'The Quick brown Fox jumps. Keep Caps honest. Shift left and Right. Type A Name like Ada and Alan.',
)

const PUNCT_WORDS = tokenize(
  "Wait, really? Yes; it's time. Don't stop: type \"flow\" well. Hello, world!",
)

const NUMBER_WORDS = tokenize(
  'room 12 seats 4 and 8. Meet at 3:00. Add 10 plus 25 minus 7. Year 2026 counts 365 days.',
)

const MIXED_BANK = [
  ...words.slice(0, 200),
  "it's","don't","can't","that's","I'll","you're",
  '12','30','100','3.14','2026',
  'Hello','Typeflow','Shift',
  "wait,","yes.","go!",
]

function mix(preferred: string[], fallback: string[], count: number, rng: () => number): string[] {
  const bank = preferred.length >= 8 ? preferred : preferred.concat(fallback)
  return pickWords(bank, count, rng)
}

export const LESSONS: Lesson[] = [
  {
    id: 'home-row',
    order: 1,
    title: 'Home row keys',
    instruction: 'Rest on asdf jkl; and type the groups as they come.',
    build: (rng) => ({ kind: 'custom', words: generateFromCharset(HOME_KEYS, 40, rng, 4, 5) }),
  },
  {
    id: 'home-row-words',
    order: 2,
    title: 'Home row words',
    instruction: 'Same home-row posture, now with real words.',
    build: (rng) => ({
      kind: 'custom',
      words: mix(wordsUsingCharset(HOME_WORDS, HOME_ROW), HOME_WORDS, 40, rng),
    }),
  },
  {
    id: 'reach',
    order: 3,
    title: 'Reach keys: e r i u',
    instruction: 'Keep home-row anchors and reach for e, r, i, and u.',
    build: (rng) => ({
      kind: 'custom',
      words: mix(wordsUsingCharset(REACH_WORDS, REACH), REACH_WORDS, 40, rng),
    }),
  },
  {
    id: 'top-row',
    order: 4,
    title: 'Top row',
    instruction: 'Stretch to qwertyuiop without leaving the home row for long.',
    build: (rng) => {
      const filtered = wordsUsingCharset(words, TOP)
      const generated = generateFromCharset(TOP, 20, rng, 3, 5)
      return { kind: 'custom', words: mix(filtered.concat(generated), generated, 40, rng) }
    },
  },
  {
    id: 'bottom-row',
    order: 5,
    title: 'Bottom row',
    instruction: 'Drop to zxcvbnm, then return to home row.',
    build: (rng) => {
      const filtered = wordsUsingCharset(words, BOTTOM + HOME_ROW)
      const generated = generateFromCharset(BOTTOM, 16, rng, 3, 5)
      return { kind: 'custom', words: mix(filtered.concat(generated), generated, 36, rng) }
    },
  },
  {
    id: 'shift',
    order: 6,
    title: 'Shift and capital letters',
    instruction: 'Hold Shift with the opposite pinky, then type the letter.',
    build: () => ({ kind: 'custom', words: SHIFT_WORDS.concat(SHIFT_WORDS) }),
  },
  {
    id: 'punct',
    order: 7,
    title: 'Punctuation',
    instruction: 'Type commas, periods, quotes, and the rest without looking down.',
    build: () => ({ kind: 'custom', words: PUNCT_WORDS.concat(PUNCT_WORDS) }),
  },
  {
    id: 'numbers',
    order: 8,
    title: 'Numbers',
    instruction: 'Reach the number row, then drop back to asdf jkl;.',
    build: () => ({ kind: 'custom', words: NUMBER_WORDS.concat(NUMBER_WORDS) }),
  },
  {
    id: 'common',
    order: 9,
    title: 'Common English words',
    instruction: 'A short run of the words you actually type every day.',
    build: (rng) => ({ kind: 'custom', words: pickWords(words, 50, rng) }),
  },
  {
    id: 'difficult',
    order: 10,
    title: 'Difficult words',
    instruction: 'Slow down. Accuracy still has to land at 95%.',
    build: (rng) => ({ kind: 'custom', words: pickWords(difficult, 30, rng) }),
  },
  {
    id: 'quotes',
    order: 11,
    title: 'Short quotes',
    instruction: 'Capitals and punctuation, in complete lines.',
    build: () => ({ kind: 'custom', words: quotes.flatMap((q) => tokenize(q)) }),
  },
  {
    id: 'graduation',
    order: 12,
    title: 'Mixed graduation test',
    instruction: 'Sixty seconds. Mix of words, numbers, and punctuation. Pass at 95% accuracy.',
    build: (rng) => ({ kind: 'custom', words: pickWords(MIXED_BANK, 250, rng), seconds: 60 }),
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

export type LessonStatus = 'locked' | 'available' | 'done'

export function lessonStatus(id: string, completed: string[]): LessonStatus {
  const lesson = lessonById(id)
  if (!lesson) return 'locked'
  if (completed.includes(id)) return 'done'
  if (lesson.order === 1) return 'available'
  const prev = LESSONS.find((l) => l.order === lesson.order - 1)
  if (prev && completed.includes(prev.id)) return 'available'
  return 'locked'
}
