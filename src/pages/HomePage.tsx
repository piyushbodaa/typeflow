import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTypingSession } from '../components/TypingSession'
import { ResultsPanel } from '../components/ResultsPanel'
import words from '../data/words.json'
import type { EngineSnapshot } from '../engine/types'
import { useHistory } from '../hooks/useHistory'
import { snapshotToResult } from '../lib/result'
import { useSettings } from '../hooks/useTheme'

export function HomePage() {
  const { settings } = useSettings()
  const navigate = useNavigate()
  const { record } = useHistory()
  const config = { mode: { kind: 'timed' as const, seconds: 60 as const }, wordBank: words }

  const onComplete = useCallback(
    (snapshot: EngineSnapshot) => {
      record(snapshotToResult(snapshot, 'test', config.mode))
    },
    [record],
  )

  const session = useTypingSession({
    config,
    sound: settings.sound,
    showKeyboard: settings.showKeyboard,
    onComplete,
    idleNote: (
      <>
        <span className="font-medium text-ink">1 minute test.</span> Start typing. Tab then Enter
        restarts.
      </>
    ),
    header: (
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">1 minute test</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Start typing to begin.</h1>
      </div>
    ),
  })

  if (session.snapshot.status === 'finished') {
    return (
      <>
        {session.view}
        <ResultsPanel
          snapshot={session.snapshot}
          copyLabel="60s"
          actions={[
            { label: 'Retry', onClick: session.restart, primary: true },
            { label: 'Try 30s', onClick: () => navigate('/test?seconds=30') },
            { label: 'Start lessons', onClick: () => navigate('/lessons') },
          ]}
        />
      </>
    )
  }

  return session.view
}
