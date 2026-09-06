import { Link } from 'react-router-dom'
import { lessonById } from '../data/lessons'
import { useHistory } from '../hooks/useHistory'
import { formatWhen, modeLabel } from '../lib/format'

export function HistoryPage() {
  const { results } = useHistory()

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight">History</h1>
      <p className="mt-2 text-sm text-muted">Last 50 results, stored only in this browser.</p>
      {results.length === 0 ? (
        <p className="mt-10 max-w-md text-sm text-muted">
          No tests yet. Run the{' '}
          <Link to="/" className="text-accent">
            1 minute test
          </Link>{' '}
          and it will show up here.
        </p>
      ) : (
        <table className="mt-10 w-full text-left font-mono text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="pb-3 font-normal">when</th>
              <th className="pb-3 font-normal">mode</th>
              <th className="pb-3 font-normal">wpm</th>
              <th className="pb-3 font-normal">raw</th>
              <th className="pb-3 font-normal">acc</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-3 text-muted">{formatWhen(row.at)}</td>
                <td className="py-3">
                  {modeLabel(row.mode, row.lessonId ? lessonById(row.lessonId)?.title : undefined)}
                </td>
                <td className="py-3 text-accent">{Math.round(row.wpm)}</td>
                <td className="py-3">{Math.round(row.rawWpm)}</td>
                <td className="py-3">{Math.round(row.accuracy)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
