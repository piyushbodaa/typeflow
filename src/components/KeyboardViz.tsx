import { needsShift, physicalKey } from '../engine/keys'
import { cn } from '../lib/cn'

const ROW1 = ['`','1','2','3','4','5','6','7','8','9','0','-','=']
const ROW2 = ['q','w','e','r','t','y','u','i','o','p','[',']','\\']
const ROW3 = ['a','s','d','f','g','h','j','k','l',';',"'"]
const ROW4 = ['z','x','c','v','b','n','m',',','.','/']

const FINGERS: Record<string, string> = {
  a: 'P',
  s: 'R',
  d: 'M',
  f: 'I',
  j: 'I',
  k: 'M',
  l: 'R',
  ';': 'P',
}

export function KeyboardViz({ expected }: { expected: string }) {
  const phys = physicalKey(expected)
  const shiftOn = needsShift(expected)

  return (
    <div className="mt-10 select-none font-mono text-[11px] text-muted" aria-hidden>
      <div className="flex flex-col items-center gap-1.5">
        <KeyRow keys={ROW1} active={phys} />
        <KeyRow keys={ROW2} active={phys} offset="ml-4" />
        <div className="flex gap-1">
          <WideKey label="shift" active={shiftOn} width="w-16" />
          <KeyRow keys={ROW3} active={phys} fingers />
          <WideKey label="shift" active={shiftOn} width="w-16" />
        </div>
        <KeyRow keys={ROW4} active={phys} offset="ml-8" />
        <WideKey label="space" active={phys === ' '} width="w-64" />
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted/80">
        home row · P R M I · I M R P
      </p>
    </div>
  )
}

function KeyRow({
  keys,
  active,
  offset,
  fingers,
}: {
  keys: string[]
  active: string
  offset?: string
  fingers?: boolean
}) {
  return (
    <div className={cn('flex gap-1', offset)}>
      {keys.map((key) => (
        <div
          key={key}
          className={cn(
            'flex h-9 w-9 flex-col items-center justify-center rounded-sm border border-line bg-elev text-ink/80',
            active === key && 'border-accent bg-accent/20 text-accent',
          )}
        >
          <span>{key}</span>
          {fingers && FINGERS[key] ? (
            <span className="text-[8px] leading-none text-muted">{FINGERS[key]}</span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function WideKey({ label, active, width }: { label: string; active: boolean; width: string }) {
  return (
    <div
      className={cn(
        'flex h-9 items-center justify-center rounded-sm border border-line bg-elev text-ink/70',
        width,
        active && 'border-accent bg-accent/20 text-accent',
      )}
    >
      {label}
    </div>
  )
}
