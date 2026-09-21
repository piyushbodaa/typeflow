import { POEMS } from '../data/poems'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AboutPage() {
  useDocumentTitle('About · typeflow')
  const poets = Array.from(new Set(POEMS.map((p) => p.poet)))
  const places = Array.from(new Set(POEMS.map((p) => p.origin)))

  return (
    <article className="folio text-[16px] leading-7">
      <div className="rule" />
      <p className="kicker mt-8">About</p>
      <h1 className="mt-4 font-display text-[2.6rem] italic leading-[1.05] tracking-tight">
        A desk for setting type.
      </h1>
      <p className="mt-6 text-muted">
        Typeflow is a typing trainer for a real keyboard - and it still runs on a phone. A
        physical keyboard is better; glass still counts.
      </p>
      <h2 className="mt-10 font-display text-[1.6rem] italic tracking-tight">Why poems</h2>
      <p className="mt-3 text-muted">
        Typing random words is a chore, so Typeflow does not ask you to. Apart from five short
        key drills at the start of the lessons, every line you type is a stanza from a poem:{' '}
        {POEMS.length} passages by {poets.length} poets from {places.join(', ')}. The 1-minute test
        runs through them too. Each poem is credited on screen; all of them are in the public
        domain, either in the original or in an old translation, and a few short ones were
        translated for Typeflow.
      </p>
      <p className="mt-3 text-muted">
        Poets in the set: {poets.join(', ')}.
      </p>
      <p className="mt-4 text-muted">
        Words per minute uses the standard formula: (correct characters / 5) divided by minutes
        elapsed. Raw WPM counts incorrect and extra characters too. Accuracy is correct divided by
        correct + incorrect + extra.
      </p>
      <p className="mt-4 text-muted">
        There is no account and no server. Settings, lesson progress, and the last fifty results
        stay in this browser&apos;s localStorage. Close the tab and they are still here; clear the
        site data and they are gone.
      </p>
      <p className="mt-4 text-muted">
        The home page is a hub — last run, best run, a short trail of accuracy. The 1-minute test
        is one click away, and it never starts until you mean it.
      </p>
      <div className="rule mt-12" />
    </article>
  )
}
