import type { DashboardSummary } from '../lib/summary'

export function StatsSnapshot({ snap }: { snap: DashboardSummary }) {
  return (
    <section aria-label="Snapshot stats">
      <div className="rule" />
      <div className="grid grid-cols-2 gap-x-10 gap-y-7 pt-6">
        <Stat label="Last WPM" value={fmt(snap.lastWpm)} />
        <Stat label="Best WPM" value={fmt(snap.bestWpm)} />
        <div>
          <p className="kicker">Accuracy</p>
          <p className="mt-3 font-mono text-[1.75rem] tabular-nums leading-none text-fg">
            {snap.lastAccuracy == null ? '—' : `${Math.round(snap.lastAccuracy)}%`}
          </p>
        </div>
        <div>
          <p className="kicker">Lessons</p>
          <p className="mt-3 font-mono text-[1.75rem] tabular-nums leading-none text-fg">
            {String(snap.lessonsDone).padStart(2, '0')}
            <span className="text-sm text-muted"> / {snap.lessonsTotal}</span>
          </p>
          <div
            className="mt-3 h-px bg-border"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={snap.lessonsTotal}
            aria-valuenow={snap.lessonsDone}
            aria-label="Lessons completed"
          >
            <div
              className="h-px bg-fg transition-[width] duration-180"
              style={{
                width: `${snap.lessonsTotal ? (snap.lessonsDone / snap.lessonsTotal) * 100 : 0}%`,
              }}
            />
          </div>
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
    <div>
      <p className="kicker">{label}</p>
      <p className="mt-3 font-mono text-[1.75rem] tabular-nums leading-none text-fg">{value}</p>
    </div>
  )
}
