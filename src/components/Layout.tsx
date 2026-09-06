import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { Settings } from '../lib/storage'
import { Wordmark } from './Wordmark'

const links = [
  { to: '/test', label: 'practice' },
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
      <div
        className={cn(
          'transition-opacity duration-180',
          focused && 'pointer-events-none opacity-0',
        )}
      >
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-10 pt-7 pb-5">
          <div className="flex items-baseline gap-4">
            <Wordmark />
            <span className="font-sans text-sm text-muted">Find the current.</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-muted no-underline transition-colors duration-180 hover:text-ink',
                    isActive && 'text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <span className="h-3 w-px bg-line" aria-hidden />
            <button
              type="button"
              onClick={onToggleKeyboard}
              className={cn(
                'border-0 bg-transparent font-mono text-[11px] tracking-wide text-muted',
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
                'border-0 bg-transparent font-mono text-[11px] tracking-wide text-muted',
                settings.sound && 'text-accent',
              )}
              aria-pressed={settings.sound}
            >
              sound
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="border-0 bg-transparent font-mono text-[11px] tracking-wide text-muted"
              aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {settings.theme === 'dark' ? 'light' : 'dark'}
            </button>
          </nav>
        </header>
        <div className="current-rail mx-auto max-w-6xl" />
      </div>
      <main className="mx-auto w-full max-w-6xl px-10 pb-20 pt-10">
        <Outlet />
      </main>
    </div>
  )
}
