import { useEffect, type ReactNode } from 'react'
import type { CreateEngineConfig, EngineSnapshot } from '../engine/types'
import { useFocusMode } from '../hooks/useFocusMode'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { KeyboardViz } from './KeyboardViz'
import { LiveHud } from './LiveHud'
import { TypingStage } from './TypingStage'

interface TypingSessionOptions {
  config: CreateEngineConfig
  sound: boolean
  showKeyboard: boolean
  armed?: boolean
  onComplete?: (snapshot: EngineSnapshot) => void
  idleNote?: ReactNode
  header?: ReactNode
}

export function useTypingSession({
  config,
  sound,
  showKeyboard,
  armed = true,
  onComplete,
  idleNote,
  header,
}: TypingSessionOptions) {
  const { snapshot, restart, inputRef, onKeyDown, focus } = useTypingEngine({
    config,
    sound,
    armed,
    onComplete,
  })
  const { setFocused } = useFocusMode()

  useEffect(() => {
    setFocused(armed && snapshot.status === 'running')
    return () => setFocused(false)
  }, [snapshot.status, setFocused, armed])

  useEffect(() => {
    if (armed) focus()
  }, [focus, armed])

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
        value=""
        onChange={() => {}}
      />
    ) : (
      <div className="folio mx-auto flex min-h-[68vh] w-full flex-col justify-center">
        {snapshot.status !== 'running' ? header : null}
        <LiveHud stats={snapshot.stats} />
        <div className="mt-10">
          <TypingStage
            snapshot={snapshot}
            inputRef={inputRef}
            onKeyDown={onKeyDown}
            onFocusClick={focus}
          />
        </div>
        {snapshot.status === 'idle' ? (
          <div className="mt-8 text-sm text-muted">{idleNote}</div>
        ) : null}
        {showKeyboard ? <KeyboardViz expected={snapshot.expectedKey} /> : null}
      </div>
    )

  return { snapshot, restart, view, focus }
}
