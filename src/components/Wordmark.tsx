import { Link } from 'react-router-dom'

export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <Link
      to="/"
      className={
        size === 'lg'
          ? 'inline-flex items-center gap-3 font-mono text-2xl font-medium tracking-tight text-ink no-underline'
          : 'inline-flex items-center gap-2 font-mono text-[15px] font-medium tracking-tight text-ink no-underline'
      }
    >
      <span
        className={size === 'lg' ? 'h-5 w-[2px] bg-accent' : 'h-3.5 w-[2px] bg-accent'}
        aria-hidden
      />
      typeflow
    </Link>
  )
}
