import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ModePills } from '../components/ModePills'
import { ResultsPanel } from '../components/ResultsPanel'
import { useTypingSession } from '../components/TypingSession'
import words from '../data/words.json'
import type { EngineSnapshot, TimedSeconds, WordCount } from '../engine/types'
import { useHistory } from '../hooks/useHistory'
import { modeLabel } from '../lib/format'
import { snapshotToResult } from '../lib/result'
import { useSettings } from '../hooks/useTheme'

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
  const [armed, setArmed] = useState(() => params.get('go') === '1')
  const beginRef = useRef<HTMLButtonElement>(null)
  const { record } = useHistory()
  const config = useMemo(() => ({ mode, wordBank: words }), [mode])

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
    idleNote: 'First keystroke starts the clock. Tab then Enter restarts.',
    header: (
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          {modeLabel(mode)}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Type when you are ready.</h1>
      </div>
    ),
  })

  function pickTime(seconds: TimedSeconds) {
    setParams({ seconds: String(seconds) })
    setArmed(false)
  }

  function pickWords(count: WordCount) {
    setParams({ words: String(count) })
    setArmed(false)
  }

  if (session.snapshot.status === 'finished') {
    return (
      <>
        {session.view}
        <ResultsPanel
          snapshot={session.snapshot}
          copyLabel={modeLabel(mode)}
          actions={[
            { label: 'Retry', onClick: session.restart, primary: true },
            { label: 'Dashboard', onClick: () => navigate('/') },
            { label: 'Lessons', onClick: () => navigate('/lessons') },
          ]}
        />
      </>
    )
  }

  if (!armed) {
    return (
      <div className="max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">practice</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">Choose a current, then begin.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The clock does not start until you confirm. After that, the first keystroke is the gun.
        </p>
        <div className="mt-8">
          <ModePills mode={mode} onTimed={pickTime} onWords={pickWords} />
        </div>
        <p className="mt-6 font-mono text-sm text-ink">{modeLabel(mode)}</p>
        <button
          ref={beginRef}
          type="button"
          className="btn btn-primary mt-8"
          onClick={() => setArmed(true)}
        >
          Begin test
        </button>
      </div>
    )
  }

  return session.view
}
