import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [params, setParams] = useSearchParams()
  const mode = useMemo(() => parseMode(params), [params])
  const { record } = useHistory()
  const config = useMemo(() => ({ mode, wordBank: words }), [mode])

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
    onComplete,
    idleNote: 'Pick a duration or word count, then start typing.',
    header: (
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-medium tracking-tight">Test</h1>
        <ModePills
          mode={mode}
          onTimed={(seconds: TimedSeconds) => setParams({ seconds: String(seconds) })}
          onWords={(count: WordCount) => setParams({ words: String(count) })}
        />
      </div>
    ),
  })

  if (session.snapshot.status === 'finished') {
    return (
      <>
        {session.view}
        <ResultsPanel
          snapshot={session.snapshot}
          copyLabel={modeLabel(mode)}
          actions={[{ label: 'Retry', onClick: session.restart, primary: true }]}
        />
      </>
    )
  }

  return session.view
}
