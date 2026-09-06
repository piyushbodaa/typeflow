import { useCallback, useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ResultsPanel } from '../components/ResultsPanel'
import { useTypingSession } from '../components/TypingSession'
import words from '../data/words.json'
import { lessonById, lessonStatus, nextLesson, PASS_ACCURACY } from '../data/lessons'
import { mulberry32 } from '../engine/generate'
import type { EngineSnapshot } from '../engine/types'
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

  const status = lesson ? lessonStatus(lesson.id, completed) : 'locked'
  const mode = useMemo(() => {
    if (!lesson) return null
    return lesson.build(mulberry32(Date.now() % 2147483647))
  }, [lesson])

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
    onComplete: lesson && status !== 'locked' ? onComplete : undefined,
    idleNote: 'Type the passage. Pass at 95% accuracy to unlock the next lesson.',
    header: lesson ? (
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
          lesson {String(lesson.order).padStart(2, '0')}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">{lesson.title}</h1>
        <p className="mt-2 text-sm text-muted">{lesson.instruction}</p>
      </div>
    ) : null,
  })

  if (!lesson || !mode) return <Navigate to="/lessons" replace />
  if (status === 'locked') {
    return (
      <div>
        <h1 className="text-2xl font-medium">This lesson is locked.</h1>
        <p className="mt-2 text-sm text-muted">Finish the previous one at 95% accuracy first.</p>
        <Link to="/lessons" className="mt-6 inline-block text-accent">
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
            <span className="text-accent">Passed. Accuracy {Math.round(session.snapshot.stats.accuracy)}%.</span>
          ) : (
            <span className="text-error">
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
            { label: 'All lessons', onClick: () => navigate('/lessons') },
          ]}
        />
      </>
    )
  }

  return session.view
}
