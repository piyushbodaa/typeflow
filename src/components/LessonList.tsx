import { Check, ChevronRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LESSONS, lessonStatus, type LessonStatus } from '../data/lessons'
import { cn } from '../lib/cn'

export function LessonList({ completed }: { completed: string[] }) {
  return (
    <ol className="panel overflow-hidden">
      {LESSONS.map((lesson) => {
        const status = lessonStatus(lesson.id, completed)
        const inner = (
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="w-8 shrink-0 font-mono text-[12px] tabular-nums text-muted">
              {String(lesson.order).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <h2
                className={cn(
                  'text-[15px] font-medium tracking-tight',
                  status === 'locked' ? 'text-muted' : 'text-fg',
                )}
              >
                {lesson.title}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">{lesson.instruction}</p>
            </div>
            <StatusMark status={status} />
          </div>
        )
        if (status === 'locked') {
          return (
            <li key={lesson.id} className="border-b border-border last:border-b-0">
              <div className="opacity-60">{inner}</div>
            </li>
          )
        }
        return (
          <li key={lesson.id} className="border-b border-border last:border-b-0">
            <Link
              to={`/lessons/${lesson.id}`}
              className="block text-inherit no-underline transition-colors duration-180 hover:bg-bg"
            >
              {inner}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

function StatusMark({ status }: { status: LessonStatus }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-success">
        <Check size={14} strokeWidth={2} aria-hidden />
        Passed
      </span>
    )
  }
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg">
        Open
        <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted">
      <Lock size={13} strokeWidth={1.75} aria-hidden />
      Locked
    </span>
  )
}
