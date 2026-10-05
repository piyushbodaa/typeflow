import { useSettings } from '../hooks/useTheme'

export function ComfortControls({ includeStyle = false }: { includeStyle?: boolean }) {
  const { settings, update } = useSettings()
  return <div className="comfort-controls flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-muted">
    <label className="flex items-center gap-2">Text size
      <input aria-label="Passage text size" type="range" min="18" max="34" step="1" value={settings.fontSize} onChange={(e) => update({ fontSize: Number(e.target.value) })} className="w-24 accent-accent" />
      <span className="font-mono text-xs">{settings.fontSize}</span>
    </label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={settings.highContrast} onChange={(e) => update({ highContrast: e.target.checked })} /> High contrast</label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={settings.showKeyboard} onChange={(e) => update({ showKeyboard: e.target.checked })} /> Keyboard</label>
    {includeStyle ? <label className="flex items-center gap-2">Practice style <select value={settings.practiceStyle} onChange={(e) => update({ practiceStyle: e.target.value === 'guided' ? 'guided' : 'flow' })} className="practice-select"><option value="flow">Flow</option><option value="guided">Guided</option></select></label> : null}
  </div>
}
