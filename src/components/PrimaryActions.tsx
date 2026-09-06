import { Link } from 'react-router-dom'

export function PrimaryActions() {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
      <Link to="/test?seconds=60&go=1" className="btn btn-primary px-7 py-3.5 text-[16px] no-underline">
        Start test
        <span className="font-mono text-[11px] font-normal tracking-wide opacity-70">60s</span>
      </Link>
      <Link
        to="/lessons"
        className="text-[15px] font-medium text-fg no-underline hover:underline hover:underline-offset-4"
      >
        Lessons
        <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
          12 · 95%
        </span>
      </Link>
      <Link
        to="/history"
        className="text-[15px] font-medium text-fg no-underline hover:underline hover:underline-offset-4"
      >
        History
        <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
          Last 50
        </span>
      </Link>
    </div>
  )
}
