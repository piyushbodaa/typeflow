import { useEffect, type ReactNode } from 'react'
import type { CreateEngineConfig, EngineSnapshot } from '../engine/types'
import { useFocusMode } from '../hooks/useFocusMode'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { Link } from 'react-router-dom'
import { ComfortControls } from './ComfortControls'
import { poemCredit } from '../data/poems'
import type { Passage } from '../lib/practice'
import { fingerFor, needsShift } from '../engine/keys'
import { KeyboardViz } from './KeyboardViz'
import { LiveHud } from './LiveHud'
import { TypingStage } from './TypingStage'

interface TypingSessionOptions {
  config: CreateEngineConfig
  sound: boolean
  showKeyboard: boolean
  armed?: boolean
  onRestart?: () => void
  onComplete?: (snapshot: EngineSnapshot) => void
  idleNote?: ReactNode
  header?: ReactNode
  passages?: Passage[]
  lineBreaks?: number[]
  onFresh?: () => void
  exitTo?: string
  sessionLabel?: string
  onPoemSeen?: (id: string) => void
}

export function useTypingSession({
  config,
  sound,
  showKeyboard,
  armed = true,
  onComplete,
  onRestart,
  idleNote,
  header,
  passages = [],
  lineBreaks = [],
  onFresh,
  exitTo = '/',
  onPoemSeen,
  sessionLabel,
}: TypingSessionOptions) {
  const { snapshot, restart, sessionKey, inputRef, onKeyDown, onInput, focus } = useTypingEngine({
    config,
    sound,
    armed,
    onComplete,
    onRestart,
  })
  const { setFocused } = useFocusMode()

  useEffect(() => {
    setFocused(armed && snapshot.status === 'running')
    return () => setFocused(false)
  }, [snapshot.status, setFocused, armed])

  // Restore focus whenever a live session is shown - including after Retry /
  // Tab+Enter, which remount the stage (sessionKey) with status back to idle.
  // Fresh Begin / go=1 also lands here via armed flipping true.
  useEffect(() => {
    if (!armed || snapshot.status === 'finished') return
    focus()
  }, [focus, armed, snapshot.status, sessionKey])

  const passageIndex = config.mode.kind === 'custom' && config.mode.seconds ? snapshot.caret.wordIndex % config.mode.words.length : snapshot.caret.wordIndex
  const activePassage = passages.find((passage) => passageIndex >= passage.start && passageIndex < passage.end)
  const activeId = activePassage?.poem.id
  useEffect(() => { if (armed && activeId) onPoemSeen?.(activeId) }, [armed, activeId, onPoemSeen])
  const running = snapshot.status === 'running'

  // Finished: keep a focusable sink so Tab+Enter still works if the window
  // listener is somehow skipped, but do not steal focus from ResultsPanel.
  // Live: remount TypingStage on each sessionKey so the input is brand-new.
  const view =
    snapshot.status === 'finished' ? (
      <input
        ref={inputRef}
        aria-label="Type here"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        onKeyDown={onKeyDown}
        onInput={onInput}
        value=""
        onChange={() => {}}
        tabIndex={-1}
      />
    ) : (
      <div
        key={sessionKey}
        className={`practice-session mx-auto flex w-full flex-col ${running ? 'practice-session-running' : ''}`}
      >
        {running && sessionLabel ? <p className="kicker mb-4">{sessionLabel}</p> : null}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-4">
            <button type="button" className="practice-link" onClick={restart}>Repeat <span className="text-muted">Alt+R</span></button>
            {onFresh ? <button type="button" className="practice-link" onClick={onFresh}>New passage</button> : null}
            <Link to={exitTo} className="practice-link">Exit practice</Link>
          </div>
          <details className="relative"><summary className="cursor-pointer">Comfort</summary><div className="comfort-popover"><ComfortControls /></div></details>
        </div>
        {snapshot.status !== 'running' ? header : null}
        {activePassage ? <p className="mb-4 text-xs text-muted">{poemCredit(activePassage.poem)}</p> : null}
        <LiveHud stats={snapshot.stats} />
        <div className="mt-6 lg:mt-10">
          <TypingStage
            snapshot={snapshot}
            lineBreaks={lineBreaks}
            inputRef={inputRef}
            onKeyDown={onKeyDown}
            onInput={onInput}
            onFocusClick={focus}
          />
        </div>
        {snapshot.status === 'idle' ? (
          <div className="mt-6 text-sm text-muted lg:mt-8">{idleNote}</div>
        ) : null}
        {config.guided ? <p className="mt-4 text-sm text-muted" aria-live="polite">{snapshot.words[snapshot.caret.wordIndex]?.chars.some((cell) => cell.flag === 'incorrect') ? 'Press Backspace to correct the highlighted letter.' : `Use your ${fingerFor(snapshot.expectedKey)}${needsShift(snapshot.expectedKey) ? ', with Shift held by the opposite pinky' : ''}.`}</p> : null}
        {showKeyboard ? (
          <div className="hidden lg:block">
            <KeyboardViz expected={snapshot.expectedKey} />
          </div>
        ) : null}
      </div>
    )

  return { snapshot, restart, view, focus }
}
