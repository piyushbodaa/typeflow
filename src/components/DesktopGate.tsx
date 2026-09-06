import { Monitor } from 'lucide-react'

export function DesktopGate() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg px-8 text-center text-fg">
      <div className="max-w-md">
        <Monitor size={20} strokeWidth={1.75} className="mx-auto text-muted" aria-hidden />
        <p className="mt-4 font-mono text-sm text-fg">typeflow</p>
        <h1 className="mt-5 text-2xl font-medium tracking-tight text-fg">
          Built for a physical keyboard. Open this on a laptop or desktop.
        </h1>
        <p className="mt-3 text-sm text-muted">Needs a viewport of 1024px or wider.</p>
      </div>
    </div>
  )
}
