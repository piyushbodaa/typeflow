import { POEMS, pickPoem, type PoemPicker } from '../data/poems'

const KEY = 'typeflow:poem-rotation:v1'
let fallback: string[] = []

function load(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (Array.isArray(value)) return value.filter((id): id is string => typeof id === 'string')
  } catch { /* Practice still works when storage is unavailable. */ }
  return fallback.slice()
}

/** Build without writing during render; remember only when practice begins. */
export function createPoemRotation() {
  const recent = load()
  const selected: string[] = []
  const pick: PoemPicker = (rng, from = POEMS) => {
    const pool = from.length ? from : POEMS
    const unseen = pool.filter((poem) => !recent.includes(poem.id))
    const oldest = Math.min(...pool.map((poem) => recent.indexOf(poem.id)))
    const candidates = unseen.length ? unseen : pool.filter((poem) => recent.indexOf(poem.id) === oldest)
    const poem = pickPoem(rng, candidates)
    const index = recent.indexOf(poem.id)
    if (index >= 0) recent.splice(index, 1)
    recent.push(poem.id)
    selected.push(poem.id)
    return poem
  }
  return {
    pick,
    remember() {
      const ids = new Set(POEMS.map((poem) => poem.id))
      const history = load().filter((id) => ids.has(id) && !selected.includes(id))
      for (const id of selected) {
        const index = history.indexOf(id)
        if (index >= 0) history.splice(index, 1)
        history.push(id)
      }
      fallback = history
      try { localStorage.setItem(KEY, JSON.stringify(fallback)) } catch { /* Use memory fallback. */ }
    },
  }
}
