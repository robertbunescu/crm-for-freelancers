'use client'

import {
  Phone,
  Mail,
  Video,
  FileText,
  StickyNote,
  Signature as FileSignature,
} from 'lucide-react'
import type { Activity, ActivityType } from '@/lib/types'
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

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="card-premium p-6">
      <div className="mb-5">
        <h3 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">
          Activity Timeline
        </h3>
        <p className="text-[12px] text-text-tertiary mt-1">
          {activities.length} recorded interactions
        </p>
      </div>

      <div className="space-y-5">
        {activities.map((activity, idx) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon
          const isLast = idx === activities.length - 1
          return (
            <div key={activity.id} className="flex gap-4 relative">
              {!isLast && (
                <div
                  className="absolute left-[17px] top-10 bottom-0 w-px border-l border-dashed border-border-default"
                  aria-hidden
                />
              )}
              <div
                className={cn(
                  'w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10',
                  toneBg[config.tone]
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[13px] font-semibold text-text-primary tracking-[-0.005em]">
                    {config.label}
                  </span>
                  <span className="font-mono tabular text-[11.5px] text-text-tertiary flex-shrink-0">
                    {formatDate(activity.date)}
                  </span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-[11.5px] text-text-tertiary mt-1.5">
                  by {activity.user}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
