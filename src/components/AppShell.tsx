import { Keyboard, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { Settings } from '../lib/storage'
import { Wordmark } from './Wordmark'

const links = [
  { to: '/test', label: 'Test' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
]

interface AppShellProps {
  focused: boolean
  settings: Settings
  onToggleTheme: () => void
  onToggleKeyboard: () => void
  onToggleSound: () => void
}

export function AppShell({
  focused,
  settings,
  onToggleTheme,
  onToggleKeyboard,
  onToggleSound,
}: AppShellProps) {
  return (
    <div className="min-h-dvh text-fg">
      <div
        className={cn(
          'border-b border-border transition-opacity duration-180',
          focused && 'pointer-events-none h-0 overflow-hidden border-transparent opacity-0',
        )}
      >
        <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-5 py-3 lg:h-14 lg:flex-nowrap lg:justify-between lg:px-8 lg:py-0">
          <Wordmark />
          <div className="ml-auto flex items-center lg:order-last lg:ml-0">
            <IconToggle
              label={settings.showKeyboard ? 'Hide on-screen keyboard' : 'Show on-screen keyboard'}
              pressed={settings.showKeyboard}
              onClick={onToggleKeyboard}
            >
              <Keyboard size={16} strokeWidth={1.6} />
            </IconToggle>
            <IconToggle
              label={settings.sound ? 'Mute key sound' : 'Enable key sound'}
              pressed={settings.sound}
              onClick={onToggleSound}
            >
              {settings.sound ? (
                <Volume2 size={16} strokeWidth={1.6} />
              ) : (
                <VolumeX size={16} strokeWidth={1.6} />
              )}
            </IconToggle>
            <IconToggle
              label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={onToggleTheme}
            >
              {settings.theme === 'dark' ? (
                <Sun size={16} strokeWidth={1.6} />
              ) : (
                <Moon size={16} strokeWidth={1.6} />
              )}
            </IconToggle>
          </div>
          <nav className="order-last flex w-full items-center justify-between gap-2 text-[13px] tracking-wide lg:order-none lg:w-auto lg:justify-center lg:gap-7">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex min-h-11 items-center text-muted no-underline transition-colors duration-180 hover:text-fg lg:min-h-0',
                    isActive && 'text-fg',
                  )
                }
              >
                {({ isActive }) => (
                  <span className={cn('pb-px', isActive && 'shadow-[inset_0_-2px_0_0_var(--color-accent)]')}>
                    {link.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </header>
      </div>
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 lg:px-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  )
}

function IconToggle({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center text-muted transition-colors duration-180 hover:text-fg lg:h-8 lg:w-8',
        pressed && 'text-fg',
      )}
    >
      {children}
    </button>
  )
}
