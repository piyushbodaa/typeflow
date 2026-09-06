import type { LiveStats } from '../engine/types'

export function LiveHud({ stats }: { stats: LiveStats }) {
  const remaining =
    stats.remainingMs != null
      ? `${Math.ceil(stats.remainingMs / 1000)}s`
      : stats.remainingWords != null
        ? `${stats.remainingWords} words`
        : ''

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm tabular-nums" aria-live="polite">
      <Stat label="WPM" value={Math.round(stats.wpm).toString()} />
      <Stat label="Raw" value={Math.round(stats.rawWpm).toString()} />
      <Stat label="Acc" value={`${Math.round(stats.accuracy)}%`} />
      {remaining ? <Stat label="Left" value={remaining} /> : null}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  )
}
