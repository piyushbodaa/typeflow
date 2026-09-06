import type { Settings } from '../lib/storage'

interface SettingsPanelProps {
  settings: Settings
  onToggleTheme: () => void
  onToggleKeyboard: () => void
  onToggleSound: () => void
}

export function SettingsPanel({
  settings,
  onToggleTheme,
  onToggleKeyboard,
  onToggleSound,
}: SettingsPanelProps) {
  return (
    <section>
      <h2 className="kicker">Desk</h2>
      <div className="mt-4">
        <SettingRow
          label="Theme"
          value={settings.theme === 'dark' ? 'Carbon' : 'Ivory'}
          action={settings.theme === 'dark' ? 'Ivory' : 'Carbon'}
          onClick={onToggleTheme}
        />
        <SettingRow
          label="Keyboard"
          value={settings.showKeyboard ? 'On-screen keys visible' : 'On-screen keys hidden'}
          action={settings.showKeyboard ? 'Hide' : 'Show'}
          onClick={onToggleKeyboard}
        />
        <SettingRow
          label="Sound"
          value={settings.sound ? 'Key ticks on' : 'Silent'}
          action={settings.sound ? 'Mute' : 'Enable'}
          onClick={onToggleSound}
        />
      </div>
      <p className="mt-4 text-[13px] leading-5 text-muted">
        Stored in this browser. Tab then Enter restarts a run after you begin.
      </p>
    </section>
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
    <div className="flex items-center justify-between gap-4 border-t border-border py-2.5">
      <div>
        <p className="text-[15px] text-fg">{label}</p>
        <p className="mt-0.5 font-mono text-[11px] text-muted">{value}</p>
      </div>
      <button type="button" className="btn" onClick={onClick}>
        {action}
      </button>
    </div>
  )
}
