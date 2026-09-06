import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadSettings, saveSettings, type Settings } from '../lib/storage'

function applyTheme(theme: Settings['theme']) {
  document.documentElement.classList.toggle('light', theme === 'light')
}

interface SettingsValue {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  toggleTheme: () => void
}

function useSettingsState(): SettingsValue {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())

  useEffect(() => {
    applyTheme(settings.theme)
    saveSettings(settings)
  }, [settings])

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }))
  }, [])

  return useMemo(() => ({ settings, update, toggleTheme }), [settings, update, toggleTheme])
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const value = useSettingsState()
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
