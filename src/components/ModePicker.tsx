import type { TimedSeconds, WordCount } from '../engine/types'
import { cn } from '../lib/cn'

const TIMES: TimedSeconds[] = [15, 30, 60, 120]
const COUNTS: WordCount[] = [10, 25, 50, 100]

interface ModePickerProps {
  mode: { kind: 'timed'; seconds: TimedSeconds } | { kind: 'words'; count: WordCount }
  onTimed: (seconds: TimedSeconds) => void
  onWords: (count: WordCount) => void
}

export function ModePicker({ mode, onTimed, onWords }: ModePickerProps) {
  return (
    <div className="flex flex-col gap-4 font-mono text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Timed modes">
        <span className="px-1.5 text-[11px] uppercase tracking-[0.14em] text-muted">Time</span>
        {TIMES.map((seconds) => (
          <ModeChip
            key={seconds}
            selected={mode.kind === 'timed' && mode.seconds === seconds}
            onClick={() => onTimed(seconds)}
            label={`${seconds} seconds`}
          >
            {seconds}
          </ModeChip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Word-count modes">
        <span className="px-1.5 text-[11px] uppercase tracking-[0.14em] text-muted">Words</span>
        {COUNTS.map((count) => (
          <ModeChip
            key={count}
            selected={mode.kind === 'words' && mode.count === count}
            onClick={() => onWords(count)}
            label={`${count} words`}
          >
            {count}
          </ModeChip>
        ))}
      </div>
    </div>
  )
}

function ModeChip({
  selected,
  onClick,
  label,
  children,
}: {
  selected: boolean
  onClick: () => void
  label: string
  children: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={cn(
        'min-h-11 min-w-11 px-2.5 py-1 text-muted transition-colors duration-180 lg:min-h-0 lg:min-w-0',
        selected
          ? 'bg-fg text-bg'
          : 'hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
