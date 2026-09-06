import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { cn } from '../lib/cn'

const KEY_W = 52
const KEY_H = 50
const STEP = 59

const ROWS: { x: number; y: number; keys: string[] }[] = [
  { x: 168, y: 44, keys: [...'qwertyuiop'] },
  { x: 194, y: 102, keys: [...'asdfghjkl;'] },
  { x: 220, y: 160, keys: [...'zxcvbnm,./'] },
]

const HOME = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';'])

const PHRASE = [
  'a', 's', 'd', 'f', 'j', 'k', 'l', ';',
  'f', 'j', 'd', 'k',
  'e', 'i',
  's', 'l',
  ' ',
  'a', ';',
  'f', 'j',
] as const

const FINGER_OF: Record<string, string> = {
  a: 'LP',
  q: 'LP',
  z: 'LP',
  s: 'LR',
  w: 'LR',
  x: 'LR',
  d: 'LM',
  e: 'LM',
  c: 'LM',
  f: 'LI',
  r: 'LI',
  v: 'LI',
  g: 'LI',
  t: 'LI',
  b: 'LI',
  j: 'RI',
  u: 'RI',
  m: 'RI',
  h: 'RI',
  y: 'RI',
  n: 'RI',
  k: 'RM',
  i: 'RM',
  ',': 'RM',
  l: 'RR',
  o: 'RR',
  '.': 'RR',
  ';': 'RP',
  p: 'RP',
  '/': 'RP',
}

function fingerDown(finger: string, key: string | null) {
  if (!key) return false
  if (key === ' ') return finger === 'LT' || finger === 'RT'
  return FINGER_OF[key] === finger
}

export function HeroKeyboard() {
  const reduced = usePrefersReducedMotion()
  const [pressed, setPressed] = useState<string | null>(null)

  useEffect(() => {
    if (reduced) return
    let i = 0
    let gap: number | undefined
    let hold: number | undefined
    let cancelled = false

    const play = () => {
      if (cancelled) return
      const key = PHRASE[i]
      setPressed(key)
      hold = window.setTimeout(() => {
        setPressed(null)
        i = (i + 1) % PHRASE.length
        gap = window.setTimeout(play, 110)
      }, 220)
    }

    const start = window.setTimeout(play, 400)
    return () => {
      cancelled = true
      window.clearTimeout(start)
      if (hold) window.clearTimeout(hold)
      if (gap) window.clearTimeout(gap)
    }
  }, [reduced])

  return (
    <svg
      className="hero-keyboard"
      viewBox="0 0 920 500"
      role="img"
      aria-label="Two hands resting on a keyboard in home-row posture"
    >
      <defs>
        <radialGradient id="hero-key-bloom" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="var(--color-heat)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="hero-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="hero-board-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0.06" />
          <stop offset="50%" stopColor="var(--color-ink)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect x="136" y="20" width="656" height="268" rx="14" className="hero-chassis" />
      <rect x="136" y="20" width="656" height="268" rx="14" fill="url(#hero-board-sheen)" />

      {ROWS.map((row) =>
        row.keys.map((key, i) => (
          <KeyCap
            key={`${row.y}-${key}`}
            id={key}
            x={row.x + i * STEP}
            y={row.y}
            w={KEY_W}
            h={KEY_H}
            pressed={pressed === key}
            home={HOME.has(key)}
            rest={reduced && HOME.has(key)}
          />
        )),
      )}

      <KeyCap
        id=" "
        x={286}
        y={218}
        w={400}
        h={KEY_H}
        pressed={pressed === ' '}
        home={false}
        rest={false}
        label="space"
      />

      <ellipse cx="248" cy="428" rx="96" ry="30" className="hero-hand-shadow" />
      <ellipse cx="690" cy="428" rx="96" ry="30" className="hero-hand-shadow" />

      <g className="hero-hand">
        <path
          className="hero-palm"
          d="M150 402 C 128 358 126 318 148 300 C 162 290 248 282 308 312 C 338 326 350 360 342 404 C 332 458 272 492 198 486 C 158 482 154 444 150 402 Z"
        />
        <path
          className="hero-palm-shade"
          d="M176 368 C 168 338 198 318 236 322 C 268 326 292 348 286 376 C 280 404 220 412 176 368 Z"
        />
        <Finger id="LP" active={fingerDown('LP', pressed)} d="M156 304 Q 178 214 220 134" width={15} />
        <Finger id="LR" active={fingerDown('LR', pressed)} d="M188 294 Q 224 200 279 131" width={17} />
        <Finger id="LM" active={fingerDown('LM', pressed)} d="M230 286 Q 278 192 338 128" width={19} />
        <Finger id="LI" active={fingerDown('LI', pressed)} d="M278 294 Q 332 198 397 131" width={18} />
        <Finger id="LT" active={fingerDown('LT', pressed)} d="M312 358 Q 344 292 372 246" width={21} />
        <rect x="168" y="472" width="92" height="36" rx="8" className="hero-cuff" />
      </g>

      <g className="hero-hand">
        <path
          className="hero-palm"
          d="M770 402 C 792 358 794 318 772 300 C 758 290 672 282 612 312 C 582 326 570 360 578 404 C 588 458 648 492 722 486 C 762 482 766 444 770 402 Z"
        />
        <path
          className="hero-palm-shade"
          d="M744 368 C 752 338 722 318 684 322 C 652 326 628 348 634 376 C 640 404 700 412 744 368 Z"
        />
        <Finger id="RI" active={fingerDown('RI', pressed)} d="M642 294 Q 608 198 574 131" width={18} />
        <Finger id="RM" active={fingerDown('RM', pressed)} d="M690 286 Q 662 192 633 128" width={19} />
        <Finger id="RR" active={fingerDown('RR', pressed)} d="M732 294 Q 716 200 692 131" width={17} />
        <Finger id="RP" active={fingerDown('RP', pressed)} d="M764 304 Q 760 214 751 134" width={15} />
        <Finger id="RT" active={fingerDown('RT', pressed)} d="M608 358 Q 576 292 548 246" width={21} />
        <rect x="660" y="472" width="92" height="36" rx="8" className="hero-cuff" />
      </g>
    </svg>
  )
}

