import { useMemo, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { DesktopGate } from './components/DesktopGate'
import { AppShell } from './components/AppShell'
import { FocusModeContext } from './hooks/useFocusMode'
import { useDesktopGate } from './hooks/useDesktopGate'
import { SettingsProvider, useSettings } from './hooks/useTheme'
import { AboutPage } from './pages/AboutPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { LessonPlayerPage } from './pages/LessonPlayerPage'
import { LessonsPage } from './pages/LessonsPage'
import { TestPage } from './pages/TestPage'

function Root() {
  const narrow = useDesktopGate()
  const { settings, update, toggleTheme } = useSettings()
  const [focused, setFocused] = useState(false)
  const focusValue = useMemo(() => ({ focused, setFocused }), [focused])

  if (narrow) return <DesktopGate />

  return (
    <FocusModeContext.Provider value={focusValue}>
      <AppShell
        focused={focused}
        settings={settings}
        onToggleTheme={toggleTheme}
        onToggleKeyboard={() => update({ showKeyboard: !settings.showKeyboard })}
        onToggleSound={() => update({ sound: !settings.sound })}
      />
    </FocusModeContext.Provider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'test', element: <TestPage /> },
      { path: 'lessons', element: <LessonsPage /> },
      { path: 'lessons/:id', element: <LessonPlayerPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  )
}
