import { POEMS, pickPoem, type PoemPicker } from '../data/poems'

import { loadPoemHistory, savePoemHistory } from './storage'

/** Build without writing during render; remember only when practice begins. */
export function createPoemRotation(targetKeys: string[] = []) {
  const recent = loadPoemHistory().slice()
  const selected: string[] = []
  const pick: PoemPicker = (rng, from = POEMS) => {
    const pool = from.length ? from : POEMS
    const unseen = pool.filter((poem) => !recent.includes(poem.id))
    const oldest = Math.min(...pool.map((poem) => recent.indexOf(poem.id)))
    const fresh = unseen.length ? unseen : pool.filter((poem) => recent.indexOf(poem.id) === oldest)
    const relevant = targetKeys.length ? fresh.filter((poem) => targetKeys.some((key) => poem.lines.join(' ').includes(key))) : []
    const candidates = relevant.length ? relevant : fresh
    const weights = candidates.map((poem) => 1 + targetKeys.reduce((sum, key) => sum + Math.min(12, [...poem.lines.join(' ')].filter((ch) => ch === key).length), 0))
    let ticket = rng() * weights.reduce((sum, weight) => sum + weight, 0)
    let choice = candidates.length - 1
    for (let i = 0; i < candidates.length; i++) { ticket -= weights[i]!; if (ticket < 0) { choice = i; break } }
    const poem = pickPoem(() => (choice + 0.5) / candidates.length, candidates)
    const index = recent.indexOf(poem.id)
    if (index >= 0) recent.splice(index, 1)
    recent.push(poem.id)
    selected.push(poem.id)
    return poem
  }
  return {
    pick,
    remember(only?: string[]) {
      const toRemember = only ? selected.filter((id) => only.includes(id)) : selected
      const ids = new Set(POEMS.map((poem) => poem.id))
      const history = loadPoemHistory().filter((id) => ids.has(id) && !toRemember.includes(id))
      for (const id of toRemember) {
        const index = history.indexOf(id)
        if (index >= 0) history.splice(index, 1)
        history.push(id)
      }
      savePoemHistory(history)
    },
  }
}
