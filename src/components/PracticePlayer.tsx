import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import words from '../data/words.json'
import { useSettings } from '../hooks/useTheme'
import { useHistory } from '../hooks/useHistory'
import { snapshotToResult } from '../lib/result'
import type { PreparedPractice } from '../lib/practice'
import type { TestResult } from '../lib/storage'
import type { EngineSnapshot } from '../engine/types'
import { useTypingSession } from './TypingSession'
import { ResultsPanel } from './ResultsPanel'
import { ComfortControls } from './ComfortControls'
import { PoemReader } from './PoemReader'
import { poemCredit } from '../data/poems'

interface Props {
  title: string
  kicker: string
  instruction: string
  build: (seed: number) => PreparedPractice
  resultInfo: Partial<TestResult> & { source: 'test' | 'lesson' }
  autoBegin?: boolean
  forcedStyle?: 'guided' | 'flow'
  onResult?: (snapshot: EngineSnapshot) => void
  nextAction?: { label: string; onClick: () => void }
  passAccuracy?: number
  setup?: ReactNode
  exitTo?: string
}
export function PracticePlayer({ title, kicker, instruction, build, resultInfo, autoBegin = false, forcedStyle, onResult, nextAction, passAccuracy, setup, exitTo = '/' }: Props) {
  const { settings } = useSettings(), { record } = useHistory(), navigate = useNavigate()
  const [seed, setSeed] = useState(() => Date.now() % 2147483647)
  const [armed, setArmed] = useState(autoBegin)
  const prepared = useMemo(() => build(seed), [build, seed])
  const style = forcedStyle ?? settings.practiceStyle
  const [runStyle, setRunStyle] = useState(style)
  const seen = useCallback((id: string) => prepared.remember([id]), [prepared])
  const complete = useCallback((snapshot: EngineSnapshot) => {
    const mode = resultInfo.mode ?? prepared.mode
    record({ ...snapshotToResult(snapshot, resultInfo.source, mode, resultInfo.lessonId), ...resultInfo,
      practiceStyle: runStyle, poemIds: [...new Set(prepared.passages.filter((p) => p.start <= snapshot.caret.wordIndex).map((p) => p.poem.id))] })
    onResult?.(snapshot)
  }, [record, resultInfo, prepared, runStyle, onResult])
  const fresh = () => setSeed((s) => (s + 1 + Math.floor(Math.random() * 100000)) % 2147483647)
  const session = useTypingSession({
    config: { mode: prepared.mode, wordBank: words, seed, guided: runStyle === 'guided' },
    sound: settings.sound, showKeyboard: settings.showKeyboard, armed, onComplete: complete,
    onPoemSeen: seen,
    sessionLabel: kicker,
    onFresh: resultInfo.benchmark ? undefined : fresh, passages: prepared.passages, lineBreaks: prepared.lineBreaks, exitTo,
    idleNote: `${runStyle === 'guided' ? 'Correct errors with Backspace before continuing.' : 'Keep your rhythm; review mistakes afterward.'} First keystroke starts the clock. Alt+R repeats.`,
    header: <div className="mb-6"><p className="kicker">{kicker} · {runStyle}</p><h1 className="mt-2 font-display text-3xl italic">{title}</h1></div>,
  })
  const passed = passAccuracy == null || session.snapshot.stats.firstAccuracy >= passAccuracy
  if (session.snapshot.status === 'finished') return <>
    {session.view}
    {passAccuracy != null ? <p className="mb-5 text-sm">{passed ? 'Passed' : 'Keep practicing'} · {Math.round(session.snapshot.stats.firstAccuracy)}% first-attempt accuracy. Target: {passAccuracy}%.</p> : null}
    <ResultsPanel snapshot={session.snapshot} copyLabel={title} actions={[
      ...(nextAction && passed ? [{ ...nextAction, primary: true }] : []),
      { label: prepared.passages.length ? 'Repeat this poem' : 'Repeat exercise', onClick: session.restart, primary: !nextAction },
      ...(!resultInfo.benchmark ? [{ label: prepared.passages.length ? 'New poem' : 'New exercise', onClick: fresh }] : []),
      { label: 'Practice weak keys', onClick: () => navigate('/test?adaptive=1') },
      { label: 'Back to hub', onClick: () => navigate('/') },
    ]} />
    <PoemReader passages={prepared.passages.filter((p) => p.start <= session.snapshot.caret.wordIndex)} />
  </>
  if (!armed) {
    const count = prepared.mode.kind === 'custom' ? prepared.mode.words.length : prepared.mode.kind === 'words' ? prepared.mode.count : null
    const seconds = prepared.mode.kind === 'timed' ? prepared.mode.seconds : prepared.mode.kind === 'custom' ? prepared.mode.seconds : null
    const estimated = count ? Math.max(1, Math.ceil(count / 35)) : null
    return <div className="max-w-4xl">
      <div className="rule" /><p className="kicker mt-8">{kicker}</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] italic leading-tight">{title}</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">{instruction}</p>
      {setup ? <div className="mt-7">{setup}</div> : null}
      <div className="coaching-card mt-8">
        <p className="kicker">On your desk</p>
        {prepared.passages[0] ? <p className="mt-3 font-display text-2xl italic">{prepared.passages[0].poem.title}</p> : null}
        {prepared.passages[0] ? <p className="mt-2 text-xs text-muted">{poemCredit(prepared.passages[0].poem)}</p> : null}
        <p className="mt-3 text-sm text-muted">{seconds ? `${seconds} seconds` : `${count ?? '—'} words · about ${estimated ?? 1} minute${estimated === 1 ? '' : 's'} at 35 WPM`}{passAccuracy ? ` · ${passAccuracy}% first-attempt accuracy to pass` : ''}</p>
        {prepared.targetKeys.length ? <p className="mt-3 text-sm">Selected to practice: <span className="font-mono">{prepared.targetKeys.join(' · ')}</span></p> : null}
        {!resultInfo.benchmark ? <button type="button" className="practice-link mt-3 text-sm" onClick={fresh}>Choose another passage →</button> : null}
      </div>
      <div className="mt-7"><ComfortControls includeStyle={!forcedStyle} /></div>
      <p className="mt-3 text-sm text-muted">{style === 'guided' ? 'Guided: finger cues and correction before continuing.' : 'Flow: uninterrupted practice, with coaching afterward.'}</p>
      <button type="button" className="btn btn-primary mt-7" onClick={() => { setRunStyle(style); setArmed(true) }}>Begin {resultInfo.source === 'lesson' ? 'lesson' : 'practice'}</button>
    </div>
  }
  return session.view
}
