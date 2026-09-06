export function computeWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  return correctChars / 5 / (elapsedMs / 60000)
}

export function computeRawWpm(
  correct: number,
  incorrect: number,
  extra: number,
  elapsedMs: number,
): number {
  return computeWpm(correct + incorrect + extra, elapsedMs)
}

export function computeAccuracy(correct: number, incorrect: number, extra: number): number {
  const denom = correct + incorrect + extra
  if (denom === 0) return 100
  return (correct / denom) * 100
}

export function computeConsistency(series: number[]): number | null {
  if (series.length < 2) return null
  const mean = series.reduce((sum, n) => sum + n, 0) / series.length
  if (mean === 0) return 0
  const variance = series.reduce((sum, n) => sum + (n - mean) ** 2, 0) / series.length
  const std = Math.sqrt(variance)
  return Math.max(0, Math.min(100, 100 * (1 - std / mean)))
}
