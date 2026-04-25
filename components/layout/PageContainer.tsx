import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  /**
   * "default" — comfortable max-width for general pages
   * "wide"    — wider canvas for board / kanban-style pages
   * "narrow"  — focused single-column reads (settings, forms)
   */
  size?: 'default' | 'wide' | 'narrow'
  /** When true, removes bottom padding (e.g. for full-bleed boards). */
  flush?: boolean
}

const sizeMap = {
  default: 'max-w-[1280px]',
  wide: 'max-w-[1480px]',
  narrow: 'max-w-[860px]',
}

export function PageContainer({
  children,
  className,
  size = 'default',
  flush = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 sm:px-6 lg:px-8',
        flush ? 'pt-6 lg:pt-8' : 'py-6 lg:py-8',
        sizeMap[size],
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  )
}

interface PageSectionProps {
  children: React.ReactNode
  className?: string
}

export function PageSection({ children, className }: PageSectionProps) {
  return <section className={cn('space-y-5', className)}>{children}</section>
}
