import { cn } from '@/lib/utils'
import type { LeadStatus, Priority, TaskStatus } from '@/lib/types'

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

const toneClass: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-text-secondary',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
}

const toneDot: Record<Tone, string> = {
  neutral: 'bg-text-tertiary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

const leadStatusConfig: Record<LeadStatus, { label: string; tone: Tone }> = {
  new: { label: 'New', tone: 'accent' },
  contacted: { label: 'Contacted', tone: 'warning' },
  proposal: { label: 'Proposal', tone: 'info' },
  won: { label: 'Won', tone: 'success' },
  lost: { label: 'Lost', tone: 'neutral' },
}

const priorityConfig: Record<Priority, { label: string; tone: Tone }> = {
  high: { label: 'High', tone: 'danger' },
  medium: { label: 'Medium', tone: 'warning' },
  low: { label: 'Low', tone: 'neutral' },
}

const taskStatusConfig: Record<TaskStatus, { label: string; tone: Tone }> = {
  todo: { label: 'To Do', tone: 'neutral' },
  in_progress: { label: 'In Progress', tone: 'accent' },
  done: { label: 'Done', tone: 'success' },
}

const basePillClasses = 'inline-flex items-center h-5 px-1.5 rounded-sm text-[11px] font-semibold tracking-[-0.005em] leading-none'
const baseDotClasses = 'inline-flex items-center gap-1.5 h-5 px-1.5 rounded-sm text-[11px] font-semibold tracking-[-0.005em] leading-none'

export function LeadStatusBadge({ status, withDot = false }: { status: LeadStatus; withDot?: boolean }) {
  const config = leadStatusConfig[status]
  if (withDot) {
    return (
      <span className={cn(baseDotClasses, toneClass[config.tone])}>
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', toneDot[config.tone])} />
        {config.label}
      </span>
    )
  }
  return (
    <span className={cn(basePillClasses, toneClass[config.tone])}>
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority, withDot = true }: { priority: Priority; withDot?: boolean }) {
  const config = priorityConfig[priority]
  if (withDot) {
    return (
      <span className={cn(baseDotClasses, toneClass[config.tone])}>
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', toneDot[config.tone])} />
        {config.label}
      </span>
    )
  }
  return (
    <span className={cn(basePillClasses, toneClass[config.tone])}>
      {config.label}
    </span>
  )
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = taskStatusConfig[status]
  return (
    <span className={cn(basePillClasses, toneClass[config.tone])}>
      {config.label}
    </span>
  )
}

export function StatusDot({ tone = 'accent', pulse = false }: { tone?: Tone; pulse?: boolean }) {
  return (
    <span className="relative inline-flex w-2 h-2 flex-shrink-0">
      {pulse && (
        <span className={cn('absolute inset-0 rounded-full opacity-60 animate-ping', toneDot[tone])} />
      )}
      <span className={cn('relative inline-block w-2 h-2 rounded-full', toneDot[tone])} />
    </span>
  )
}
