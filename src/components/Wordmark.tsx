import { Link } from 'react-router-dom'

export function Wordmark() {
  return (
    <Link
      to="/"
      className="font-mono text-[15px] font-medium tracking-tight text-ink no-underline"
    >
      typeflow
    </Link>
  )
}
