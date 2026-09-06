import { Link } from 'react-router-dom'
import { lessonById } from '../data/lessons'
import { formatWhen, modeLabel } from '../lib/format'
import type { TestResult } from '../lib/storage'

export function HistoryTable({ results }: { results: TestResult[] }) {
  if (results.length === 0) {
    return (
      <p className="max-w-md border-t border-border pt-6 text-sm text-muted">
        No tests yet.{' '}
        <Link to="/test?seconds=60&go=1" className="text-fg underline underline-offset-4">
          Start test
        </Link>
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left font-mono text-sm">
        <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
          <tr>
            <th className="relative w-[22%] pb-3 font-normal">
              <span className="absolute -top-px left-0 h-0.5 w-8 bg-accent" aria-hidden />
              When
            </th>
            <th className="pb-3 font-normal">Mode</th>
            <th className="w-24 pb-3 font-normal">WPM</th>
            <th className="w-24 pb-3 font-normal">Raw</th>
            <th className="w-24 pb-3 font-normal">Acc</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr key={row.id} className="border-t border-border">
              <td className="py-3.5 text-muted">{formatWhen(row.at)}</td>
              <td className="py-3.5 font-sans text-fg">
                {modeLabel(row.mode, row.lessonId ? lessonById(row.lessonId)?.title : undefined)}
              </td>
              <td className="py-3.5 tabular-nums text-fg">{Math.round(row.wpm)}</td>
              <td className="py-3.5 tabular-nums text-muted">{Math.round(row.rawWpm)}</td>
              <td className="py-3.5 tabular-nums text-muted">{Math.round(row.accuracy)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
