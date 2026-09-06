import { Link } from 'react-router-dom'
import { LESSONS, lessonStatus } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { cn } from '../lib/cn'

export function LessonsPage() {
  const { completed } = useProgress()

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">twelve drills</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">Lessons</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        Unlocked in order. Pass at 95% accuracy. The 1-minute test does not wait for these.
      </p>
      <ol className="mt-10 border border-line">
        {LESSONS.map((lesson) => {
          const status = lessonStatus(lesson.id, completed)
          const inner = (
            <div className="flex items-baseline justify-between gap-6 px-5 py-4">
              <div>
                <p className="font-mono text-[11px] text-muted">
                  {String(lesson.order).padStart(2, '0')}
                </p>
                <h2 className={cn('mt-1 text-lg tracking-tight', status === 'locked' && 'text-muted')}>
                  {lesson.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{lesson.instruction}</p>
              </div>
              <span
                className={cn(
                  'font-mono text-[11px] uppercase tracking-wider',
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
              <li key={lesson.id} className="border-b border-line opacity-55 last:border-b-0">
                {inner}
              </li>
            )
          }
          return (
            <li key={lesson.id} className="border-b border-line last:border-b-0">
              <Link
                to={`/lessons/${lesson.id}`}
                className="block text-inherit no-underline transition-colors duration-180 hover:bg-elev"
              >
                {inner}
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
