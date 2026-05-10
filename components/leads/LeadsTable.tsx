'use client'

import { useState } from 'react'
import {
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'
import type { Lead, LeadStatus } from '@/lib/types'
import { LeadStatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

interface LeadsTableProps {
  leads: Lead[]
}

type SortField = 'name' | 'company' | 'value' | 'lastContact'
type SortDir = 'asc' | 'desc'

const statusFilters: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

const formatCurrency = (v: number) => `$${v.toLocaleString()}`
const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('lastContact')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const filtered = leads
    .filter(l => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      const matchSearch =
        !search ||
        [l.name, l.company, l.email].some(v =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      return matchStatus && matchSearch
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortField === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortField === 'company') cmp = a.company.localeCompare(b.company)
      else if (sortField === 'value') cmp = a.value - b.value
      else if (sortField === 'lastContact')
        cmp = a.lastContact.localeCompare(b.lastContact)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3 h-3 opacity-30" />
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-accent" />
    ) : (
      <ChevronDown className="w-3 h-3 text-accent" />
    )
  }

  return (
    <div className="card-static overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 lg:px-6 py-3.5 border-b border-border-subtle flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={cn(
              'w-full h-8 pl-9 pr-3 text-[13px] rounded-md',
              'bg-surface-inset text-text-primary placeholder:text-text-tertiary',
              'border border-border-default',
              'transition-[background-color,border-color,box-shadow] duration-base',
              'hover:border-border-strong',
              'focus:outline-none focus:border-accent focus:shadow-focus focus:bg-surface-1'
            )}
          />
        </div>
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
        <span className="text-[11.5px] text-text-tertiary whitespace-nowrap sm:ml-auto font-mono tabular">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
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
            <Search className="w-4 h-4 text-text-tertiary" />
          </div>
          <p className="text-[14px] font-semibold text-text-primary tracking-[-0.005em]">
            No leads found
          </p>
          <p className="text-[12.5px] text-text-tertiary mt-1.5 max-w-xs">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
            }}
            className="mt-5 px-3 h-8 rounded-md text-[12px] font-medium text-accent hover:text-accent-hover hover:bg-accent-soft transition-all duration-base"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="w-full">
            {/* Header - Full width on xl, hide columns at smaller breakpoints */}
            <div
              className="grid bg-surface-2/40 border-b border-border-subtle px-5 lg:px-6 h-10"
              style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.3fr 0.9fr auto' }}
            >
              <div className="flex items-center">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-micro text-text-tertiary uppercase hover:text-text-primary transition-colors"
                >
                  Lead <SortIcon field="name" />
                </button>
              </div>
              <div className="hidden md:flex items-center">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center gap-1 text-micro text-text-tertiary uppercase hover:text-text-primary transition-colors"
                >
                  Company <SortIcon field="company" />
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-micro text-text-tertiary uppercase">
                  Status
                </span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center gap-1 text-micro text-text-tertiary uppercase hover:text-text-primary transition-colors"
                >
                  Value <SortIcon field="value" />
                </button>
              </div>
              <div className="hidden lg:flex items-center pl-6">
                <button
                  onClick={() => handleSort('lastContact')}
                  className="flex items-center gap-1 text-micro text-text-tertiary uppercase hover:text-text-primary transition-colors"
                >
                  Last Contact <SortIcon field="lastContact" />
                </button>
              </div>
              <div className="hidden xl:flex items-center">
                <span className="text-micro text-text-tertiary uppercase">
                  Source
                </span>
              </div>
              <div className="w-12" />
            </div>

            {/* Rows */}
            {filtered.map((lead, i) => (
              <div
                key={lead.id}
                className={cn(
                  'group grid cursor-pointer row-rail',
                  'transition-colors duration-fast',
                  'hover:bg-surface-2/60',
                  'px-5 lg:px-6 py-3.5',
                  i !== filtered.length - 1 && 'border-b border-border-subtle'
                )}
                style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.3fr 0.9fr auto' }}
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
                      {lead.email}
                    </div>
                  </div>
                </div>
                <div className="min-w-0 hidden md:block">
                  <div className="text-[13px] font-medium text-text-primary tracking-[-0.005em] truncate">
                    {lead.company}
                  </div>
                  <div className="text-[11.5px] text-text-tertiary mt-0.5 truncate">
                    {lead.industry}
                  </div>
                </div>
                <div className="flex items-center">
                  <LeadStatusBadge status={lead.status} withDot />
                </div>
                <div className="flex items-center">
                  <span className="font-mono tabular text-[13px] font-semibold text-text-primary">
                    {formatCurrency(lead.value)}
                  </span>
                </div>
                <div className="items-center hidden lg:flex pl-6">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-text-tertiary">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="font-mono tabular">
                      {formatDate(lead.lastContact)}
                    </span>
                  </div>
                </div>
                <div className="items-center hidden xl:flex">
                  <span className="inline-flex items-center h-5 px-1.5 rounded-sm text-[10.5px] font-semibold bg-surface-2 text-text-secondary">
                    {lead.source}
                  </span>
                </div>
                <div className="flex items-center justify-end w-12">
                  <button
                    className={cn(
                      'w-7 h-7 rounded-md flex items-center justify-center',
                      'text-text-tertiary hover:text-text-primary hover:bg-surface-2',
                      'opacity-0 group-hover:opacity-100 transition-all duration-fast'
                    )}
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
