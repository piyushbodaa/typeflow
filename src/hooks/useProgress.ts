import { useCallback, useState } from 'react'
import { loadProgress, saveProgress } from '../lib/storage'

export function useProgress() {
  const [completed, setCompleted] = useState<string[]>(() => loadProgress().completed)

  const markComplete = useCallback((lessonId: string) => {
    setCompleted((prev) => {
      if (prev.includes(lessonId)) return prev
      const next = [...prev, lessonId]
      saveProgress({ completed: next })
      return next
    })
  }, [])

  return { completed, markComplete }
}
