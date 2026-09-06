export function AboutPage() {
  return (
    <article className="max-w-xl text-[17px] leading-7 text-ink">
      <h1 className="text-3xl font-medium tracking-tight">About</h1>
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
        The one-minute test on the home page is the product. Lessons exist to build the keys
        underneath it, not to turn this into a classroom.
      </p>
    </article>
  )
}
