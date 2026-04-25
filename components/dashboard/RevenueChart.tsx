'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { mockRevenueData } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const formatCurrency = (v: number) => `$${(v / 1000).toFixed(0)}k`

const ranges = ['7D', '30D', '3M', '12M', 'YTD'] as const
type Range = (typeof ranges)[number]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className={cn(
        'rounded-lg p-3 text-[12px] min-w-[160px]',
        'bg-surface-3/95 backdrop-blur-xl',
        'border border-border-strong shadow-lg'
      )}
    >
      <p className="font-semibold text-text-primary mb-2 tracking-[-0.005em]">
        {label}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-text-tertiary capitalize">{entry.name}</span>
          </div>
          <span className="font-mono tabular font-semibold text-text-primary">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart() {
  const [range, setRange] = useState<Range>('12M')

  return (
    <div className="card-static p-5 lg:p-6 h-full">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h3 className="h-title">Revenue Overview</h3>
          <p className="h-subtitle">Performance vs target</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-[11.5px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-text-tertiary">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />
              <span className="text-text-tertiary">Target</span>
            </div>
          </div>
          <div className="segmented">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                data-active={range === r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockRevenueData}
            margin={{ top: 4, right: 4, bottom: 0, left: -8 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.28} />
                <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--text-tertiary))" stopOpacity={0.08} />
                <stop offset="95%" stopColor="hsl(var(--text-tertiary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgb(var(--border-subtle))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'hsl(var(--text-tertiary))' }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11, fill: 'hsl(var(--text-tertiary))' }}
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'hsl(var(--accent))',
                strokeWidth: 1,
                strokeDasharray: '2 4',
              }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--text-tertiary))"
              strokeWidth={1.25}
              strokeDasharray="4 4"
              fill="url(#targetGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--accent))"
              strokeWidth={1.75}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: 'hsl(var(--bg-app))',
                fill: 'hsl(var(--accent))',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
