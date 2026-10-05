import { poemCredit } from '../data/poems'
import type { Passage } from '../lib/practice'
export function PoemReader({ passages }: { passages: Passage[] }) {
  const unique = [...new Map(passages.map((p) => [p.poem.id,p.poem])).values()]
  if (!unique.length) return null
  return <details className="mt-8 border-t border-border pt-5">
    <summary className="cursor-pointer text-sm text-fg">Read the passages & credits</summary>
    <div className="grid gap-8 pt-6 md:grid-cols-2">{unique.map((poem) => <article key={poem.id}>
      <p className="mb-4 text-xs text-muted">{poemCredit(poem)}</p>
      <p className="whitespace-pre-line font-display text-xl leading-relaxed">{poem.lines.join('\n')}</p>
      <p className="mt-3 text-xs text-muted">{poem.full ? 'Complete poem' : 'Excerpt'} · Keyboard punctuation</p>
    </article>)}</div>
  </details>
}
