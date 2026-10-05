import { useCallback, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PracticePlayer } from '../components/PracticePlayer'
import { lessonById, nextLesson, PASS_ACCURACY } from '../data/lessons'
import { buildLesson, type PassageLength } from '../lib/practice'
import { useProgress } from '../hooks/useProgress'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { EngineSnapshot } from '../engine/types'
export function LessonPlayerPage() {
  const { id = '' } = useParams(), lesson = lessonById(id), navigate = useNavigate(), { markComplete } = useProgress()
  const [length, setLength] = useState<PassageLength>('medium')
  useDocumentTitle(`${lesson?.title ?? 'Lessons'} · typeflow`)
  const build = useCallback((seed: number) => buildLesson(seed,id,length), [id,length])
  const onResult = useCallback((snapshot: EngineSnapshot) => { if (snapshot.stats.firstAccuracy >= PASS_ACCURACY) markComplete(id) }, [id,markComplete])
  if (!lesson) return <Navigate to="/lessons" replace />
  const next = nextLesson(id)
  return <PracticePlayer key={id} title={lesson.title} kicker={`Lesson ${String(lesson.order).padStart(2,'0')}`} instruction={`${lesson.instruction} All lessons are open; pass this one at 95% first-attempt accuracy.`}
    build={build} resultInfo={{ source: 'lesson', lessonId:id, textSource: lesson.order >= 6 && lesson.order !== 8 ? 'poems' : 'drill', difficulty: length === 'short' ? 'gentle' : length === 'long' ? 'challenging' : 'balanced' }}
    onResult={onResult} passAccuracy={PASS_ACCURACY} exitTo="/lessons"
    nextAction={next ? { label: 'Next lesson', onClick: () => navigate(`/lessons/${next.id}`) } : { label:'Start daily practice', onClick: () => navigate('/daily') }}
    setup={lesson.order >= 6 && lesson.order !== 8 && lesson.order !== 12 ? <label className="text-sm text-muted">Passage length <select className="practice-select ml-3" value={length} onChange={(e) => setLength(e.target.value as PassageLength)}><option value="short">Short · up to 40 words</option><option value="medium">Medium · 41–90 words</option><option value="long">Long · over 90 words</option></select><p className="mt-2 text-xs">We choose the closest available length in this lesson’s poem collection.</p></label> : null} />
}
