'use client'

import Link from 'next/link'
import { Globe, Mail, ArrowRight, Building2 } from 'lucide-react'
import type { Client } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ClientsGridProps {
  clients: Client[]
  view: 'grid' | 'list'
}

const formatCurrency = (v: number) => `$${v.toLocaleString()}`

const formatSince = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function ClientsGrid({ clients, view }: ClientsGridProps) {
  if (clients.length === 0) {
    return (
      <div className="card-static flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div
          className="w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center mb-4"
          style={{
            boxShadow:
              'inset 0 1px 0 rgb(255 255 255 / 0.04), 0 0 0 1px rgb(var(--border-subtle))',
          }}
        >
          <Building2 className="w-6 h-6 text-text-tertiary" />
        </div>
        <p className="text-[14px] font-semibold text-text-primary tracking-[-0.005em]">
          No clients yet
        </p>
        <p className="text-[12.5px] text-text-tertiary mt-1.5 max-w-xs">
          Add your first client to start tracking revenue and activity.
        </p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="card-static overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-2/40 border-b border-border-subtle">
              <th className="text-left px-5 lg:px-6 h-9 align-middle text-micro text-text-tertiary uppercase">
                Client
              </th>
              <th className="text-left px-4 h-9 align-middle text-micro text-text-tertiary uppercase hidden md:table-cell">
                Industry
              </th>
              <th className="text-left px-4 h-9 align-middle text-micro text-text-tertiary uppercase hidden lg:table-cell">
                Location
              </th>
              <th className="text-right px-4 h-9 align-middle text-micro text-text-tertiary uppercase">
                Revenue
              </th>
              <th className="text-left px-4 h-9 align-middle text-micro text-text-tertiary uppercase hidden sm:table-cell">
                Client Since
              </th>
              <th className="px-4 h-9" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <tr
                key={client.id}
                className={cn(
                  'group row-rail cursor-pointer',
                  'transition-colors duration-fast hover:bg-surface-2/60',
                  i !== clients.length - 1 && 'border-b border-border-subtle'
                )}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{
                        background: client.avatarColor,
                        boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.16)',
                      }}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-text-primary tracking-[-0.005em]">
                        {client.name}
                      </div>
                      <div className="text-[11.5px] text-text-tertiary">
                        {client.company}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-[12.5px] text-text-secondary">
                    {client.industry}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-[12.5px] text-text-secondary">
                    {client.location}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono tabular text-[13px] font-semibold text-text-primary">
                    {formatCurrency(client.revenue)}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="font-mono tabular text-[11.5px] text-text-tertiary">
                    {formatSince(client.since)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/clients/${client.id}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
      {clients.map((client, idx) => (
        <Link key={client.id} href={`/clients/${client.id}`}>
          <div
            className={cn(
              'card-premium p-5 lg:p-6 cursor-pointer group h-full animate-slide-up'
            )}
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                  style={{
                    background: client.avatarColor,
                    boxShadow:
                      'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px rgb(0 0 0 / 0.08)',
                  }}
                >
                  {getInitials(client.name)}
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-text-primary tracking-[-0.01em]">
                    {client.name}
                  </div>
                  <div className="text-[11.5px] text-text-tertiary mt-0.5">
                    {client.company}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-base" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-micro text-text-tertiary uppercase">
                  Revenue
                </p>
                <p className="font-mono tabular text-[17px] font-semibold text-text-primary mt-1 tracking-[-0.015em]">
                  {formatCurrency(client.revenue)}
                </p>
              </div>
              <div>
                <p className="text-micro text-text-tertiary uppercase">
                  Since
                </p>
                <p className="font-mono tabular text-[13px] font-medium text-text-primary mt-1">
                  {formatSince(client.since)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle space-y-2">
              <div className="flex items-center gap-2 text-[11.5px] text-text-tertiary">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[11.5px] text-text-tertiary">
                <Globe className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{client.website}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center h-5 px-1.5 rounded-sm text-[10.5px] font-semibold bg-surface-2 text-text-secondary">
                {client.industry}
              </span>
              <span className="inline-flex items-center h-5 px-1.5 rounded-sm text-[10.5px] font-semibold bg-surface-2 text-text-secondary">
                {client.location}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
