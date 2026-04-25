import { cn } from '@/lib/utils'

const inputBase =
  'w-full h-10 px-3 text-[13.5px] rounded-md bg-surface-inset text-text-primary placeholder:text-text-tertiary border border-border-default transition-[background-color,border-color,box-shadow] duration-base hover:border-border-strong focus:outline-none focus:bg-surface-1 focus:border-accent focus:shadow-focus'

interface SettingsFieldProps {
  label: string
  hint?: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function SettingsField({
  label,
  hint,
  htmlFor,
  required,
  children,
  className,
}: SettingsFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[12px] font-medium text-text-secondary tracking-[-0.005em]"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[11.5px] text-text-tertiary leading-relaxed">{hint}</p>
      )}
    </div>
  )
}

export function settingsInputCls(extra?: string) {
  return cn(inputBase, extra)
}

interface SettingsCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  tone?: 'default' | 'danger'
}

export function SettingsCard({
  title,
  description,
  children,
  footer,
  className,
  tone = 'default',
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        'card-premium',
        tone === 'danger' &&
          'border-[hsl(var(--danger)/0.25)] hover:border-[hsl(var(--danger)/0.35)]',
        className
      )}
    >
      <div className="px-6 pt-5 pb-5">
        <div className="mb-5">
          <h3
            className={cn(
              'text-[15px] font-semibold tracking-[-0.01em]',
              tone === 'danger' ? 'text-danger' : 'text-text-primary'
            )}
          >
            {title}
          </h3>
          {description && (
            <p className="text-[12.5px] text-text-tertiary mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
      {footer && (
        <div
          className={cn(
            'border-t flex items-center justify-end gap-2 px-6 py-3.5',
            tone === 'danger'
              ? 'border-[hsl(var(--danger)/0.18)] bg-[hsl(var(--danger)/0.04)]'
              : 'border-border-subtle bg-surface-2/40'
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
