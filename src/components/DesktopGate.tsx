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
      <div className="mx-auto flex min-h-full max-w-md flex-col px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-[22px] italic leading-none tracking-tight">typeflow</p>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-8 w-8 items-center justify-center text-muted transition-colors duration-180 hover:text-fg"
          >
            {settings.theme === 'dark' ? (
              <Sun size={16} strokeWidth={1.6} />
            ) : (
              <Moon size={16} strokeWidth={1.6} />
            )}
          </button>
        </div>

        <div className="rule mt-6" />

        <HubPeek />

        <h1 className="mt-8 font-display text-[2rem] italic leading-[1.05] tracking-tight">
          Built for a physical keyboard.
        </h1>
        <p className="mt-4 text-[16px] leading-7 text-muted">
          The line waits on steel, not glass. Open this on a laptop or desktop.
        </p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          1024px or wider
        </p>

        <button
          type="button"
          className="btn mt-8 self-start"
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
    <div
      className="hub-peek mt-8 border border-border px-4 py-5"
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      <p className="kicker">Desktop trainer</p>
      <p className="mt-3 font-display text-[1.55rem] italic leading-[0.92] tracking-tight text-fg">
        Sit down. Type the next line.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]">
        <span className="bg-fg px-2.5 py-1 text-bg">Start test</span>
        <span className="text-fg">Lessons</span>
        <span className="text-fg">History</span>
      </div>
      <div className="mt-5 flex items-end gap-4">
        <img
          src="/ribbon.jpg"
          alt=""
          width={96}
          height={66}
          className="hub-peek-ribbon h-[4.15rem] w-[6rem] object-cover object-[42%_52%]"
        />
        <div className="flex gap-6 font-mono text-sm tabular-nums">
          <div>
            <p className="kicker">Last</p>
            <p className="mt-1 text-fg">—</p>
          </div>
          <div>
            <p className="kicker">Acc</p>
            <p className="mt-1 text-fg">—</p>
          </div>
        </div>
      </div>
    </div>
  )
}
