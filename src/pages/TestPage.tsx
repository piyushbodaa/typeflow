import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ModePicker } from '../components/ModePicker'
import { PracticePlayer } from '../components/PracticePlayer'
import { buildPoetry, type Difficulty, type PreparedPractice } from '../lib/practice'
import type { TimedSeconds, WordCount } from '../engine/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
export type TextSource = 'poems' | 'words'
export function TestPage() {
  useDocumentTitle('Practice · typeflow')
  const [params, setParams] = useSearchParams()
  const benchmark = params.get('benchmark') === '1'
  const source: TextSource = !benchmark && params.get('source') === 'words' ? 'words' : 'poems'
  const wordCount = Number(params.get('words')), time = Number(params.get('seconds'))
  const count: WordCount | null = !benchmark && [10,25,50,100].includes(wordCount) ? wordCount as WordCount : null
  const seconds: TimedSeconds = benchmark ? 60 : [15,30,60,120].includes(time) ? time as TimedSeconds : 60
  const [difficulty, setDifficulty] = useState<Difficulty>('balanced')
  const [adaptive, setAdaptive] = useState(params.get('adaptive') === '1')
  const build = useCallback((seed: number): PreparedPractice => source === 'poems' ? buildPoetry(seed, { ...(count ? { count } : { seconds }), difficulty, adaptive, benchmark }) : { mode: count ? { kind:'words',count } : { kind:'timed', seconds }, passages: [], lineBreaks: [], remember: () => {}, targetKeys: [] }, [source, count, seconds, difficulty, adaptive, benchmark])
  const mode = count ? { kind: 'words' as const, count } : { kind: 'timed' as const, seconds }
  return <PracticePlayer key={params.toString()} title={benchmark ? 'Your steady benchmark.' : adaptive ? 'A poem for your next step.' : 'Make a little room for practice.'}
    kicker={benchmark ? 'Benchmark · 60 seconds' : 'Practice'} build={build} autoBegin={params.get('go') === '1'} forcedStyle={benchmark ? 'flow' : undefined}
    instruction={benchmark ? 'The same 60-second passage, in Flow mode, every time. Compare these runs to measure your progress under consistent conditions.' : 'Choose poetry or a word drill, set your pace, and begin when you are ready. Your mistakes will guide the next session.'}
    resultInfo={{ source: 'test', mode, textSource: source, difficulty: benchmark ? 'balanced' : difficulty, benchmark }}
    setup={benchmark ? null : <div className="space-y-5">
      <ModePicker mode={mode} source={source} onTimed={(s) => setParams({ seconds: String(s), source })} onWords={(n) => setParams({ words: String(n), source })} onSource={(s) => setParams(count ? { words: String(count), source: s } : { seconds: String(seconds), source:s })} />
      {source === 'poems' ? <div className="flex flex-wrap gap-5 text-sm"><label>Difficulty <select className="practice-select ml-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}><option value="gentle">Gentle</option><option value="balanced">Balanced</option><option value="challenging">Challenging</option></select></label><label className="flex items-center gap-2"><input type="checkbox" checked={adaptive} onChange={(e) => setAdaptive(e.target.checked)} /> Focus on my weak keys</label></div> : null}
    </div>} />
}
