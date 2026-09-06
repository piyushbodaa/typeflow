import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ResultsPanel } from '../components/ResultsPanel'
import { useTypingSession } from '../components/TypingSession'
import words from '../data/words.json'
import { lessonById, lessonStatus, nextLesson, PASS_ACCURACY } from '../data/lessons'
import { mulberry32 } from '../engine/generate'
import type { EngineSnapshot } from '../engine/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../hooks/useHistory'
import { useProgress } from '../hooks/useProgress'
import { snapshotToResult } from '../lib/result'
import { useSettings } from '../hooks/useTheme'

export function LessonPlayerPage() {
  const { settings } = useSettings()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const lesson = lessonById(id)
  const { completed, markComplete } = useProgress()
  const { record } = useHistory()
  const [armed, setArmed] = useState(false)
  const beginRef = useRef<HTMLButtonElement>(null)

  useDocumentTitle(lesson ? `${lesson.title} · typeflow` : 'Lessons · typeflow')

  const status = lesson ? lessonStatus(lesson.id, completed) : 'locked'
  const mode = useMemo(() => {
    if (!lesson) return null
    return lesson.build(mulberry32(Date.now() % 2147483647))
  }, [lesson])

  useEffect(() => {
    setArmed(false)
  }, [id])

  useEffect(() => {
    if (!armed && status !== 'locked') beginRef.current?.focus()
  }, [armed, status])

  const onComplete = useCallback(
    (snapshot: EngineSnapshot) => {
      if (!lesson || !mode) return
      record(snapshotToResult(snapshot, 'lesson', mode, lesson.id))
      if (snapshot.stats.accuracy >= PASS_ACCURACY) markComplete(lesson.id)
    },
    [lesson, markComplete, mode, record],
  )

  const session = useTypingSession({
    config: { mode: mode ?? { kind: 'custom', words: ['the'] }, wordBank: words },
    sound: settings.sound,
    showKeyboard: settings.showKeyboard,
    armed: armed && status !== 'locked',
    onComplete: lesson && status !== 'locked' ? onComplete : undefined,
    idleNote: 'Type the passage. Pass at 95% accuracy to unlock the next lesson.',
    header: lesson ? (
      <div className="mb-10">
        <div className="rule mb-8" />
        <p className="kicker">Lesson {String(lesson.order).padStart(2, '0')}</p>
        <h1 className="mt-3 font-display text-[2.1rem] italic leading-tight tracking-tight">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{lesson.instruction}</p>
      </div>
    ) : null,
  })

  if (!lesson || !mode) return <Navigate to="/lessons" replace />
  if (status === 'locked') {
    return (
      <div className="max-w-lg">
        <div className="rule" />
        <h1 className="mt-8 font-display text-[2.1rem] italic tracking-tight">This lesson is locked.</h1>
        <p className="mt-3 text-sm text-muted">Finish the previous one at 95% accuracy first.</p>
        <Link to="/lessons" className="btn mt-8 no-underline">
          Back to lessons
        </Link>
      </div>
    )
  }

  const passed = session.snapshot.stats.accuracy >= PASS_ACCURACY
  const next = nextLesson(lesson.id)

  if (session.snapshot.status === 'finished') {
    return (
      <>
        {session.view}
        <p className="mb-6 font-mono text-sm">
          {passed ? (
            <span className="text-fg">
              Passed. Accuracy {Math.round(session.snapshot.stats.accuracy)}%.
            </span>
          ) : (
            <span className="text-danger">
              Need {PASS_ACCURACY}% to pass. You hit {Math.round(session.snapshot.stats.accuracy)}%.
            </span>
          )}
        </p>
        <ResultsPanel
          snapshot={session.snapshot}
          copyLabel={lesson.title}
          actions={[
            ...(passed && next
              ? [
                  {
                    label: 'Next lesson',
                    onClick: () => navigate(`/lessons/${next.id}`),
                    primary: true,
                  },
                ]
              : []),
            { label: 'Retry', onClick: session.restart, primary: !passed },
            { label: 'Back to hub', onClick: () => navigate('/') },
            { label: 'All lessons', onClick: () => navigate('/lessons') },
          ]}
        />
      </>
    )
  }

  if (!armed) {
    return (
      <div>
        <div className="rule" />
        <p className="kicker mt-8">Lesson {String(lesson.order).padStart(2, '0')}</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.2rem)] italic leading-[1.02] tracking-tight">
          {lesson.title}
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-muted">{lesson.instruction}</p>
        <p className="mt-6 text-sm text-muted">Pass at 95% accuracy. The clock waits on you.</p>
        <button
          ref={beginRef}
          type="button"
          className="btn btn-primary mt-8"
          onClick={() => setArmed(true)}
        >
          Begin lesson
        </button>
      </div>
    )
  }

  return session.view
}
