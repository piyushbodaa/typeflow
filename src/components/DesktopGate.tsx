export function DesktopGate() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas px-8 text-center">
      <div className="max-w-md">
        <p className="inline-flex items-center gap-2 font-mono text-sm text-ink">
          <span className="h-3.5 w-[2px] bg-accent" aria-hidden />
          typeflow
        </p>
        <div className="current-rail mx-auto mt-6 max-w-xs" />
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-ink">
          Typeflow is built for a physical keyboard. Open this on a laptop or desktop.
        </h1>
        <p className="mt-3 text-sm text-muted">Needs a viewport of 1024px or wider.</p>
      </div>
    </div>
  )
}
