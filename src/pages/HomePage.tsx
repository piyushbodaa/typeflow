import { Link } from 'react-router-dom'
import { HubHeader } from '../components/HubHeader'
import { PrimaryActions } from '../components/PrimaryActions'
import { SettingsPanel } from '../components/SettingsPanel'
import { StatsSnapshot } from '../components/StatsSnapshot'
import { lessonById } from '../data/lessons'
import { useHistory } from '../hooks/useHistory'
import { useProgress } from '../hooks/useProgress'
import { useSettings } from '../hooks/useTheme'
import { formatWhen, modeLabel } from '../lib/format'
import { summarize } from '../lib/summary'

export function HomePage() {
  const { results } = useHistory()
  const { completed } = useProgress()
  const { settings, update, toggleTheme } = useSettings()
  const snap = summarize(results, completed)

  return (
    <div className="flex flex-col gap-12">
      <HubHeader />
      <PrimaryActions />
      <StatsSnapshot snap={snap} />

      <section className="grid grid-cols-12 gap-10">
        <div className="col-span-7">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="kicker">Recent</h2>
            <Link to="/history" className="font-mono text-[12px] text-muted no-underline hover:text-fg">
              All history
            </Link>
          </div>
          {snap.recent.length === 0 ? (
            <p className="panel px-5 py-8 text-sm text-muted">
              No tests yet. Start the 1-minute run to put a number on the board.
            </p>
          ) : (
            <ul className="panel overflow-hidden">
              {snap.recent.map((row) => (
                <li
                  key={row.id}
                  className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-3 last:border-b-0"
                >
                  <span className="font-mono text-xs text-muted">{formatWhen(row.at)}</span>
                  <span className="flex-1 truncate text-sm">
                    {modeLabel(row.mode, row.lessonId ? lessonById(row.lessonId)?.title : undefined)}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-fg">
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
          <SettingsPanel
            settings={settings}
            onToggleTheme={toggleTheme}
            onToggleKeyboard={() => update({ showKeyboard: !settings.showKeyboard })}
            onToggleSound={() => update({ sound: !settings.sound })}
          />
        </div>
      </section>
    </div>
  )
}
