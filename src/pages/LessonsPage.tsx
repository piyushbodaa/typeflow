import { Link } from 'react-router-dom'
import { LESSONS, lessonStatus } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { cn } from '../lib/cn'

export function LessonsPage() {
  const { completed } = useProgress()

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight">Lessons</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Twelve short drills, unlocked in order. Pass at 95% accuracy. The 1 minute test on the home
        page does not wait for these.
      </p>
      <ol className="mt-10 divide-y divide-line border-y border-line">
        {LESSONS.map((lesson) => {
          const status = lessonStatus(lesson.id, completed)
          const inner = (
            <div className="flex items-baseline justify-between gap-6 py-4">
              <div>
                <p className="font-mono text-xs text-muted">{String(lesson.order).padStart(2, '0')}</p>
                <h2 className={cn('mt-1 text-lg', status === 'locked' && 'text-muted')}>
                  {lesson.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{lesson.instruction}</p>
              </div>
              <span
                className={cn(
                  'font-mono text-xs uppercase tracking-wider',
                  status === 'done' && 'text-accent',
                  status === 'available' && 'text-ink',
                  status === 'locked' && 'text-muted',
                )}
              >
                {status}
              </span>
            </div>
          )
          if (status === 'locked') {
            return (
              <li key={lesson.id} className="opacity-60">
                {inner}
              </li>
            )
          }
          return (
            <li key={lesson.id}>
              <Link to={`/lessons/${lesson.id}`} className="block text-inherit no-underline">
                {inner}
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
