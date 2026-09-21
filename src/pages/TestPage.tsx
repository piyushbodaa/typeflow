import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ModePicker } from '../components/ModePicker'
import { ResultsPanel } from '../components/ResultsPanel'
import { useTypingSession } from '../components/TypingSession'
import words from '../data/words.json'
import type { EngineSnapshot, TimedSeconds, WordCount } from '../engine/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../hooks/useHistory'
import { modeLabel } from '../lib/format'
import { poemStream } from '../data/poems'
import { mulberry32 } from '../engine/generate'
import type { EngineMode } from '../engine/types'
import { snapshotToResult } from '../lib/result'
import { useSettings } from '../hooks/useTheme'

export type TextSource = 'poems' | 'words'

function parseMode(
  params: URLSearchParams,
): { kind: 'timed'; seconds: TimedSeconds } | { kind: 'words'; count: WordCount } {
  const secondsRaw = Number(params.get('seconds'))
  const wordsRaw = Number(params.get('words'))
  if (wordsRaw === 10 || wordsRaw === 25 || wordsRaw === 50 || wordsRaw === 100) {
    return { kind: 'words', count: wordsRaw }
  }
  if (secondsRaw === 15 || secondsRaw === 30 || secondsRaw === 60 || secondsRaw === 120) {
    return { kind: 'timed', seconds: secondsRaw }
  }
  return { kind: 'timed', seconds: 60 }
}

export function TestPage() {
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const mode = useMemo(() => parseMode(params), [params])
  const source: TextSource = params.get('source') === 'words' ? 'words' : 'poems'
  // Poems are typed in order, so they become a custom run sized to the chosen mode; random
  // words keep the engine's own top-up behaviour. History still records the picked mode.
  const engineMode = useMemo<EngineMode>(() => {
    if (source === 'words') return mode
    const rng = mulberry32(Date.now() % 2147483647)
    if (mode.kind === 'words') return { kind: 'custom', words: poemStream(rng, mode.count).slice(0, mode.count) }
    return { kind: 'custom', words: poemStream(rng, mode.seconds * 5), seconds: mode.seconds }
  }, [mode, source])
  const [armed, setArmed] = useState(() => params.get('go') === '1')
  const beginRef = useRef<HTMLButtonElement>(null)
  const { record } = useHistory()
  const config = useMemo(() => ({ mode: engineMode, wordBank: words }), [engineMode])

  useDocumentTitle(`Test \u00b7 typeflow`)

  useEffect(() => {
    if (params.get('go') === '1') setArmed(true)
  }, [params])

  useEffect(() => {
    if (!armed) beginRef.current?.focus()
  }, [armed])

  const onComplete = useCallback(
    (snapshot: EngineSnapshot) => {
      record(snapshotToResult(snapshot, 'test', mode))
    },
    [record, mode],
  )

  const session = useTypingSession({
    config,
    sound: settings.sound,
    showKeyboard: settings.showKeyboard,
    armed,
    onComplete,
    idleNote: 'First keystroke starts the clock. Tab then Enter restarts. Tap the line to summon the keyboard.',
    header: (
      <div className="mb-10">
        <div className="rule mb-8" />
        <p className="kicker">{modeLabel(mode)}</p>
        <h1 className="mt-3 font-display text-[2.1rem] italic leading-tight tracking-tight">
          Type when you are ready.
        </h1>
      </div>
    ),
  })

  function pickTime(seconds: TimedSeconds) {
    setParams({ seconds: String(seconds), source })
    setArmed(false)
  }

  function pickWords(count: WordCount) {
    setParams({ words: String(count), source })
    setArmed(false)
  }

  function pickSource(next: TextSource) {
    const keep: Record<string, string> =
      mode.kind === 'words' ? { words: String(mode.count) } : { seconds: String(mode.seconds) }
    setParams({ ...keep, source: next })
    setArmed(false)
  }

  function retry() {
    // Same path as a clean session: reset engine + remount stage + restore focus.
    session.restart()
  }

  if (session.snapshot.status === 'finished') {
    return (
      <>
        {session.view}
        <ResultsPanel
          snapshot={session.snapshot}
          copyLabel={modeLabel(mode)}
          actions={[
            { label: 'Retry', onClick: retry, primary: true },
            { label: 'Back to hub', onClick: () => navigate('/') },
            { label: 'Lessons', onClick: () => navigate('/lessons') },
          ]}
        />
      </>
    )
  }

  if (!armed) {
    return (
      <div className="flex min-h-[72vh] flex-col">
        <div className="rule" />
        <p className="kicker mt-8">Practice</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.2rem)] italic leading-[1.02] tracking-tight">
          Choose a mode, then begin.
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">
          You type poetry here, not random words: stanzas from well-loved poems across the world,
          one after another. The clock does not start until you confirm. After that, the first
          keystroke starts the run.
        </p>
        <div className="mt-10">
          <ModePicker mode={mode} source={source} onTimed={pickTime} onWords={pickWords} onSource={pickSource} />
        </div>
        <button
          ref={beginRef}
          type="button"
          className="btn btn-primary mt-8 w-full sm:w-auto"
          onClick={() => setArmed(true)}
        >
          Begin test
        </button>
        <div className="mt-auto">
          <div className="rule" />
        </div>
      </div>
    )
  }

  return session.view
}
