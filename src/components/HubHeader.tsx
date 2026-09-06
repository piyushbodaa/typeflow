export function HubHeader() {
  return (
    <header>
      <div className="rule" />
      <p className="kicker mt-7">Typing trainer</p>
      <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.6rem,6vw,5rem)] italic leading-[0.92] tracking-[-0.025em] text-fg">
        Sit down. Type the next line.
      </h1>
      <p className="mt-5 max-w-[32rem] text-[17px] leading-7 text-muted">
        Timed tests, twelve sequential lessons, and a local record. The clock waits until you begin.
      </p>
    </header>
  )
}
