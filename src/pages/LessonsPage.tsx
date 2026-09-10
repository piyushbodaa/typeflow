import { LessonList } from '../components/LessonList'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProgress } from '../hooks/useProgress'

export function LessonsPage() {
  useDocumentTitle('Lessons · typeflow')
  const { completed } = useProgress()

  return (
    <div>
      <div className="rule" />
      <p className="kicker mt-8">Twelve drills</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] italic leading-[1.02] tracking-tight">
        Lessons
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted">
        All lessons are open. Hit 95% accuracy to mark one Passed — order is optional. The 1-minute
        test does not wait for these.
      </p>
      <div className="mt-10 max-w-3xl">
        <LessonList completed={completed} />
      </div>
      <div className="rule mt-4 max-w-3xl" />
    </div>
  )
}
