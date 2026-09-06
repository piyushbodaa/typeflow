import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { Settings } from '../lib/storage'
import { Wordmark } from './Wordmark'

const links = [
  { to: '/test', label: 'test' },
  { to: '/lessons', label: 'lessons' },
  { to: '/history', label: 'history' },
  { to: '/about', label: 'about' },
]

interface LayoutProps {
  focused: boolean
  settings: Settings
  onToggleTheme: () => void
  onToggleKeyboard: () => void
  onToggleSound: () => void
}

export function Layout({
  focused,
  settings,
  onToggleTheme,
  onToggleKeyboard,
  onToggleSound,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header
        className={cn(
          'mx-auto flex w-full max-w-5xl items-center justify-between px-8 pt-6 pb-4 transition-opacity duration-200',
          focused && 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex items-baseline gap-4">
          <Wordmark />
          <span className="hidden text-sm text-muted md:inline">Get into flow. Type faster.</span>
        </div>
        <nav className="flex items-center gap-5 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn('text-muted no-underline transition-colors duration-150 hover:text-ink', isActive && 'text-ink')
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={onToggleKeyboard}
            className={cn(
              'rounded-sm border border-line bg-transparent px-2 py-1 font-mono text-[11px] text-muted',
              settings.showKeyboard && 'text-accent',
            )}
            aria-pressed={settings.showKeyboard}
          >
            keys
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            className={cn(
              'rounded-sm border border-line bg-transparent px-2 py-1 font-mono text-[11px] text-muted',
              settings.sound && 'text-accent',
            )}
            aria-pressed={settings.sound}
          >
            sound
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-sm border border-line bg-transparent px-2 py-1 font-mono text-[11px] text-muted"
            aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {settings.theme === 'dark' ? 'light' : 'dark'}
          </button>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-8 pb-16 pt-6">
        <Outlet />
      </main>
    </div>
  )
}
