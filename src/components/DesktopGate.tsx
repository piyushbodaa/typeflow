import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useSettings } from '../hooks/useTheme'

export function DesktopGate() {
  const { settings, toggleTheme } = useSettings()
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh w-full flex-col px-5 py-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-[1.5rem] italic leading-none tracking-tight">typeflow</p>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-11 w-11 items-center justify-center text-muted transition-colors duration-180 hover:text-fg"
          >
            {settings.theme === 'dark' ? (
              <Sun size={18} strokeWidth={1.6} />
            ) : (
              <Moon size={18} strokeWidth={1.6} />
            )}
          </button>
        </div>

        <div className="rule mt-5" />

        <h1 className="mt-8 font-display text-[2.15rem] italic leading-[0.95] tracking-[-0.02em]">
          Sit down. Type the next line.
        </h1>
        <p className="mt-5 text-[1.125rem] leading-7 text-fg">Built for a physical keyboard.</p>
        <p className="mt-2 text-[1.0625rem] leading-7 text-muted">
          The line waits on steel, not glass. Open this on a laptop or desktop.
        </p>

        <HubPeek />

        <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
          1024px or wider
        </p>

        <button
          type="button"
          className="btn mt-5 min-h-11 w-full"
          onClick={() => void copyLink()}
          aria-label={copied ? 'Link copied' : 'Copy link to this site'}
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <p className="sr-only" aria-live="polite">
          {copied ? 'Link copied' : ''}
        </p>
      </div>
    </div>
  )
}

function HubPeek() {
  return (
    <figure
      className="hub-peek mt-8 w-full"
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      <img
        src="/ribbon.jpg"
        alt=""
        width={640}
        height={280}
        className="hub-peek-ribbon h-44 w-full object-cover object-[42%_52%] sm:h-52"
      />
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Carbon ribbon · desk trainer
      </figcaption>
    </figure>
  )
}
