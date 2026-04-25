'use client'

import { useState } from 'react'
import {
  SquareCheck as CheckSquare,
  Circle,
  Clock,
  Tag,
  Building2,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { mockTasks } from '@/lib/mock-data'
import type { Task, Priority, TaskStatus } from '@/lib/types'
import { PriorityBadge, TaskStatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

const priorityFilters: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const isOverdue = (s: string, status: TaskStatus) =>
  status !== 'done' &&
  new Date(s) < new Date() &&
  new Date(s).toDateString() !== new Date().toDateString()

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')

  const toggleDone = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const next = t.status === 'done' ? 'todo' : 'done'
        if (next === 'done') {
          toast.success('Task completed', { description: t.title })
        } else {
          toast.info('Task reopened', { description: t.title })
        }
        return { ...t, status: next }
      })
    )
  }

  const filtered = tasks.filter(t => {
    const matchPriority =
      priorityFilter === 'all' || t.priority === priorityFilter
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchPriority && matchStatus
  })

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }

  const completionPct =
    tasks.length > 0 ? Math.round((stats.done / tasks.length) * 100) : 0

  const statCards = [
    { label: 'Total', value: stats.total, tone: 'primary' as const },
    { label: 'To Do', value: stats.todo, tone: 'tertiary' as const },
    { label: 'In Progress', value: stats.inProgress, tone: 'accent' as const },
    { label: 'Completed', value: stats.done, tone: 'success' as const },
  ]

  const toneToText: Record<string, string> = {
    primary: 'text-text-primary',
    tertiary: 'text-text-secondary',
    accent: 'text-accent',
    success: 'text-success',
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
        {statCards.map(({ label, value, tone }, idx) => (
          <div
            key={label}
            className="card-premium p-4 lg:p-5 animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <p className="text-micro text-text-tertiary uppercase">{label}</p>
            <p
              className={cn(
                'font-mono tabular text-[26px] font-semibold mt-2.5 tracking-[-0.02em] leading-none',
                toneToText[tone]
              )}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress */}
      {tasks.length > 0 && (
        <div className="card-static p-4 lg:p-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[12.5px] font-medium text-text-secondary tracking-[-0.005em]">
              Overall completion
            </span>
            <span className="font-mono tabular text-[12.5px] font-semibold text-text-primary">
              {completionPct}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-slow ease-out-expo"
              style={{
                width: `${completionPct}%`,
                background:
                  'linear-gradient(90deg, hsl(var(--success)) 0%, hsl(var(--success)) 70%, hsl(var(--success) / 0.6) 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="card-static overflow-hidden">
        <div className="px-5 lg:px-6 py-3.5 border-b border-border-subtle flex flex-wrap items-center gap-3">
          <div className="segmented">
            {priorityFilters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPriorityFilter(value)}
                data-active={priorityFilter === value}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-border-subtle" />
          <div className="segmented">
            {statusFilters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                data-active={statusFilter === value}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono tabular text-[11.5px] text-text-tertiary whitespace-nowrap">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div
              className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-4"
              style={{
                boxShadow:
                  'inset 0 1px 0 rgb(255 255 255 / 0.04), 0 0 0 1px rgb(var(--border-subtle))',
              }}
            >
              <CheckSquare className="w-4 h-4 text-text-tertiary" />
            </div>
            <p className="text-[14px] font-semibold text-text-primary tracking-[-0.005em]">
              No tasks match your filters
            </p>
            <p className="text-[12.5px] text-text-tertiary mt-1.5 max-w-xs">
              Try adjusting the priority or status filter to see more.
            </p>
            <button
              onClick={() => {
                setPriorityFilter('all')
                setStatusFilter('all')
              }}
              className="mt-5 px-3 h-8 rounded-md text-[12px] font-medium text-accent hover:text-accent-hover hover:bg-accent-soft transition-all duration-base"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div>
            {filtered.map((task, i) => {
              const overdue = isOverdue(task.dueDate, task.status)
              return (
                <div
                  key={task.id}
                  className={cn(
                    'group row-rail flex items-start gap-3 sm:gap-4 px-5 lg:px-6 py-3.5',
                    'hover:bg-surface-2/60 transition-colors duration-fast',
                    i !== filtered.length - 1 &&
                      'border-b border-border-subtle'
                  )}
                >
                  <button
                    onClick={() => toggleDone(task.id)}
                    className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                    aria-label="Toggle task complete"
                  >
                    {task.status === 'done' ? (
                      <CheckSquare className="w-5 h-5 text-success" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-accent" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p
                        className={cn(
                          'text-[13.5px] font-medium leading-snug tracking-[-0.005em]',
                          task.status === 'done'
                            ? 'line-through text-text-tertiary'
                            : 'text-text-primary'
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <PriorityBadge priority={task.priority} />
                        <TaskStatusBadge status={task.status} />
                      </div>
                    </div>
                    <p className="text-[12px] text-text-tertiary mt-1 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {task.clientName && (
                        <div className="flex items-center gap-1.5 text-[11.5px] text-text-tertiary">
                          <Building2 className="w-3 h-3" />
                          {task.clientName}
                        </div>
                      )}
                      <div
                        className={cn(
                          'flex items-center gap-1.5 text-[11.5px] font-mono tabular',
                          overdue
                            ? 'text-danger font-medium'
                            : 'text-text-tertiary'
                        )}
                      >
                        <Calendar className="w-3 h-3" />
                        {overdue ? 'Overdue · ' : ''}
                        {formatDate(task.dueDate)}
                      </div>
                      {task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-text-tertiary" />
                          {task.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center h-[18px] px-1.5 rounded-sm text-[10px] font-semibold bg-surface-2 text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
