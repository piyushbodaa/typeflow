import { LessonList } from '../components/LessonList'
import { useProgress } from '../hooks/useProgress'

export function LessonsPage() {
  const { completed } = useProgress()

  return (
    <div>
      <p className="kicker">Twelve drills</p>
      <h1 className="mt-3 text-2xl font-medium tracking-tight">Lessons</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        Unlocked in order. Pass at 95% accuracy. The 1-minute test does not wait for these.
      </p>
      <div className="mt-10">
        <LessonList completed={completed} />
      </div>
    </div>
  )
}
