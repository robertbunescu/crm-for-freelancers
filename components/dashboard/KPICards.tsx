'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const sparklines: Record<string, number[]> = {
  leads: [22, 28, 24, 33, 30, 36, 41, 38, 44, 42, 46, 47],
  clients: [2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
  conversion: [12, 13, 12.2, 14, 13.5, 15, 16, 16.5, 17, 17.5, 18, 18.2],
  revenue: [22, 28, 30, 34, 32, 38, 36, 40, 39, 42, 43.2, 44.5],
}

interface Stats {
  totalLeads: number
  activeClients: number
  conversionRate: number
  monthlyRevenue: number
}

function Sparkline({
  data,
  tone = 'accent',
}: {
  data: number[]
  tone?: 'accent' | 'success' | 'warning' | 'danger'
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 96
  const height = 32
  const step = width / (data.length - 1)
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(' ')
  const strokeVar =
    tone === 'success'
      ? 'hsl(var(--success))'
      : tone === 'warning'
      ? 'hsl(var(--warning))'
      : tone === 'danger'
      ? 'hsl(var(--danger))'
      : 'hsl(var(--accent))'
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={strokeVar}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const defaultStats: Stats = {
  totalLeads: 47,
  activeClients: 5,
  conversionRate: 18.2,
  monthlyRevenue: 44500
}

export function KPICards() {
  const { userData } = useAuth()
  const [stats, setStats] = useState<Stats>(defaultStats)

  useEffect(() => {
    if (!userData?.id) return

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/stats?userId=${userData.id}`)
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [userData?.id])

  const kpis = [
    {
      label: 'Total Leads',
      value: stats.totalLeads.toString(),
      change: 12.5,
      changeLabel: 'vs last month',
      spark: sparklines.leads,
      tone: 'accent' as const,
    },
    {
      label: 'Active Clients',
      value: stats.activeClients.toString(),
      change: 25.0,
      changeLabel: 'vs last month',
      spark: sparklines.clients,
      tone: 'success' as const,
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: 3.1,
      changeLabel: 'vs last month',
      spark: sparklines.conversion,
      tone: 'warning' as const,
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: 8.3,
      changeLabel: 'vs March',
      spark: sparklines.revenue,
      tone: 'accent' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
      {kpis.map(({ label, value, change, changeLabel, spark, tone }, idx) => {
        const isPositive = change >= 0
        return (
          <div
            key={label}
            className={cn(
              'card-premium p-5 cursor-default flex flex-col justify-between',
              'min-h-[148px] animate-slide-up'
            )}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="text-micro text-text-tertiary uppercase">
                {label}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 h-5 px-1.5 rounded-sm',
                  'text-[11px] font-semibold tabular leading-none',
                  'transition-transform duration-base',
                  isPositive
                    ? 'bg-success-soft text-success'
                    : 'bg-danger-soft text-danger'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}
                {change}%
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="font-mono tabular text-[32px] leading-none font-semibold tracking-[-0.03em] text-text-primary">
                  {value}
                </div>
                <div className="text-[11.5px] text-text-tertiary mt-2 tracking-[-0.005em]">
                  {changeLabel}
                </div>
              </div>
              <div className="opacity-90 transition-opacity duration-base">
                <Sparkline data={spark} tone={tone} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
