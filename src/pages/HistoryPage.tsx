import { HistoryTable } from '../components/HistoryTable'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../hooks/useHistory'

export function HistoryPage() {
  useDocumentTitle('History · typeflow')
  const { results } = useHistory()

  return (
    <div>
      <div className="rule" />
      <p className="kicker mt-8">Local only</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] italic leading-[1.02] tracking-tight">
        History
      </h1>
      <p className="mt-4 text-[15px] text-muted">Last 50 results, stored only in this browser.</p>
      <div className="mt-10">
        <HistoryTable results={results} />
      </div>
      <div className="rule mt-12" />
    </div>
  )
}
