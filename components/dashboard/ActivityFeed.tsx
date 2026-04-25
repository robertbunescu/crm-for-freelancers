'use client'

import {
  Phone,
  Mail,
  Video,
  FileText,
  StickyNote,
  Signature as FileSignature,
} from 'lucide-react'
import { mockActivities } from '@/lib/mock-data'
import type { ActivityType } from '@/lib/types'
import { cn } from '@/lib/utils'

type Tone = 'success' | 'accent' | 'info' | 'warning' | 'neutral'

const activityConfig: Record<
  ActivityType,
  { icon: any; tone: Tone; label: string }
> = {
  call: { icon: Phone, tone: 'success', label: 'Call' },
  email: { icon: Mail, tone: 'accent', label: 'Email' },
  meeting: { icon: Video, tone: 'info', label: 'Meeting' },
  proposal: { icon: FileText, tone: 'warning', label: 'Proposal' },
  note: { icon: StickyNote, tone: 'neutral', label: 'Note' },
  contract: { icon: FileSignature, tone: 'success', label: 'Contract' },
}

const toneBg: Record<Tone, string> = {
  success: 'bg-success-soft text-success',
  accent: 'bg-accent-soft text-accent',
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-surface-2 text-text-secondary',
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ActivityFeed() {
  return (
    <div className="card-static p-5 lg:p-6 h-full">
      <div className="mb-6">
        <h3 className="h-title">Recent Activity</h3>
        <p className="h-subtitle">Latest touchpoints and notes</p>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, idx) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon
          const isLast = idx === mockActivities.length - 1
          return (
            <div key={activity.id} className="flex gap-3 relative">
              {!isLast && (
                <div
                  className="absolute left-[15px] top-8 bottom-0 w-px border-l border-dashed border-border-default"
                  aria-hidden
                />
              )}
              <div
                className={cn(
                  'w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10',
                  toneBg[config.tone]
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] font-semibold text-text-primary tracking-[-0.005em]">
                    {config.label}
                  </span>
                  <span className="font-mono tabular text-[11.5px] text-text-tertiary flex-shrink-0">
                    {formatDate(activity.date)}
                  </span>
                </div>
                <p className="text-[12.5px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
