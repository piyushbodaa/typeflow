import { BookOpen, History, Play } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

const actions: {
  to: string
  label: string
  hint: string
  icon: LucideIcon
  primary?: boolean
}[] = [
  {
    to: '/test?seconds=60&go=1',
    label: 'Start test',
    hint: '60-second timed run',
    icon: Play,
    primary: true,
  },
  {
    to: '/lessons',
    label: 'Lessons',
    hint: '12 drills, pass at 95%',
    icon: BookOpen,
  },
  {
    to: '/history',
    label: 'History',
    hint: 'Last 50 local results',
    icon: History,
  },
]

export function PrimaryActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.to}
            to={action.to}
            className={cn(
              'flex flex-col rounded-md border p-5 no-underline',
              action.primary
                ? 'border-fg bg-fg text-bg hover:opacity-90'
                : 'border-border bg-elevated text-fg transition-[border-color] duration-180 hover:border-muted',
            )}
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden />
            <span className="mt-5 text-[15px] font-medium">{action.label}</span>
            <span className={cn('mt-1 text-[13px]', action.primary ? 'text-bg/70' : 'text-muted')}>
              {action.hint}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
