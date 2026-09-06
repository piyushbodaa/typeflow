import { useEffect, useState } from 'react'

export function useDesktopGate() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return narrow
}
