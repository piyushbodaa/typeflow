export function AboutPage() {
  return (
    <article className="max-w-xl text-[16px] leading-7">
      <p className="kicker">About</p>
      <h1 className="mt-3 text-2xl font-medium tracking-tight">A typing trainer for a desk.</h1>
      <p className="mt-6 text-muted">
        Typeflow is a desktop typing trainer for people who already type on phones and want real
        keyboard speed. It is built for a physical keyboard, which is why the layout refuses to
        shrink into a touch UI.
      </p>
      <p className="mt-4 text-muted">
        Words per minute uses the standard formula: (correct characters / 5) divided by minutes
        elapsed. Raw WPM counts incorrect and extra characters too. Accuracy is correct divided by
        correct + incorrect + extra.
      </p>
      <p className="mt-4 text-muted">
        There is no account and no server. Settings, lesson progress, and the last fifty results
        stay in this browser&apos;s localStorage. Close the tab and they are still here; clear the
        site data and they are gone.
      </p>
      <p className="mt-4 text-muted">
        The home page is a hub — last run, best run, a short trail of accuracy. The 1-minute test
        is one click away, and it never starts until you mean it.
      </p>
    </article>
  )
}
