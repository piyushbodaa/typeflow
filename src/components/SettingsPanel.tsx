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
      <h2 className="mb-3 kicker">Settings</h2>
      <div className="panel">
        <SettingRow
          label="Theme"
          value={settings.theme === 'dark' ? 'Dark' : 'Light'}
          action={settings.theme === 'dark' ? 'Light' : 'Dark'}
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
      <p className="mt-3 text-xs leading-5 text-muted">
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
    <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0">
      <div>
        <p className="text-sm text-fg">{label}</p>
        <p className="mt-0.5 font-mono text-[11px] text-muted">{value}</p>
      </div>
      <button type="button" className="btn" onClick={onClick}>
        {action}
      </button>
    </div>
  )
}
