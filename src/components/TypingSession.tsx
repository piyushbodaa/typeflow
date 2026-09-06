import { useEffect, type ReactNode } from 'react'
import type { CreateEngineConfig, EngineSnapshot } from '../engine/types'
import { useFocusMode } from '../hooks/useFocusMode'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { useVisualViewport } from '../hooks/useVisualViewport'
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
  const { snapshot, restart, inputRef, onKeyDown, onInput, focus } = useTypingEngine({
    config,
    sound,
    armed,
    onComplete,
  })
  const { setFocused } = useFocusMode()
  const viewportHeight = useVisualViewport()

  useEffect(() => {
    setFocused(armed && snapshot.status === 'running')
    return () => setFocused(false)
  }, [snapshot.status, setFocused, armed])

  useEffect(() => {
    if (armed) focus()
  }, [focus, armed])

  const running = snapshot.status === 'running'

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
      />
    ) : (
      <div
        className="folio mx-auto flex w-full flex-col lg:min-h-[68vh] lg:justify-center"
        style={
          running && viewportHeight > 0
            ? { maxHeight: Math.max(220, viewportHeight - 24), justifyContent: 'flex-start' }
            : undefined
        }
      >
        {snapshot.status !== 'running' ? header : null}
        <LiveHud stats={snapshot.stats} />
        <div className="mt-6 lg:mt-10">
          <TypingStage
            snapshot={snapshot}
            inputRef={inputRef}
            onKeyDown={onKeyDown}
            onInput={onInput}
            onFocusClick={focus}
          />
        </div>
        {snapshot.status === 'idle' ? (
          <div className="mt-6 text-sm text-muted lg:mt-8">{idleNote}</div>
        ) : null}
        {showKeyboard ? (
          <div className="hidden lg:block">
            <KeyboardViz expected={snapshot.expectedKey} />
          </div>
        ) : null}
      </div>
    )

  return { snapshot, restart, view, focus }
}
