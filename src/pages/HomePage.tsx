import { Link } from 'react-router-dom'
import { HeroKeyboard } from '../components/HeroKeyboard'
import { Sparkline } from '../components/Sparkline'
import { lessonById } from '../data/lessons'
import { useHistory } from '../hooks/useHistory'
import { useProgress } from '../hooks/useProgress'
import { useSettings } from '../hooks/useTheme'
import { cn } from '../lib/cn'
import { formatWhen, modeLabel } from '../lib/format'
import { summarize } from '../lib/summary'

export function HomePage() {
  const { results } = useHistory()
  const { completed } = useProgress()
  const { settings, update, toggleTheme } = useSettings()
  const snap = summarize(results, completed)

  return (
    <div>
      <section className="hero-well">
        <HeroKeyboard />
        <p className="pb-5 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
          home row · asdf jkl;
        </p>
      </section>

      <section className="mt-10 grid grid-cols-12 gap-x-12 gap-y-8">
        <div className="col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            desktop keyboard trainer
          </p>
          <h1 className="mt-3 max-w-xl text-[2.6rem] font-medium leading-[1.12] tracking-tight">
            Find the current.
          </h1>
          <p className="mt-4 max-w-lg text-[17px] leading-7 text-muted">
            Two hands. Home row. A physical keyboard. Typeflow is the quiet desk for people who
            already type on phones and want real speed.
          </p>
        </div>
        <div className="col-span-5 flex flex-col justify-center gap-5">
          <Link to="/test?seconds=60&go=1" className="btn btn-primary w-full no-underline">
            Start 1-minute test
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            <Link
              to="/test"
              className="text-muted no-underline transition-colors duration-180 hover:text-ink"
            >
              Practice
            </Link>
            <Link
              to="/lessons"
              className="text-muted no-underline transition-colors duration-180 hover:text-ink"
            >
              Lessons
            </Link>
            <Link
              to="/history"
              className="text-muted no-underline transition-colors duration-180 hover:text-ink"
            >
              History
            </Link>
          </div>
        </div>
      </section>

      <div className="current-rail mt-12" />

      <section className="grid grid-cols-4 border border-line">
        <StatCard label="last wpm" value={fmt(snap.lastWpm)} />
        <StatCard label="best wpm" value={fmt(snap.bestWpm)} accent />
        <div className="border-r border-line bg-elev px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">accuracy</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="font-mono text-2xl tabular-nums text-ink">
              {snap.lastAccuracy == null ? '—' : `${Math.round(snap.lastAccuracy)}%`}
            </p>
            <Sparkline series={snap.accuracySeries} compact />
          </div>
        </div>
        <div className="bg-elev px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">lessons</p>
          <p className="mt-3 font-mono text-2xl tabular-nums text-ink">
            {snap.lessonsDone}
            <span className="text-sm text-muted"> / {snap.lessonsTotal}</span>
          </p>
          <div className="mt-3 h-[2px] bg-line">
            <div
              className="h-[2px] bg-accent transition-[width] duration-180"
              style={{ width: `${(snap.lessonsDone / snap.lessonsTotal) * 100}%` }}
            />
          </div>
        </div>
      </section>

      <section className="mt-14 grid grid-cols-12 gap-12">
        <div className="col-span-7">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Recent</h2>
            <Link to="/history" className="font-mono text-[11px] text-accent no-underline">
              all history
            </Link>
          </div>
          {snap.recent.length === 0 ? (
            <p className="border border-line bg-elev px-5 py-8 text-sm text-muted">
              No tests yet. The 1-minute run is the shortest way to put a number on the board.
            </p>
          ) : (
            <ul className="border border-line">
              {snap.recent.map((row) => (
                <li
                  key={row.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0"
                >
                  <span className="font-mono text-xs text-muted">{formatWhen(row.at)}</span>
                  <span className="flex-1 truncate text-sm">
                    {modeLabel(row.mode, row.lessonId ? lessonById(row.lessonId)?.title : undefined)}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-accent">
                    {Math.round(row.wpm)}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-muted">
                    {Math.round(row.accuracy)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-5">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Desk</h2>
          <div className="border border-line bg-elev">
            <SettingRow
              label="Theme"
              value={settings.theme}
              onClick={toggleTheme}
              action={settings.theme === 'dark' ? 'light' : 'dark'}
            />
            <SettingRow
              label="Keyboard"
              value={settings.showKeyboard ? 'on' : 'off'}
              onClick={() => update({ showKeyboard: !settings.showKeyboard })}
              action="toggle"
            />
            <SettingRow
              label="Sound"
              value={settings.sound ? 'on' : 'off'}
              onClick={() => update({ sound: !settings.sound })}
              action="toggle"
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            Everything stays in this browser. Tab then Enter restarts a run after you begin.
          </p>
        </div>
      </section>
    </div>
  )
}

function fmt(n: number | null) {
  return n == null ? '—' : String(Math.round(n))
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="border-r border-line bg-elev px-5 py-5 last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={cn('mt-3 font-mono text-2xl tabular-nums', accent ? 'text-accent' : 'text-ink')}>
        {value}
      </p>
    </div>
  )
}

function SettingRow({
  label,
  value,
  action,
  onClick,
}: {
  label: string
  value: string
  action: string
  onClick: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-line px-5 py-4 last:border-b-0">
      <div>
        <p className="text-sm text-ink">{label}</p>
        <p className="mt-0.5 font-mono text-[11px] text-muted">{value}</p>
      </div>
      <button type="button" className="btn" onClick={onClick}>
        {action}
      </button>
    </div>
  )
}
