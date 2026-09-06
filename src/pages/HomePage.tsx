import { Link } from 'react-router-dom'
import { HubHeader } from '../components/HubHeader'
import { PrimaryActions } from '../components/PrimaryActions'
import { RibbonMark } from '../components/RibbonMark'
import { SettingsPanel } from '../components/SettingsPanel'
import { StatsSnapshot } from '../components/StatsSnapshot'
import { availableLesson, lessonById } from '../data/lessons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../hooks/useHistory'
import { useProgress } from '../hooks/useProgress'
import { useSettings } from '../hooks/useTheme'
import { formatWhen, modeLabel } from '../lib/format'
import { summarize } from '../lib/summary'

export function HomePage() {
  useDocumentTitle('typeflow')
  const { results } = useHistory()
  const { completed } = useProgress()
  const { settings, update, toggleTheme } = useSettings()
  const snap = summarize(results, completed)
  const next = availableLesson(completed)

  return (
    <div className="flex flex-col gap-8">
      <HubHeader />
      <PrimaryActions />
      {next ? (
        <p className="text-[15px]">
          <span className="kicker mr-3">Continue</span>
          <Link to={`/lessons/${next.id}`} className="text-fg no-underline hover:underline hover:underline-offset-4">
            {String(next.order).padStart(2, '0')} {next.title}
          </Link>
        </p>
      ) : null}
      <div className="flex flex-wrap items-end gap-12">
        <RibbonMark />
        <div className="min-w-[20rem] flex-1">
          <StatsSnapshot snap={snap} />
        </div>
      </div>

      <section className="grid grid-cols-12 gap-12">
        <div className="col-span-7">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="kicker">Recent</h2>
            <Link to="/history" className="font-mono text-[12px] text-muted no-underline hover:text-fg">
              All history
            </Link>
          </div>
          {snap.recent.length === 0 ? (
            <p className="border-t border-border pt-6 text-sm text-muted">
              No tests yet. Start the 1-minute run to put a number on the board.
            </p>
          ) : (
            <ul>
              {snap.recent.map((row) => (
                <li
                  key={row.id}
                  className="flex items-baseline justify-between gap-4 border-t border-border py-3"
                >
                  <span className="font-mono text-xs text-muted">{formatWhen(row.at)}</span>
                  <span className="flex-1 truncate text-sm">
                    {modeLabel(row.mode, row.lessonId ? lessonById(row.lessonId)?.title : undefined)}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-fg">{Math.round(row.wpm)}</span>
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
