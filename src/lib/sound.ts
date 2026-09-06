let ctx: AudioContext | null = null

function context(): AudioContext | null {
  const AC = window.AudioContext ?? window.webkitAudioContext
  if (!AC) return null
  ctx ??= new AC()
  return ctx
}

export function playKeytick() {
  const audio = context()
  if (!audio) return
  if (audio.state === 'suspended') {
    void audio.resume()
  }
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'square'
  osc.frequency.value = 920
  gain.gain.value = 0.028
  osc.connect(gain)
  gain.connect(audio.destination)
  const now = audio.currentTime
  osc.start(now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)
  osc.stop(now + 0.022)
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
