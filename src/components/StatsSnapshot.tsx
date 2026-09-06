import type { DashboardSummary } from '../lib/summary'
import { cn } from '../lib/cn'
import { Sparkline } from './Sparkline'

export function StatsSnapshot({ snap }: { snap: DashboardSummary }) {
  return (
    <section aria-label="Snapshot stats" className="panel grid grid-cols-4 overflow-hidden">
      <Stat label="Last WPM" value={fmt(snap.lastWpm)} />
      <Stat label="Best WPM" value={fmt(snap.bestWpm)} />
      <div className="border-r border-border px-5 py-5 last:border-r-0">
        <p className="kicker">Accuracy</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="font-mono text-2xl tabular-nums text-fg">
            {snap.lastAccuracy == null ? '—' : `${Math.round(snap.lastAccuracy)}%`}
          </p>
          {snap.accuracySeries.length >= 2 ? (
            <Sparkline series={snap.accuracySeries} compact />
          ) : null}
        </div>
      </div>
      <div className="px-5 py-5">
        <p className="kicker">Lessons</p>
        <p className="mt-3 font-mono text-2xl tabular-nums text-fg">
          {snap.lessonsDone}
          <span className="text-sm text-muted"> / {snap.lessonsTotal}</span>
        </p>
        <div className="mt-3 h-1 rounded-sm bg-border" role="progressbar" aria-valuemin={0} aria-valuemax={snap.lessonsTotal} aria-valuenow={snap.lessonsDone} aria-label="Lessons completed">
          <div
            className="h-1 rounded-sm bg-fg transition-[width] duration-180"
            style={{
              width: `${snap.lessonsTotal ? (snap.lessonsDone / snap.lessonsTotal) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </section>
  )
}

function fmt(n: number | null) {
  return n == null ? '—' : String(Math.round(n))
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn('border-r border-border px-5 py-5 last:border-r-0')}>
      <p className="kicker">{label}</p>
      <p className="mt-3 font-mono text-2xl tabular-nums text-fg">{value}</p>
    </div>
  )
}