function KeyCap({
  id,
  x,
  y,
  w,
  h,
  pressed,
  home,
  rest,
  label,
}: {
  id: string
  x: number
  y: number
  w: number
  h: number
  pressed: boolean
  home: boolean
  rest: boolean
  label?: string
}) {
  const lit = pressed || rest
  return (
    <g
      data-key={id}
      className={cn('hero-key', pressed && 'is-pressed', home && 'is-home', rest && 'is-rest')}
    >
      <rect x={x} y={y + 4} width={w} height={h} rx="6" className="hero-key-lip" />
      {lit ? (
        <ellipse
          cx={x + w / 2}
          cy={y + h / 2}
          rx={w * 0.7}
          ry={h * 0.7}
          fill="url(#hero-key-bloom)"
          filter="url(#hero-soft)"
          className="hero-key-glow"
        />
      ) : null}
      <rect
        x={x}
        y={pressed ? y + 3 : y}
        width={w}
        height={h}
        rx="6"
        className="hero-key-face"
      />
      <text
        x={x + w / 2}
        y={pressed ? y + h / 2 + 5 : y + h / 2 + 4}
        textAnchor="middle"
        className="hero-key-label"
      >
        {label ?? id}
      </text>
    </g>
  )
}

function Finger({
  id,
  d,
  width,
  active,
}: {
  id: string
  d: string
  width: number
  active: boolean
}) {
  return (
    <g className={cn('hero-finger', active && 'is-down')} data-finger={id}>
      <path
        d={d}
        fill="none"
        stroke="var(--hand-line)"
        strokeWidth={width + 4}
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d={d}
        fill="none"
        stroke="var(--hand-fill)"
        strokeWidth={width}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke="var(--hand-highlight)"
        strokeWidth={Math.max(4, width * 0.28)}
        strokeLinecap="round"
        opacity="0.45"
        transform="translate(-2 -3)"
      />
    </g>
  )
}
