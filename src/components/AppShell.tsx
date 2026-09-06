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
    <div className="min-h-screen text-fg">
      <div
        className={cn(
          'border-b border-border transition-opacity duration-180',
          focused && 'pointer-events-none h-0 overflow-hidden border-transparent opacity-0',
        )}
      >
        <header className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-8">
          <Wordmark />
          <nav className="flex items-center gap-7 text-[13px] tracking-wide">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-muted no-underline transition-colors duration-180 hover:text-fg',
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
          <div className="flex items-center gap-0.5">
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
        </header>
      </div>
      <main className="mx-auto w-full max-w-6xl px-8 pb-20 pt-8">
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
        'inline-flex h-8 w-8 items-center justify-center text-muted transition-colors duration-180 hover:text-fg',
        pressed && 'text-fg',
      )}
    >
      {children}
    </button>
  )
}
