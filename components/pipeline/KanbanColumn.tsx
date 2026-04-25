'use client'

import { Plus } from 'lucide-react'
import type { Lead, LeadStatus } from '@/lib/types'
import { KanbanCard } from './KanbanCard'
import { cn } from '@/lib/utils'

type Tone = 'accent' | 'warning' | 'info' | 'success' | 'neutral'

const toneDot: Record<Tone, string> = {
  accent: 'bg-accent',
  warning: 'bg-warning',
  info: 'bg-info',
  success: 'bg-success',
  neutral: 'bg-text-tertiary',
}

const toneRail: Record<Tone, string> = {
  accent: 'before:bg-accent',
  warning: 'before:bg-warning',
  info: 'before:bg-info',
  success: 'before:bg-success',
  neutral: 'before:bg-text-tertiary',
}

interface KanbanColumnProps {
  id: LeadStatus
  label: string
  tone: Tone
  leads: Lead[]
  isDragOver: boolean
  draggingId: string | null
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onDragOver: () => void
  onDragLeave: () => void
  onDrop: (id: string) => void
}

export function KanbanColumn({
  label,
  tone,
  leads,
  isDragOver,
  draggingId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: KanbanColumnProps) {
  const colValue = leads.reduce((s, l) => s + l.value, 0)

  return (
    <div
      className={cn(
        'w-[296px] flex flex-col rounded-xl',
        'bg-surface-1/50 border border-border-subtle',
        'transition-[background-color,border-color,box-shadow] duration-base',
        isDragOver && 'bg-accent-soft border-[hsl(var(--accent)/0.4)] shadow-md'
      )}
      onDragOver={e => {
        e.preventDefault()
        onDragOver()
      }}
      onDragLeave={onDragLeave}
      onDrop={e => {
        e.preventDefault()
        if (draggingId) onDrop(draggingId)
      }}
    >
      {/* Column header */}
      <div
        className={cn(
          'relative flex items-center justify-between px-3.5 py-3 border-b border-border-subtle',
          'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-r-sm',
          toneRail[tone]
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', toneDot[tone])}
            aria-hidden
          />
          <span className="text-[12px] font-semibold text-text-primary tracking-[-0.005em] truncate">
            {label}
          </span>
          <span
            className={cn(
              'inline-flex items-center h-5 px-1.5 rounded-sm flex-shrink-0',
              'text-[10.5px] font-semibold tabular leading-none',
              'bg-surface-2 text-text-secondary'
            )}
          >
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {leads.length > 0 && (
            <span className="font-mono tabular text-[11px] text-text-tertiary">
              ${(colValue / 1000).toFixed(0)}k
            </span>
          )}
          <button
            className={cn(
              'w-6 h-6 rounded-sm flex items-center justify-center',
              'text-text-tertiary hover:text-text-primary hover:bg-surface-2',
              'transition-colors duration-fast'
            )}
            aria-label={`Add to ${label}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drop rail */}
      <div
        className={cn(
          'flex-1 p-2 space-y-2 min-h-[160px]',
          'transition-[background-color] duration-fast'
        )}
      >
        {leads.map((lead, idx) => (
          <div
            key={lead.id}
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <KanbanCard
              lead={lead}
              tone={tone}
              isDragging={draggingId === lead.id}
              onDragStart={() => onDragStart(lead.id)}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}

        {leads.length === 0 && (
          <div
            className={cn(
              'rounded-lg h-28 flex items-center justify-center',
              'text-[11.5px] text-text-tertiary',
              'border border-dashed border-border-default',
              'transition-[border-color,color,background-color] duration-base',
              isDragOver && 'border-accent text-accent bg-accent-soft/40'
            )}
          >
            {isDragOver ? 'Drop here' : 'No leads'}
          </div>
        )}
      </div>
    </div>
  )
}
