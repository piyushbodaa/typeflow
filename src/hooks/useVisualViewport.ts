import { useEffect, useState } from 'react'

export function useVisualViewport() {
  const [height, setHeight] = useState(() =>
    typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 0,
  )

  useEffect(() => {
    const vv = window.visualViewport
    const apply = () => setHeight(vv?.height ?? window.innerHeight)
    apply()
    vv?.addEventListener('resize', apply)
    vv?.addEventListener('scroll', apply)
    window.addEventListener('resize', apply)
    return () => {
      vv?.removeEventListener('resize', apply)
      vv?.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
  }, [])

  return height
}
