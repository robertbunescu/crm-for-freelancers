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
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-surface-2/40 border-b border-border-subtle">
              <th className="text-left px-5 lg:px-6 h-9 align-middle text-micro text-text-tertiary uppercase">
                Lead
              </th>
              <th className="text-left px-4 h-9 align-middle text-micro text-text-tertiary uppercase hidden sm:table-cell">
                Status
              </th>
              <th className="text-right px-5 lg:px-6 h-9 align-middle text-micro text-text-tertiary uppercase">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map((lead, i) => (
              <tr
                key={lead.id}
                className={cn(
                  'group row-rail cursor-pointer',
                  'transition-colors duration-fast',
                  'hover:bg-surface-2/60',
                  i !== recent.length - 1 && 'border-b border-border-subtle'
                )}
              >
                <td className="px-5 lg:px-6 py-3 align-middle">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <div className="text-[13.5px] font-semibold text-text-primary leading-tight tracking-[-0.01em]">
                        {lead.name}
                      </div>
                      <div className="text-[11.5px] text-text-tertiary mt-0.5">
                        {lead.company}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle hidden sm:table-cell">
                  <LeadStatusBadge status={lead.status} withDot />
                </td>
                <td className="px-5 lg:px-6 py-3 align-middle text-right">
                  <span className="font-mono tabular text-[13px] font-semibold text-text-primary">
                    {formatCurrency(lead.value)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
