import { Link } from 'react-router-dom'

export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <Link
      to="/"
      className={
        size === 'lg'
          ? 'font-display text-5xl italic leading-none tracking-tight text-fg no-underline'
          : 'font-display text-[19px] italic leading-none tracking-tight text-fg no-underline'
      }
    >
      typeflow
    </Link>
  )
}
