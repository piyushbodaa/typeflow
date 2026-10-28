import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Notify the opt-in loader without passing URL query strings or app state. */
export function AnalyticsNavigation() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.dispatchEvent(new Event('site-analytics:navigation'))
  }, [pathname])
  return null
}
