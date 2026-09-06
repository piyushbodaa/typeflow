import type { LiveStats } from '../engine/types'

export function StatsBar({ stats }: { stats: LiveStats }) {
  const remaining =
    stats.remainingMs != null
      ? `${Math.ceil(stats.remainingMs / 1000)}s`
      : stats.remainingWords != null
        ? `${stats.remainingWords} words`
        : ''

  return (
    <div className="flex flex-wrap gap-x-10 gap-y-2 font-mono text-sm tabular-nums">
      <Stat label="wpm" value={Math.round(stats.wpm).toString()} hot />
      <Stat label="raw" value={Math.round(stats.rawWpm).toString()} />
      <Stat label="acc" value={`${Math.round(stats.accuracy)}%`} />
      {remaining ? <Stat label="left" value={remaining} /> : null}
    </div>
  )
}

function Stat({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
      <span className={hot ? 'text-accent' : 'text-ink'}>{value}</span>
    </div>
  )
}
