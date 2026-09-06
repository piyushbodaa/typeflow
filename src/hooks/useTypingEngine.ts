import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createEngine } from '../engine/engine'
import type { CreateEngineConfig, Engine, EngineSnapshot } from '../engine/types'
import { playKeytick } from '../lib/sound'

interface Options {
  config: CreateEngineConfig
  sound?: boolean
  onComplete?: (snapshot: EngineSnapshot) => void
}

export function useTypingEngine({ config, sound = false, onComplete }: Options) {
  const configKey = JSON.stringify(config.mode)
  const engineRef = useRef<Engine | null>(null)
  const prevKey = useRef(configKey)
  const configRef = useRef(config)
  configRef.current = config

  if (engineRef.current === null) {
    engineRef.current = createEngine(config)
  }

  const [snapshot, setSnapshot] = useState<EngineSnapshot>(() =>
    engineRef.current!.getSnapshot(),
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const tabArmed = useRef(false)
  const finishedRef = useRef(false)
  const soundRef = useRef(sound)
  soundRef.current = sound
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const restart = useCallback(() => {
    finishedRef.current = false
    tabArmed.current = false
    engineRef.current = createEngine(configRef.current)
    setSnapshot(engineRef.current.getSnapshot())
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (prevKey.current === configKey) return
    prevKey.current = configKey
    restart()
  }, [configKey, restart])

  useEffect(() => {
    if (snapshot.status !== 'running') return
    let frame = 0
    const loop = (now: number) => {
      setSnapshot(engineRef.current!.tick(now))
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [snapshot.status])

  useEffect(() => {
    if (snapshot.status === 'finished' && !finishedRef.current) {
      finishedRef.current = true
      onCompleteRef.current?.(snapshot)
    }
    if (snapshot.status !== 'finished') finishedRef.current = false
  }, [snapshot])

  useEffect(() => {
    const onWindowKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        tabArmed.current = true
        return
      }
      if (event.key === 'Enter' && tabArmed.current) {
        event.preventDefault()
        tabArmed.current = false
        restart()
      } else if (event.key !== 'Enter') {
        tabArmed.current = false
      }
    }
    window.addEventListener('keydown', onWindowKey)
    return () => window.removeEventListener('keydown', onWindowKey)
  }, [restart])

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    const engine = engineRef.current
    if (!engine) return
    const now = performance.now()

    if (event.key === 'Tab') {
      event.preventDefault()
      tabArmed.current = true
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (tabArmed.current) restart()
      tabArmed.current = false
      return
    }

    tabArmed.current = false

    if (event.ctrlKey || event.metaKey || event.altKey) return

    if (event.key === 'Backspace') {
      event.preventDefault()
      setSnapshot(engine.handleKey('Backspace', now))
      return
    }
    if (event.key === ' ') {
      event.preventDefault()
      if (soundRef.current) playKeytick()
      setSnapshot(engine.handleKey(' ', now))
      return
    }
    if (event.key.length === 1) {
      event.preventDefault()
      if (soundRef.current) playKeytick()
      setSnapshot(engine.handleKey(event.key, now))
    }
  }, [restart])

  const focus = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return { snapshot, restart, inputRef, onKeyDown, focus }
}
