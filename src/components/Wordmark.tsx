import { Link } from 'react-router-dom'

export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <Link
      to="/"
      className={
        size === 'lg'
          ? 'font-mono text-2xl font-medium tracking-tight text-fg no-underline'
          : 'font-mono text-[15px] font-medium tracking-tight text-fg no-underline'
      }
    >
      typeflow
    </Link>
  )
}
