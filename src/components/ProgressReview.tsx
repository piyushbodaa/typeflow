import { useState } from 'react'
import { Link } from 'react-router-dom'
import { weeklyStats, resultGroup, keyLabel } from '../lib/coaching'
import type { TestResult } from '../lib/storage'
import { Sparkline } from './Sparkline'
export function ProgressReview({ results }: { results: TestResult[] }) {
  const week = weeklyStats(results)
  const benchmarks = results.filter((r) => r.benchmark).reverse()
  const delta = week.benchmarkWpm != null && week.previousWpm != null ? week.benchmarkWpm - week.previousWpm : null
  const groups = new Map<string, TestResult>()
  for (const r of results) {
    if ((r.firstAccuracy ?? 0) < 95 || r.durationMs < 10000) continue
    const name = resultGroup(r), old = groups.get(name)
    if (!old || r.wpm > old.wpm) groups.set(name,r)
  }
  const [now] = useState(() => Date.now())
  const span = 7 * 86400000
  const accuracyForKey = (rows: TestResult[], key: string) => {
    let errors = 0, attempts = 0
    for (const r of rows) { const stats = r.keyStats?.[key]; if (stats) { errors += stats.errors; attempts += stats.attempts } }
    return attempts >= 3 ? (attempts-errors)/attempts*100 : null
  }
  return <section className="mt-10" aria-label="Learning progress">
    <div className="rule" /><div className="mt-6 flex flex-wrap items-baseline justify-between gap-3"><h2 className="font-display text-3xl italic">Practice that adds up.</h2><Link className="practice-link text-sm" to="/test?benchmark=1">Take a 60-second benchmark →</Link></div>
    <p className="mt-3 text-sm text-muted">Last seven days, using the results saved in this browser. Benchmarks compare the same passage, duration, and Flow mode.</p>
    <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">{[['Practice',`${week.minutes} min`],['Sessions',String(week.sessions)],['First-attempt accuracy',week.accuracy == null ? '—' : `${Math.round(week.accuracy)}%`],['Benchmark average',week.benchmarkWpm == null ? '—' : `${Math.round(week.benchmarkWpm)} WPM`]].map(([label,value]) => <div key={label}><p className="kicker">{label}</p><p className="mt-3 font-mono text-2xl">{value}</p></div>)}</div>
    {delta != null ? <p className="mt-5 text-sm text-muted">Benchmark average {delta >= 0 ? '+' : ''}{Math.round(delta)} WPM compared with the previous seven days.</p> : <p className="mt-5 text-sm text-muted">Take benchmarks in two different weeks to see a comparable speed trend.</p>}
    {benchmarks.length >= 2 ? <div className="mt-6"><p className="kicker mb-3">Benchmark WPM · oldest to newest</p><Sparkline series={benchmarks.map((r) => r.wpm)} /></div> : null}
    {week.keys.length ? <div className="coaching-card mt-7"><p className="kicker">Keys to give some attention</p><div className="mt-4 flex flex-wrap gap-5">{week.keys.map((key) => {
      const current = accuracyForKey(results.filter((r) => r.at >= now-span),key), previous = accuracyForKey(results.filter((r) => r.at < now-span && r.at >= now-2*span),key)
      return <div key={key}><span className="font-mono text-xl">{keyLabel(key)}</span><p className="mt-1 text-xs text-muted">{current != null ? `${Math.round(current)}% accuracy this week` : 'Gathering recent attempts'}{current != null && previous != null ? ` · ${current-previous >= 0 ? '+' : ''}${Math.round(current-previous)} points` : ''}</p></div>
    })}</div><Link to="/test?adaptive=1" className="practice-link mt-4 inline-block text-sm">Choose a poem for these keys →</Link></div> : null}
    <details className="mt-7 border-t border-border pt-5"><summary className="cursor-pointer text-sm">Personal records by exercise</summary><p className="mt-3 text-xs text-muted">Only runs of at least 10 seconds with 95% first-attempt accuracy qualify. Legacy runs without first-attempt data are excluded.</p>{groups.size ? <ul className="mt-4 space-y-3">{[...groups.entries()].map(([label,r]) => <li key={label} className="flex flex-wrap justify-between gap-2 text-sm"><span className="text-muted">{label}</span><span className="font-mono">{Math.round(r.wpm)} WPM · {Math.round(r.firstAccuracy!)}%</span></li>)}</ul> : <p className="mt-4 text-sm text-muted">Your next accurate session can set your first record.</p>}</details>
  </section>
}
