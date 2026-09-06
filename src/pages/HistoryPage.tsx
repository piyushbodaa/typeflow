import { HistoryTable } from '../components/HistoryTable'
import { useHistory } from '../hooks/useHistory'

export function HistoryPage() {
  const { results } = useHistory()

  return (
    <div>
      <p className="kicker">Local only</p>
      <h1 className="mt-3 text-2xl font-medium tracking-tight">History</h1>
      <p className="mt-3 text-sm text-muted">Last 50 results, stored only in this browser.</p>
      <div className="mt-10">
        <HistoryTable results={results} />
      </div>
    </div>
  )
}
