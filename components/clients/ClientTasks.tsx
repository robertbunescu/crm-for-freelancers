'use client'

import { SquareCheck as CheckSquare, Circle, Clock } from 'lucide-react'
import type { Task } from '@/lib/types'
import { PriorityBadge, TaskStatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

interface ClientTasksProps {
  tasks: Task[]
}

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export function ClientTasks({ tasks }: ClientTasksProps) {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">
            Tasks
          </h3>
          <p className="text-[12px] text-text-tertiary mt-1">
            {tasks.length} tasks for this client
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckSquare className="w-8 h-8 text-text-tertiary mb-3" />
          <p className="text-[13px] text-text-tertiary">
            No tasks for this client yet
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map(task => (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-3 p-3.5 rounded-lg',
                'bg-surface-1 border border-border-default',
                'transition-all duration-base ease-out-expo',
                'hover:border-border-strong hover:shadow-xs hover:-translate-y-px'
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {task.status === 'done' ? (
                  <CheckSquare className="w-4.5 h-4.5 text-success w-5 h-5" />
                ) : task.status === 'in_progress' ? (
                  <Clock className="w-5 h-5 text-accent" />
                ) : (
                  <Circle className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      'text-[13px] font-medium tracking-[-0.005em]',
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
                <p className="text-[12px] text-text-tertiary mt-1 leading-relaxed">
                  {task.description}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11.5px] text-text-tertiary">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono tabular">
                    Due {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
