'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { mockLeads } from '@/lib/mock-data'
import { LeadStatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

const formatCurrency = (v: number) => `$${v.toLocaleString()}`

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function RecentLeadsTable() {
  const recent = mockLeads.slice(0, 6)

  return (
    <div className="card-static overflow-hidden">
      <div className="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-border-subtle">
        <div>
          <h3 className="h-title">Recent Leads</h3>
          <p className="h-subtitle">Latest activity in your pipeline</p>
        </div>
        <Link
          href="/leads"
          className={cn(
            'group inline-flex items-center gap-1 text-[12px] font-medium',
            'text-accent hover:text-accent-hover',
            'transition-colors duration-base'
          )}
        >
          View all
          <ArrowRight className="w-3 h-3 transition-transform duration-base group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="w-full text-[13px]">
          <div
            className="grid bg-surface-2/40 border-b border-border-subtle px-5 lg:px-6 h-9"
            style={{ gridTemplateColumns: '1.7fr 0.8fr 0.8fr' }}
          >
            <div className="flex items-center text-micro text-text-tertiary uppercase">
              Lead
            </div>
            <div className="items-center text-micro text-text-tertiary uppercase hidden sm:flex">
              Status
            </div>
            <div className="flex items-center justify-end text-micro text-text-tertiary uppercase">
              Value
            </div>
          </div>

          {recent.map((lead, i) => (
            <div
              key={lead.id}
              className={cn(
                'group grid cursor-pointer row-rail',
                'transition-colors duration-fast',
                'hover:bg-surface-2/60',
                'px-5 lg:px-6 py-3',
                i !== recent.length - 1 && 'border-b border-border-subtle'
              )}
              style={{ gridTemplateColumns: '1.7fr 0.8fr 0.8fr' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 transition-transform duration-base group-hover:scale-[1.04]"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
                    boxShadow:
                      'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover) / 0.4)',
                  }}
                >
                  {getInitials(lead.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-text-primary leading-tight tracking-[-0.01em] truncate">
                    {lead.name}
                  </div>
                  <div className="text-[11.5px] text-text-tertiary mt-0.5 truncate">
                    {lead.company}
                  </div>
                </div>
              </div>
              <div className="items-center hidden sm:flex">
                <LeadStatusBadge status={lead.status} withDot />
              </div>
              <div className="flex items-center justify-end">
                <span className="font-mono tabular text-[13px] font-semibold text-text-primary">
                  {formatCurrency(lead.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
