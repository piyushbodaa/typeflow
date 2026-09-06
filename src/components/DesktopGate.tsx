export function DesktopGate() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg px-8 text-center text-fg">
      <div className="max-w-md">
        <div className="rule mx-auto w-40" />
        <p className="mt-8 font-display text-2xl italic">typeflow</p>
        <h1 className="mt-5 font-display text-[2rem] leading-tight tracking-tight text-fg">
          Built for a physical keyboard. Open this on a laptop or desktop.
        </h1>
        <p className="mt-4 text-sm text-muted">Needs a viewport of 1024px or wider.</p>
      </div>
    </div>
  )
}
