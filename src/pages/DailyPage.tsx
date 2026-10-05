import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { PracticePlayer } from '../components/PracticePlayer'
import { useSettings } from '../hooks/useTheme'
import { buildPoetry } from '../lib/practice'
import type { EngineSnapshot } from '../engine/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { recommendation, weakestKeys } from '../lib/coaching'
import { loadResults } from '../lib/storage'
export function DailyPage() {
  useDocumentTitle('Daily practice · typeflow')
  const { settings, update } = useSettings()
  const [step, setStep] = useState(-1), [minutes, setMinutes] = useState(settings.dailyMinutes)
  const [results, setResults] = useState<EngineSnapshot[]>([])
  const titles = ['Find your rhythm.', 'Give your weak keys some care.', 'Finish with a poem.']
  const stages = ['Warm-up', 'Focused practice', 'Poetry flow']
  const remaining = Math.max(120, (minutes - 1) * 60)
  const duration = step === 0 ? 60 : step === 1 ? Math.floor(remaining / 2) : Math.ceil(remaining / 2)
  const build = useCallback((seed: number) => buildPoetry(seed, { seconds: duration, difficulty: step === 0 ? 'gentle' : 'balanced', adaptive: step === 1 }), [duration,step])
  const remember = useCallback((snapshot: EngineSnapshot) => setResults((old) => [...old.slice(0,step),snapshot]), [step])
  if (step === 3) return <div className="max-w-3xl"><div className="rule" /><p className="kicker mt-8">Daily practice · complete</p><h1 className="mt-4 font-display text-5xl italic">A little better than yesterday.</h1>
    <p className="mt-5 text-muted">You completed {minutes} minutes of warm-up, focused practice, and poetry.</p>
    <div className="coaching-card mt-8"><p className="kicker">Take this with you</p><p className="mt-4 text-lg">{results[2] ? recommendation(results[2]) : 'Keep making time for accurate, comfortable practice.'}</p><p className="mt-4 text-sm text-muted">Your three sessions are saved in History.</p></div>
    <div className="mt-8 flex gap-4"><Link className="btn btn-primary no-underline" to="/history">See my progress</Link><Link className="btn no-underline" to="/">Back to desk</Link></div></div>
  if (step < 0) {
    const keys = weakestKeys(loadResults())
    return <div className="max-w-4xl"><div className="rule" /><p className="kicker mt-8">A daily ritual</p><h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] italic">Small practice. Lasting progress.</h1><p className="mt-4 max-w-xl text-muted leading-7">A little rhythm, a little attention, a beautiful poem. Three sessions tailored to where you are today.</p>
      <label className="mt-7 block text-sm text-muted">Time for today <select className="practice-select ml-3" value={minutes} onChange={(e) => { const n = Number(e.target.value) as 3|5|10; setMinutes(n); update({ dailyMinutes:n }) }}><option value="3">3 minutes</option><option value="5">5 minutes</option><option value="10">10 minutes</option></select></label>
      <div className="practice-grid mt-8">{stages.map((stage,i) => <div className="coaching-card" key={stage}><p className="kicker">0{i+1} · {stage}</p><h2 className="mt-4 font-display text-2xl italic">{titles[i]}</h2><p className="mt-3 text-sm text-muted">{i === 0 ? 'One minute of gentle Flow practice.' : i === 1 ? keys.length ? `Guided practice for ${keys.join(', ')}. Your warm-up will refine this selection.` : 'Guided practice. Your warm-up helps identify keys to focus on.' : 'Read ahead, settle in, and type freely.'}</p></div>)}</div>
      <button className="btn btn-primary mt-8" type="button" onClick={() => setStep(0)}>Start daily practice</button><p className="mt-3 text-xs text-muted">Each stage begins when you choose Begin. Take a breath between sessions.</p>
    </div>
  }
  return <PracticePlayer key={step} title={titles[step]!} kicker={`Daily · ${step+1}/3 · ${stages[step]} · ${duration} seconds`} instruction={step === 1 ? 'These poems favor keys that need attention. Correct mistakes before continuing, and use the finger cues as a guide.' : 'Read one line ahead and keep your hands relaxed. Let accuracy set the pace.'} build={build} forcedStyle={step === 1 ? 'guided' : 'flow'} resultInfo={{ source:'test', textSource:'poems', difficulty:step === 0 ? 'gentle' : 'balanced', daily:true }} onResult={remember} nextAction={{ label:step === 2 ? 'Finish daily practice' : `Continue to ${stages[step+1]}`, onClick: () => setStep((s) => s+1) }} exitTo="/" />
}
