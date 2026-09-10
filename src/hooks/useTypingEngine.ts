import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { createEngine } from '../engine/engine'
import type { CreateEngineConfig, Engine, EngineSnapshot } from '../engine/types'
import { playKeytick } from '../lib/sound'

interface Options {
  config: CreateEngineConfig
  sound?: boolean
  armed?: boolean
  onComplete?: (snapshot: EngineSnapshot) => void
}

export function useTypingEngine({ config, sound = false, armed = true, onComplete }: Options) {
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
  /** Bumped on every restart so the stage can remount with a clean input/focus. */
  const [sessionKey, setSessionKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const tabArmed = useRef(false)
  const finishedRef = useRef(false)
  const soundRef = useRef(sound)
  soundRef.current = sound
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const keydownHandled = useRef(false)

  const restart = useCallback(() => {
    finishedRef.current = false
    tabArmed.current = false
    keydownHandled.current = false
    engineRef.current = createEngine(configRef.current)
    setSnapshot(engineRef.current.getSnapshot())
    setSessionKey((k) => k + 1)
    // Focus after the remounted TypingStage input is in the DOM - not the
    // finished-state phantom input that is about to unmount.
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
    if (!armed) return
    const onWindowKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        tabArmed.current = true
        return
      }
      if (event.key === 'Enter' && tabArmed.current) {
        // Capture phase + stopPropagation so a focused Retry button does not
        // also fire its click (which would double-restart).
        event.preventDefault()
        event.stopPropagation()
        tabArmed.current = false
        restart()
        return
      }
      if (event.key !== 'Enter') {
        tabArmed.current = false
      }
    }
    window.addEventListener('keydown', onWindowKey, true)
    return () => window.removeEventListener('keydown', onWindowKey, true)
  }, [restart, armed])

  const ingest = useCallback(
    (keys: string[]) => {
      const engine = engineRef.current
      if (!engine || !armed || keys.length === 0) return
      const now = performance.now()
      let snap = engine.getSnapshot()
      for (const key of keys) {
        snap = engine.handleKey(key, now)
        if (soundRef.current && key !== 'Backspace') playKeytick()
      }
      setSnapshot(snap)
    },
    [armed],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const engine = engineRef.current
      if (!engine || !armed) return

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
      if (event.key === 'Unidentified' || event.key === 'Process') return

      if (event.key === 'Backspace') {
        event.preventDefault()
        keydownHandled.current = true
        ingest(['Backspace'])
        return
      }
      if (event.key === ' ') {
        event.preventDefault()
        keydownHandled.current = true
        ingest([' '])
        return
      }
      if (event.key.length === 1) {
        event.preventDefault()
        keydownHandled.current = true
        ingest([event.key])
      }
    },
    [restart, armed, ingest],
  )

  const onInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const el = event.currentTarget
      const native = event.nativeEvent as InputEvent
      const skipped = keydownHandled.current
      keydownHandled.current = false
      if (skipped) {
        el.value = ''
        return
      }
      if (!armed) {
        el.value = ''
        return
      }

      const type = native.inputType ?? ''
      if (type.startsWith('delete')) {
        ingest(['Backspace'])
        el.value = ''
        return
      }

      const keys = [...el.value].filter((ch) => ch !== '\n' && ch !== '\r')
      if (keys.length > 0) ingest(keys)
      el.value = ''
    },
    [armed, ingest],
  )

  const focus = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return { snapshot, restart, sessionKey, inputRef, onKeyDown, onInput, focus }
}
