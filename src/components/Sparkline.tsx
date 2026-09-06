export function Sparkline({ series, compact = false }: { series: number[]; compact?: boolean }) {
  const width = compact ? 112 : 280
  const height = compact ? 36 : 56
  if (series.length < 2) {
    return compact ? (
      <span className="font-mono text-xs text-muted">n/a</span>
    ) : (
      <p className="text-sm text-muted">Not enough samples for a pace curve.</p>
    )
  }
  const max = Math.max(...series, 1)
  const min = Math.min(...series, 0)
  const span = Math.max(max - min, 1)
  const points = series
    .map((value, i) => {
      const x = (i / (series.length - 1)) * width
      const y = height - ((value - min) / span) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="text-muted"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  )
}
