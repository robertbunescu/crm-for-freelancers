'use client'

import { Calendar } from 'lucide-react'
import type { Lead } from '@/lib/types'
import { cn } from '@/lib/utils'

type Tone = 'accent' | 'warning' | 'info' | 'success' | 'neutral'

const toneRail: Record<Tone, string> = {
  accent: 'before:bg-accent',
  warning: 'before:bg-warning',
  info: 'before:bg-info',
  success: 'before:bg-success',
  neutral: 'before:bg-text-tertiary',
}

interface KanbanCardProps {
  lead: Lead
  tone: Tone
  isDragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
}

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function KanbanCard({
  lead,
  tone,
  isDragging,
  onDragStart,
  onDragEnd,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'group relative select-none cursor-grab active:cursor-grabbing',
        'rounded-lg bg-surface-1 border border-border-default',
        'shadow-xs',
        // tone rail on the left edge
        'before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2',
        'before:w-[2px] before:rounded-r-sm before:opacity-0',
        'before:transition-opacity before:duration-base',
        'group-hover:before:opacity-100 hover:before:opacity-100',
        toneRail[tone],
        'transition-[box-shadow,border-color,transform,opacity] duration-base ease-out-expo',
        'hover:shadow-md hover:border-border-strong hover:-translate-y-0.5',
        isDragging && 'opacity-40 scale-[0.98] shadow-none rotate-[-1deg]'
      )}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold text-text-primary leading-tight tracking-[-0.01em] truncate">
              {lead.name}
            </div>
            <div className="text-[11.5px] text-text-tertiary mt-0.5 truncate">
              {lead.company}
            </div>
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 transition-transform duration-base group-hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
              boxShadow:
                'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover) / 0.4)',
            }}
          >
            {getInitials(lead.name)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
            <Calendar className="w-3 h-3" />
            <span className="font-mono tabular">{formatDate(lead.lastContact)}</span>
          </div>
          <span
            className={cn(
              'inline-flex items-center h-5 px-1.5 rounded-sm',
              'font-mono tabular text-[12px] font-semibold',
              'bg-surface-2 text-text-primary'
            )}
          >
            ${lead.value.toLocaleString()}
          </span>
        </div>

        {lead.source && (
          <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between">
            <span className="text-micro text-text-tertiary uppercase truncate">
              {lead.source}
            </span>
            {lead.industry && (
              <span className="text-[10.5px] text-text-tertiary truncate ml-2">
                {lead.industry}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
