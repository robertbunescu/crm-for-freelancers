import { cn } from '@/lib/utils'

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('shimmer rounded-md', className)} style={style} />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-xl bg-surface-1 border border-border-default p-5 space-y-4 shadow-xs">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-12 rounded-sm" />
      </div>
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border-subtle">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ) : (
            <Skeleton className={`h-3.5 ${i === cols - 1 ? 'w-16 ml-auto' : 'w-24'}`} />
          )}
        </td>
      ))}
    </tr>
  )
}

export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} flex items-end gap-2 px-4 pb-4`}>
      {[40, 65, 50, 80, 60, 90, 75, 85, 70, 95, 80, 100].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-surface-1 border border-border-default p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="pt-3 border-t border-border-subtle space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

export function TaskRowSkeleton() {
  return (
    <div className="flex items-start gap-4 px-6 py-4 border-b border-border-subtle">
      <Skeleton className="w-5 h-5 rounded-md mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-5 w-20 rounded-sm" />
          </div>
        </div>
        <Skeleton className="h-3 w-full max-w-sm" />
        <div className="flex gap-3 mt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}
