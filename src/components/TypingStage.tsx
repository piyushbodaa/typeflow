import { Fragment, useEffect, useRef, type FormEvent, type KeyboardEvent, type RefObject } from 'react'
import type { EngineSnapshot, WordState } from '../engine/types'
import { useSettings } from '../hooks/useTheme'
import { cn } from '../lib/cn'

interface TypingStageProps {
  snapshot: EngineSnapshot
  inputRef: RefObject<HTMLInputElement | null>
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onInput: (event: FormEvent<HTMLInputElement>) => void
  onFocusClick: () => void
  lineBreaks?: number[]
}

export function TypingStage({
  snapshot,
  inputRef,
  onKeyDown,
  onInput,
  onFocusClick,
  lineBreaks = [],
}: TypingStageProps) {
  const { settings } = useSettings()
  const breaks = new Set(lineBreaks)
  const currentRef = useRef<HTMLSpanElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const word = currentRef.current
    const scroller = scrollerRef.current
    if (!word || !scroller) return
    const wordTop = word.offsetTop
    const line = word.offsetHeight
    const target = Math.max(0, wordTop - line)
    scroller.scrollTop = target
  }, [snapshot.caret.wordIndex, snapshot.caret.charIndex])

  return (
    <div className="relative w-full" onClick={onFocusClick}>
      <input
        ref={inputRef}
        aria-label="Type here"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode="text"
        enterKeyHint="done"
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        style={{ fontSize: 16 }}
        onKeyDown={onKeyDown}
        onInput={onInput}
        onPaste={(event) => event.preventDefault()}
        onDrop={(event) => event.preventDefault()}
        value=""
        onChange={() => {}}
      />
      <div
        ref={scrollerRef}
        className="stage overflow-hidden font-mono tracking-[0.01em]"
        style={{ fontSize: `clamp(18px, 5vw, ${settings.fontSize}px)`, lineHeight: 1.65, height: '4.95em' }}
      >
        <div className="flex flex-wrap gap-x-3 gap-y-0">
          {snapshot.words.map((word, index) => (
            <Fragment key={`${index}-${word.expected}`}>
            {breaks.has(index) ? <span className="basis-full h-0" aria-hidden /> : null}
            <Word
              word={word}
              active={index === snapshot.caret.wordIndex}
              caretIndex={index === snapshot.caret.wordIndex ? snapshot.caret.charIndex : null}
              blinking={snapshot.status !== 'running'}
              wordRef={index === snapshot.caret.wordIndex ? currentRef : undefined}
            />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function Word({
  word,
  active,
  caretIndex,
  blinking,
  wordRef,
}: {
  word: WordState
  active: boolean
  caretIndex: number | null
  blinking: boolean
  wordRef?: RefObject<HTMLSpanElement | null>
}) {
  const extraStart = word.chars.length
  return (
    <span ref={wordRef} className={cn('relative whitespace-nowrap', active && 'text-fg')}>
      {word.chars.map((cell, i) => (
        <span key={i}>
          {caretIndex === i && <Caret blinking={blinking} />}
          <span
            className={cn(
              cell.flag === 'pending' && (active ? 'text-fg/40' : 'text-muted'),
              cell.flag === 'correct' && 'text-fg',
              cell.flag === 'incorrect' && 'char-incorrect',
            )}
          >
            {cell.expected}
          </span>
        </span>
      ))}
      {word.extras.map((ch, i) => (
        <span key={`e${i}`}>
          {caretIndex === extraStart + i && <Caret blinking={blinking} />}
          <span className="char-extra">{ch === ' ' ? '·' : ch}</span>
        </span>
      ))}
      {caretIndex === extraStart + word.extras.length && <Caret blinking={blinking} />}
    </span>
  )
}

function Caret({ blinking }: { blinking: boolean }) {
  return <span className={cn('caret', !blinking && 'caret-solid')} aria-hidden />
}
