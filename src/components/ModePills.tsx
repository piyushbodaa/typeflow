import type { TimedSeconds, WordCount } from '../engine/types'
import { cn } from '../lib/cn'

const TIMES: TimedSeconds[] = [15, 30, 60, 120]
const COUNTS: WordCount[] = [10, 25, 50, 100]

interface ModePillsProps {
  mode: { kind: 'timed'; seconds: TimedSeconds } | { kind: 'words'; count: WordCount }
  onTimed: (seconds: TimedSeconds) => void
  onWords: (count: WordCount) => void
}

export function ModePills({ mode, onTimed, onWords }: ModePillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-8 font-mono text-sm">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">time</span>
        {TIMES.map((seconds) => (
          <button
            key={seconds}
            type="button"
            onClick={() => onTimed(seconds)}
            className={cn(
              'border-0 bg-transparent px-1.5 py-0.5 text-muted transition-colors duration-180',
              mode.kind === 'timed' && mode.seconds === seconds && 'text-accent',
            )}
          >
            {seconds}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">words</span>
        {COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => onWords(count)}
            className={cn(
              'border-0 bg-transparent px-1.5 py-0.5 text-muted transition-colors duration-180',
              mode.kind === 'words' && mode.count === count && 'text-accent',
            )}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  )
}
