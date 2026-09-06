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
    <section className="max-w-xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">result</p>
      <p className="mt-3 font-mono text-7xl font-medium tabular-nums tracking-tight text-accent">
        {Math.round(stats.wpm)}
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted">wpm</p>

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 font-mono text-sm sm:grid-cols-3">
        <Item label="raw" value={Math.round(stats.rawWpm).toString()} />
        <Item label="accuracy" value={`${Math.round(stats.accuracy)}%`} />
        <Item
          label="correct / incorrect / extra"
          value={`${stats.correct} / ${stats.incorrect} / ${stats.extra}`}
        />
        {consistency != null ? (
          <Item label="consistency" value={`${Math.round(consistency)}%`} />
        ) : null}
      </dl>

      <div className="mt-10">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          wpm over time
        </p>
        <Sparkline series={wpmSeries} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {actions.map((action, i) => (
          <button
            key={action.label}
            ref={i === 0 ? firstRef : undefined}
            type="button"
            onClick={action.onClick}
            className={action.primary ? 'btn btn-primary' : 'btn'}
          >
            {action.label}
          </button>
        ))}
        <button type="button" onClick={() => void copy()} className="btn">
          {copied ? 'Copied' : 'Copy result'}
        </button>
      </div>
      <p className="mt-4 font-mono text-xs text-muted">{text}</p>
      <p className="mt-6 text-xs text-muted">Tab then Enter restarts.</p>
    </section>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  )
}
