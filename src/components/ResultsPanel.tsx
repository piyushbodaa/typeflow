import { useEffect, useRef, useState } from 'react'
import type { EngineSnapshot } from '../engine/types'
import { formatCopyResult } from '../lib/format'
import { keyLabel, recommendation } from '../lib/coaching'
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
  const text = formatCopyResult(stats.wpm, stats.firstAccuracy, copyLabel)

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
          <Item label="First attempt" value={`${Math.round(stats.firstAccuracy)}%`} />
          <Item label="Final text" value={`${Math.round(stats.accuracy)}%`} />
          <Item label="Correct" value={stats.correct.toString()} />
          <Item label="Incorrect" value={stats.incorrect.toString()} />
          <Item label="Extra" value={stats.extra.toString()} />
          {consistency != null ? (
            <Item label="Consistency" value={`${Math.round(consistency)}%`} />
          ) : null}
        </dl>
      </div>

      <div className="coaching-card mt-8">
        <p className="kicker">Your next step</p>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed">{recommendation(snapshot)}</p>
        <p className="mt-3 text-xs text-muted">First-attempt accuracy remembers errors after correction. Final text accuracy describes the text you finished with.</p>
        <div className="mt-5 flex flex-wrap gap-3">{Object.entries(snapshot.errorMap).sort((a,b) => b[1]-a[1]).slice(0,3).map(([key,count]) => <span key={key} className="border border-border px-3 py-2 text-sm"><span className="font-mono text-fg">{keyLabel(key)}</span> <span className="text-muted">· {count} mistake{count === 1 ? '' : 's'}</span></span>)}</div>
        {Object.keys(snapshot.pairErrors).length ? <p className="mt-4 text-sm text-muted">Tricky combinations: <span className="font-mono text-fg">{Object.entries(snapshot.pairErrors).sort((a,b) => b[1]-a[1]).slice(0,3).map(([pair]) => pair).join(' · ')}</span></p> : null}
        {Object.keys(snapshot.keyStats).length ? <details className="mt-5 text-sm"><summary className="cursor-pointer">Key-by-key review</summary><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="text-muted"><th className="pb-2">Key</th><th>Attempts</th><th>Mistakes</th><th>Accuracy</th><th>Average interval</th></tr></thead><tbody>{Object.entries(snapshot.keyStats).sort((a,b) => b[1].errors-a[1].errors).map(([key,s]) => <tr key={key} className="border-t border-border"><td className="py-2 font-mono">{keyLabel(key)}</td><td>{s.attempts}</td><td>{s.errors}</td><td>{Math.round((s.attempts-s.errors)/s.attempts*100)}%</td><td>{s.intervals ? `${Math.round(s.totalMs/s.intervals)} ms` : '—'}</td></tr>)}</tbody></table></div></details> : null}
      </div>
      {wpmSeries.length >= 2 ? (
        <div className="mt-10">
          <p className="mb-3 kicker">Average WPM over time</p>
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
      <p className="mt-5 text-xs text-muted">Alt+R repeats this passage. Tab moves between controls.</p>
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
