import { useEffect, useRef, useState } from 'react'
import type { EngineSnapshot } from '../engine/types'
import { formatCopyResult } from '../lib/format'
import { Sparkline } from './Sparkline'

interface Action {
  label: string
  onClick: () => void
  primary?: boolean
}

interface ResultsPanelProps {
  snapshot: EngineSnapshot
  copyLabel: string
  actions: Action[]
}

export function ResultsPanel({ snapshot, copyLabel, actions }: ResultsPanelProps) {
  const { stats, consistency, wpmSeries } = snapshot
  const [copied, setCopied] = useState(false)
  const firstRef = useRef<HTMLButtonElement>(null)
  const text = formatCopyResult(stats.wpm, stats.accuracy, copyLabel)

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="flex min-h-[72vh] flex-col" aria-live="polite">
      <div className="rule" />
      <p className="kicker mt-8">Result</p>
      <div className="mt-5 flex flex-wrap items-end gap-x-16 gap-y-8">
        <div>
          <p className="font-mono text-6xl font-medium leading-none tabular-nums tracking-tight text-fg lg:text-[6.5rem]">
            {Math.round(stats.wpm)}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">WPM</p>
        </div>
        <dl className="grid grid-cols-3 gap-x-10 gap-y-5 font-mono text-sm">
          <Item label="Raw" value={Math.round(stats.rawWpm).toString()} />
          <Item label="Accuracy" value={`${Math.round(stats.accuracy)}%`} />
          <Item label="Correct" value={stats.correct.toString()} />
          <Item label="Incorrect" value={stats.incorrect.toString()} />
          <Item label="Extra" value={stats.extra.toString()} />
          {consistency != null ? (
            <Item label="Consistency" value={`${Math.round(consistency)}%`} />
          ) : null}
        </dl>
      </div>

      {wpmSeries.length >= 2 ? (
        <div className="mt-10">
          <p className="mb-3 kicker">WPM over time</p>
          <Sparkline series={wpmSeries} />
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {actions.map((action, i) => (
          <button
            key={action.label}
            ref={i === 0 ? firstRef : undefined}
            type="button"
            onClick={action.onClick}
            className={action.primary ? 'btn btn-primary w-full sm:w-auto' : 'btn w-full sm:w-auto'}
          >
            {action.label}
          </button>
        ))}
        <button type="button" onClick={() => void copy()} className="btn w-full sm:w-auto">
          {copied ? 'Copied' : 'Copy result'}
        </button>
      </div>
      <p className="mt-4 font-mono text-xs text-muted">{text}</p>
      <p className="mt-5 text-xs text-muted">Tab then Enter restarts.</p>
      <div className="mt-auto">
        <div className="rule" />
      </div>
    </section>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="kicker">{label}</dt>
      <dd className="mt-1 text-fg">{value}</dd>
    </div>
  )
}
