import { useCallback, useState } from 'react'
import { loadResults, pushResult, type TestResult } from '../lib/storage'

export function useHistory() {
  const [results, setResults] = useState<TestResult[]>(() => loadResults())

  const record = useCallback((result: TestResult) => {
    setResults(pushResult(result))
  }, [])

  return { results, record }
}
