'use client'

import { mockLeadSources } from '@/lib/mock-data'

const toneVars = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function LeadSourceChart() {
  const max = Math.max(...mockLeadSources.map(s => s.value))

  return (
    <div className="card-static p-5 lg:p-6 h-full">
      <div className="mb-6">
        <h3 className="h-title">Lead Sources</h3>
        <p className="h-subtitle">Distribution across channels</p>
      </div>

      <div className="space-y-4">
        {mockLeadSources.map(({ name, value }, i) => {
          const width = (value / max) * 100
          const tone = toneVars[i % toneVars.length]
          return (
            <div key={name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: tone }}
                  />
                  <span className="text-[12.5px] font-medium text-text-primary tracking-[-0.005em]">
                    {name}
                  </span>
                </div>
                <span className="font-mono tabular text-[12.5px] font-semibold text-text-primary">
                  {value}%
                </span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-slow ease-out-expo group-hover:opacity-90"
                  style={{
                    width: `${width}%`,
                    background: `linear-gradient(90deg, ${tone} 0%, ${tone} 70%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
